import { OrderedSet } from "immutable";
import { EditorState, Modifier }  from "@gland/draft-ts";
import * as utils from "./utils";
import { getFixedWrapperFirstKey } from "../model";
/**
 * 折叠editorState
 * @param editorState
 */
export function makeCollapsed(editorState) {
    let selection = editorState.getSelection();
    if (selection.isCollapsed()) {
        return { editorState, toUpdateKeys: [] };
    }
    selection = utils.getForwardSelection(selection);
    let contentState = editorState.getCurrentContent();
    contentState = utils.removeRange(contentState, selection);
    selection = selection.merge({
        focusKey: selection.anchorKey,
        focusOffset: selection.anchorOffset
    });
    editorState = EditorState.push(editorState, contentState, "delete-character");
    editorState = EditorState.forceSelection(editorState, selection);
    return { editorState, toUpdateKeys: [selection.anchorKey] };
}

/**
 * 在当前文本块某位置插入文本，样式默认继承
 * @param editorState
 * @param text
 * @param style  样式数组
 */
export function insertText(editorState, text: string, style?: Array<string>) {
    editorState = makeCollapsed(editorState).editorState;
    let textStyle;
    if (style) {
        textStyle = OrderedSet(style);
    } else {
        textStyle = editorState.getCurrentInlineStyle()
    }
    let content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    content = utils.addText(content, selection, text, textStyle);
    editorState = EditorState.push(editorState, content, "insert-characters");

    const key = selection.anchorKey;
    const offset = selection.anchorOffset + text.length;
    const newSelection = selection.merge({
        anchorOffset: offset,
        anchorKey: key,
        focusOffset: offset,
        focusKey: key
    });
    editorState = EditorState.forceSelection(editorState, newSelection);
    return { editorState, toUpdateKeys: [selection.anchorKey] };
}

/**
 * 默认退格操作
 * @param editorState
 * @param length
 */
export function backspace(editorState) {
    let selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
        return makeCollapsed(editorState);
    }
    let content = editorState.getCurrentContent();
    if (selection.anchorOffset === 0) {
        const beforeBlock = content.getBlockBefore(selection.anchorKey);
        if (!beforeBlock) {
            return { editorState, toUpdateKeys: [] };
        }
        const currentBlock = content.getBlockForKey(selection.anchorKey);
        const currentData = currentBlock.getData();
        if (!currentData.get("type")) {
            console.error("在非文本块里进行任何的draft文本操作不被许可");
            return { editorState, toUpdateKeys: [] };
        }
        if (getFixedWrapperFirstKey(currentBlock)) {
            return { editorState, toUpdateKeys: [] };
        }
        const beforeData = beforeBlock.getData();
        if (!beforeData.get("type")) {
            content = utils.deleteBlock(content, beforeBlock.getKey());
            editorState = EditorState.push(editorState, content, "delete-character");
            return { editorState, toUpdateKeys: ["%%%"] };
        }
        let firstKey = getFixedWrapperFirstKey(beforeBlock);
        if (firstKey) {
            let blockMap = content.getBlockMap();
            let theBlock = beforeBlock;
            let theKey = beforeBlock.getKey();
            do {
                blockMap = blockMap.delete(theKey);
                theBlock = content.getBlockBefore(theKey);
                if (theBlock && getFixedWrapperFirstKey(theBlock) === firstKey) {
                    theKey = theBlock.getKey();
                } else {
                    theKey = null;
                }
            } while (theKey);
            content = content.set("blockMap", blockMap);
            editorState = EditorState.push(editorState, content, "delete-character");
            return { editorState, toUpdateKeys: ["%%%"] };
        }
        content = utils.mergeBlock(content, selection.anchorKey);
        selection = selection.merge({
            anchorKey: beforeBlock.getKey(),
            anchorOffset: beforeBlock.getText().length,
            focusKey: beforeBlock.getKey(),
            focusOffset: beforeBlock.getText().length
        });
        editorState = EditorState.push(editorState, content, "delete-character");
        editorState = EditorState.forceSelection(editorState, selection);
        return { editorState, toUpdateKeys: [selection.anchorKey] };
    }
    // notice: 这里假设了immutable实体占用的文字长度是1，确实也该如此
    let offset = selection.anchorOffset - 1;
    selection = selection.merge({ anchorOffset: offset });
    content = Modifier.removeRange(content, selection, "backward");
    selection = selection.merge({ focusOffset: offset });
    editorState = EditorState.push(editorState, content, "delete-character");
    editorState = EditorState.forceSelection(editorState, selection);
    return { editorState, toUpdateKeys: [selection.anchorKey] };
}

/**
 * 默认换行操作
 */
export function lineFeed(editorState) {
    editorState = makeCollapsed(editorState).editorState;
    const selection = editorState.getSelection();
    let content = editorState.getCurrentContent();
    let currentBlock = content.getBlockForKey(selection.anchorKey);
    if (getFixedWrapperFirstKey(currentBlock)) {
        editorState = insertText(editorState, "\n");
    } else {
        // notice 这里假设了操作都在文本块中进行
        content = utils.splitBlock(content, selection.anchorKey, undefined, selection.anchorOffset);
        const key = content.getKeyAfter(selection.anchorKey);
        const newSelection: any = utils.basicSelectionState.merge({
            anchorKey: key,
            focusKey: key
        });
        editorState = EditorState.push(editorState, content, "insert-characters");
        editorState = EditorState.forceSelection(editorState, newSelection);
    }
    return { editorState, toUpdateKeys: [selection.anchorKey] };
}

/**
 * 在当前块的下方插入新块，若处在固定包装块里面则不进行任何操作
 */
export function insertNewLine(editorState) {
    let content = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    selection = utils.getForwardSelection(selection);
    let block = content.getBlockForKey(selection.focusKey);
    let firstKey = getFixedWrapperFirstKey(block);
    if (firstKey) {
        return { editorState, toUpdateKeys: [] };
    }
    content = utils.insertBlock(content, selection.focusKey);
    let newKey = content.getKeyAfter(selection.focusKey);
    let newSelection: any = utils.basicSelectionState.merge({
        focusKey: newKey,
        anchorKey: newKey
    });
    editorState = EditorState.push(editorState, content, "insert-fragment");
    editorState = EditorState.forceSelection(editorState, newSelection);
    return { editorState, toUpdateKeys: [selection.focusKey] };
}
