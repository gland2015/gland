/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 * @emails oncall+draft_js
 */

"use strict";

import { BlockNodeRecord } from "../../model/immutable/BlockNodeRecord";
import { DraftInlineStyle } from "../../model/immutable/DraftInlineStyle";
import SelectionState from "../../model/immutable/SelectionState";

import DraftEditorTextNode from "./DraftEditorTextNode.react";
import React, { ReactNode } from "react";
import invariant from "fbjs/lib/invariant";
import isHTMLBRElement from "../utils/isHTMLBRElement";
import { setDraftEditorSelection } from "../selection/setDraftEditorSelection";

type Props = {
    // The block that contains this leaf.
    block: BlockNodeRecord;

    // Mapping of style names to CSS declarations.
    customStyleMap: Object;

    // Function that maps style names to CSS style objects.
    customStyleFn: Function;

    // Whether to force the DOM selection after render.
    forceSelection: boolean;

    // Whether this leaf is the last in its block. Used for a DOM hack.
    isLast: boolean;

    offsetKey: string;

    // The current `SelectionState`, used to represent a selection range in the
    // editor
    selection: SelectionState;

    // The offset of this string within its block.
    start: number;

    // The set of style(s) names to apply to the node.
    styleSet: DraftInlineStyle;

    // The full text to be rendered within this node.
    text: string;

    custom?: any;
};

/**
 * All leaf nodes in the editor are spans with single text nodes. Leaf
 * elements are styled based on the merging of an optional custom style map
 * and a default style map.
 *
 * `DraftEditorLeaf` also provides a wrapper for calling into the imperative
 * DOM Selection API. In this way, top-level components can declaratively
 * maintain the selection state.
 */
class DraftEditorLeaf extends React.Component<Props> {
    /**
     * By making individual leaf instances aware of their context within
     * the text of the editor, we can set our selection range more
     * easily than we could in the non-React world.
     *
     * Note that this depends on our maintaining tight control over the
     * DOM structure of the DraftEditor component. If leaves had multiple
     * text nodes, this would be harder.
     */

    leaf: HTMLElement;

    _setSelection(): void {
        const { selection, isLast } = this.props;
        const isCustom = this.leaf.dataset["type"] === "custom";
        // gland 重要更改，防止非contenteditable元素获取焦点
        if (!isLast && isCustom) {
            return;
        }
        // If selection state is irrelevant to the parent block, no-op.
        if (selection == null || !selection.getHasFocus()) {
            return;
        }

        const { block, start, text } = this.props;
        const blockKey = block.getKey();
        let end = start + text.length;
        // gland
        if (isCustom || typeof text === "object") {
            end = start + 1;
        }
        if (!selection.hasEdgeWithin(blockKey, start, end)) {
            return;
        }

        // gland
        if (isCustom) {
            if (selection.focusOffset === selection.anchorOffset) {
                if (selection.anchorOffset === start) {
                    setIndepentSelection(selection, this.leaf, -1);
                } else {
                    setIndepentSelection(selection, this.leaf, 0);
                }
            }
            return;
        }
        if (typeof text === "object") {
            setDraftEditorSelection(selection, this.leaf.firstChild, blockKey, start, end);
            return;
        }
        // Determine the appropriate target node for selection. If the child
        // is not a text node, it is a <br /> spacer. In this case, use the
        // <span> itself as the selection target.
        const node = this.leaf;
        invariant(node, "Missing node");
        const child = node.firstChild;
        invariant(child, "Missing child");
        let targetNode;

        if (child.nodeType === Node.TEXT_NODE) {
            targetNode = child;
        } else if (isHTMLBRElement(child)) {
            targetNode = node;
        } else {
            if (child.firstChild) {
                targetNode = child.firstChild;
            } else {
                // console.log("my  set", node, { child }, selection.toJS(), blockKey, start, end);
                setCursorPosition(child, 0);
                return;
            }
        }
        // console.log("selection set", this.leaf, selection.toJS(), targetNode, blockKey, start, end);
        setDraftEditorSelection(selection, targetNode, blockKey, start, end);
    }

    shouldComponentUpdate(nextProps: Props): boolean {
        // gland notice styleSet lead update
        const leafNode = this.leaf;
        invariant(leafNode, "Missing leafNode");
        const shouldUpdate = this.props.text !== nextProps.text || nextProps.styleSet !== this.props.styleSet || nextProps.forceSelection;
        return shouldUpdate;
    }

    componentDidUpdate(): void {
        this._setSelection();
    }

    componentDidMount(): void {
        this._setSelection();
    }

    render(): ReactNode {
        const { block, isLast, custom } = this.props;
        let { text } = this.props;

        // If the leaf is at the end of its block and ends in a soft newline, append
        // an extra line feed character. Browsers collapse trailing newline
        // characters, which leaves the cursor in the wrong place after a
        // shift+enter. The extra character repairs this.

        // gland 改变表述
        if (isLast) {
            if (typeof text === "string") {
                if (text.endsWith("\n")) {
                    text += "\n";
                }
            }
        }

        const { customStyleMap, customStyleFn, offsetKey, styleSet } = this.props;
        let styleObj = styleSet.reduce((map: any, styleName) => {
            const mergedStyles: any = {};
            const style = customStyleMap[styleName];

            if (style !== undefined && map.textDecoration !== style.textDecoration) {
                // .trim() is necessary for IE9/10/11 and Edge
                mergedStyles.textDecoration = [map.textDecoration, style.textDecoration].join(" ").trim();
            }

            return Object.assign(map, style, mergedStyles);
        }, {});

        if (customStyleFn) {
            const newStyles = customStyleFn(styleSet, block);
            styleObj = Object.assign(styleObj, newStyles);
        }
        //                     {isLast ? <span data-text="r" ref={ref=>(this.lastleafR = ref)}  data-offset-key={offsetKey} >{"\r"}</span> : null}

        // gland  \r &#13; 可使光标垂直对齐正常和处在行尾时聚焦
        if (custom) {
            return (
                <span data-offset-key={offsetKey} ref={ref => (this.leaf = ref)} style={styleObj} data-type="custom" contentEditable={false}>
                    <span data-text="object">{custom}</span>
                    <span data-text="true">{"\r"}</span>
                </span>
            );
        }

        if (typeof text === "object") {
            return (
                <span data-offset-key={offsetKey} ref={ref => (this.leaf = ref)} style={styleObj}>
                    <span data-text="object">{text}</span>
                </span>
            );
        }

        return (
            <span data-offset-key={offsetKey} ref={ref => (this.leaf = ref)} style={styleObj}>
                <DraftEditorTextNode isLast={isLast}>{text}</DraftEditorTextNode>
            </span>
        );
    }
}

export default DraftEditorLeaf;

//gland

/**
 * 设置光标标位置
 * @param ele
 * @param offset
 */
function setCursorPosition(ele, offset) {
    let selection = window.getSelection();
    let range = document.createRange();
    range.setStart(ele, offset);
    range.setEnd(ele, offset);
    selection.removeAllRanges();
    selection.addRange(range);
}

function setIndepentSelection(selectionState, leaf, k) {
    let ele = leaf.parentElement;
    let offset = ele.childNodes.length + k;
    if (selectionState.isCollapsed()) {
        setCursorPosition(ele, offset);
        return;
    }
    // let anchorKey = selectionState.getAnchorKey();
    // let anchorOffset = selectionState.getAnchorOffset();
    // let focusKey = selectionState.getFocusKey();
    // let focusOffset = selectionState.getFocusOffset();
    // let isBackward = selectionState.getIsBackward();
    // if (anchorKey === focusKey) {
    //     console.log('eeeeee', selection)
    //     if (selection.rangeCount > 0) {
    //         range.setEnd(ele, offset);
    //         selection.addRange(range.cloneRange());
    //         return;
    //     }

    // }
    // if (isBackward) {
    //     [anchorKey, anchorOffset, focusKey, focusOffset] = [focusKey, focusOffset, anchorKey, anchorOffset];
    // }
    // if (blockKey === anchorKey) {
    //     range.setStart(ele, offset);
    //     selection.removeAllRanges();
    //     selection.addRange(range);
    //     return;
    // }
    // if (blockKey === focusKey) {
    //     range.setEnd(ele, offset);
    //     selection.addRange(range);
    //     return;
    // }
}
