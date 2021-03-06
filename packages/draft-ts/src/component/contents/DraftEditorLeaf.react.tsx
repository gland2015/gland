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
import { setDraftEditorSelection, addPointToSelection, addFocusToSelection, setCustomLeafRangeSelection } from "../selection/setDraftEditorSelection";
import clsx from "clsx";

type Props = {
    // The block that contains this leaf.
    block: BlockNodeRecord;

    // Mapping of style names to CSS declarations.
    customStyleMap: Object;

    readOnly?: boolean;

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
    rgtLeaf: HTMLElement;
    lftLeaf: HTMLElement;
    charzero = "\u200b";

    _setSelection(): void {
        const { selection, isLast } = this.props;

        // If selection state is irrelevant to the parent block, no-op.
        if (selection == null || !selection.getHasFocus()) {
            return;
        }

        const isCustom = this.leaf.dataset["type"] === "custom";
        const { block, start, text } = this.props;
        const blockKey = block.getKey();
        let end = start + text.length;

        // gland
        if (isCustom) {
            end = start + 1;
            if (this.rgtLeaf && this.rgtLeaf.innerText !== this.charzero) {
                this.rgtLeaf.innerHTML = this.charzero;
            }
            if (this.lftLeaf && this.lftLeaf.innerText !== this.charzero) {
                this.lftLeaf.innerHTML = this.charzero;
            }
        }
        if (!selection.hasEdgeWithin(blockKey, start, end)) {
            return;
        }

        // gland
        if (isCustom) {
            setCustomLeafRangeSelection(
                selection,
                this.lftLeaf && this.lftLeaf.firstChild,
                this.rgtLeaf && this.rgtLeaf.firstChild,
                blockKey,
                start,
                end
            );
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
            targetNode = child.firstChild;
            invariant(targetNode, "Missing targetNode");
        }
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
        const { block, isLast, start, custom } = this.props;
        let { text } = this.props;

        // If the leaf is at the end of its block and ends in a soft newline, append
        // an extra line feed character. Browsers collapse trailing newline
        // characters, which leaves the cursor in the wrong place after a
        // shift+enter. The extra character repairs this.
        if (isLast) {
            if (text.endsWith("\n")) {
                text += "\n";
            }
        }

        const { customStyleMap, customStyleFn, offsetKey, styleSet, readOnly } = this.props;

        let styleObj = styleSet.reduce((map: any, styleName) => {
            const mergedStyles: any = {};
            const style = customStyleMap[styleName];
            if (style !== undefined && map.textDecoration !== style.textDecoration) {
                // .trim() is necessary for IE9/10/11 and Edge
                mergedStyles.textDecoration = [map.textDecoration, style.textDecoration].join(" ").trim();
            }
            return Object.assign(map, style, mergedStyles);
        }, {});
        let className = null;
        if (customStyleFn) {
            const newStyles = customStyleFn(styleSet, block);
            if (newStyles.classNames?.length) {
                className = clsx(
                    newStyles["classNames"].map(function (name) {
                        return name.replace(/^\./, "");
                    })
                );
            }
            styleObj = Object.assign(styleObj, newStyles);
            delete styleObj["classNames"];
        }

        if (custom) {
            // gland 1、two custom ele together 2、firefox select the center，and chrome select ele 3、when it in line end need text
            //
            return (
                <React.Fragment>
                    {start === 0 && !readOnly ? (
                        <span ref={(r) => (this.lftLeaf = r)} data-offset-key={offsetKey} data-type="left">
                            {this.charzero}
                        </span>
                    ) : null}
                    <span
                        ref={(ref) => (this.leaf = ref)}
                        style={
                            readOnly
                                ? styleObj
                                : {
                                      ...styleObj,
                                      MozUserSelect: "none",
                                  }
                        }
                        className={className}
                        contentEditable={false}
                        data-offset-key={offsetKey}
                        data-type="custom"
                    >
                        <span data-text="object">{custom}</span>
                    </span>
                    {readOnly ? null : (
                        <span ref={(r) => (this.rgtLeaf = r)} data-offset-key={offsetKey} data-type="right">
                            {this.charzero}
                        </span>
                    )}
                </React.Fragment>
            );
        }

        return (
            <span data-offset-key={offsetKey} ref={(ref) => (this.leaf = ref)} style={styleObj} className={className}>
                <DraftEditorTextNode isLast={isLast}>{text}</DraftEditorTextNode>
            </span>
        );
    }
}

export default DraftEditorLeaf;

// gland
// /**
//  * @param ele
//  * @param offset
//  */
// function setCursorPosition(ele, offset) {
//     let selection = window.getSelection();
//     let range = document.createRange();
//     range.setStart(ele, offset);
//     range.setEnd(ele, offset);
//     selection.removeAllRanges();
//     selection.addRange(range);
// }

// function setIndepentSelection(selection, leaf, k) {
//     let ele = leaf.parentElement;
//     let offset = ele.childNodes.length + k;
//     if (selection.isCollapsed()) {
//         setCursorPosition(ele, offset);
//         return;
//     }
//     // let anchorKey = selectionState.getAnchorKey();
//     // let anchorOffset = selectionState.getAnchorOffset();
//     // let focusKey = selectionState.getFocusKey();
//     // let focusOffset = selectionState.getFocusOffset();
//     // let isBackward = selectionState.getIsBackward();
//     // if (anchorKey === focusKey) {
//     //     console.log('eeeeee', selection)
//     //     if (selection.rangeCount > 0) {
//     //         range.setEnd(ele, offset);
//     //         selection.addRange(range.cloneRange());
//     //         return;
//     //     }

//     // }
//     // if (isBackward) {
//     //     [anchorKey, anchorOffset, focusKey, focusOffset] = [focusKey, focusOffset, anchorKey, anchorOffset];
//     // }
//     // if (blockKey === anchorKey) {
//     //     range.setStart(ele, offset);
//     //     selection.removeAllRanges();
//     //     selection.addRange(range);
//     //     return;
//     // }
//     // if (blockKey === focusKey) {
//     //     range.setEnd(ele, offset);
//     //     selection.addRange(range);
//     //     return;
//     // }
// }
