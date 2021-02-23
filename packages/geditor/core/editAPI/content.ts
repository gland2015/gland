import { OrderedSet } from "immutable";
import { EditorState, Modifier, SelectionState } from "@gland/draft-ts";
import * as utils from "./utils";
/**
 * 折叠editorState
 * @param editorState
 */
export function makeCollapsed(editorState: EditorState) {
    let selection = editorState.getSelection();
    if (selection.isCollapsed()) {
        return { editorState, toUpdateKeys: [] };
    }
    selection = utils.getForwardSel(selection);
    let contentState = editorState.getCurrentContent();
    let removeResult = utils.removeRange(contentState, selection);
    selection = selection.merge({
        focusKey: selection.anchorKey,
        focusOffset: selection.anchorOffset,
    }) as any;
    editorState = EditorState.push(editorState, removeResult.content, "delete-character");
    editorState = EditorState.forceSelection(editorState, selection);
    return { editorState, toUpdateKeys: removeResult.toUpdateKeys };
}

/**
 * 在当前文本块某位置插入文本，样式默认继承
 * @param editorState
 * @param text
 * @param style  样式数组
 */
export function insertText(editorState: EditorState, text: string, style?: Array<string>, offsetDeviation = 0) {
    editorState = makeCollapsed(editorState).editorState;
    let textStyle;
    if (style) {
        textStyle = OrderedSet(style);
    } else {
        textStyle = editorState.getInlineStyleOverride() || editorState.getCurrentInlineStyle();
    }
    let content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    content = utils.addText(content, selection, text, textStyle);
    editorState = EditorState.push(editorState, content, "insert-characters");

    const key = selection.anchorKey;
    const offset = selection.anchorOffset + text.length + offsetDeviation;
    const newSelection = selection.merge({
        anchorOffset: offset,
        anchorKey: key,
        focusOffset: offset,
        focusKey: key,
    }) as SelectionState;
    editorState = EditorState.forceSelection(editorState, newSelection);
    return { editorState, toUpdateKeys: [selection.anchorKey] };
}

/**
 * 默认退格操作
 * @param editorState
 * @param length
 */
export function backspace(editorState: EditorState) {
    let selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
        return makeCollapsed(editorState);
    }

    let content = editorState.getCurrentContent();
    const targetKey = selection.anchorKey;
    const offset = selection.anchorOffset;

    if (offset === 0) {
        const beforeBlock = content.getBlockBefore(targetKey);
        if (!beforeBlock) {
            return { editorState, toUpdateKeys: [] };
        }
        const beforeKey = beforeBlock.getKey();

        const curDetail = utils.getBlockDetail(content, targetKey);
        if (curDetail.isHead || curDetail.isSubFirst || (curDetail.isSubBlock && !curDetail.head.grow)) {
            return { editorState, toUpdateKeys: [] };
        }
        if (!curDetail.isText) {
            content = utils.deleteBlock(content, targetKey);
            selection = utils.getBlockLastSel(beforeBlock);

            editorState = EditorState.push(editorState, content, "delete-character");
            editorState = EditorState.forceSelection(editorState, selection);
            return { editorState, toUpdateKeys: [beforeKey] };
        }

        const beforeDetail = utils.getBlockDetail(content, beforeKey);
        if (beforeDetail.isSubBlock && beforeDetail.pKey !== curDetail.pKey) {
            content = utils.deleteSubBlock(content, beforeDetail.pKey);
            editorState = EditorState.push(editorState, content, "delete-character");
            return { editorState, toUpdateKeys: [beforeKey] };
        }

        if (!beforeDetail.isText) {
            content = utils.deleteBlock(content, beforeKey);
            editorState = EditorState.push(editorState, content, "delete-character");
            return { editorState, toUpdateKeys: [] };
        }

        content = utils.mergeBlock(content, targetKey);
        selection = selection.merge({
            anchorKey: beforeKey,
            anchorOffset: beforeBlock.getText().length,
            focusKey: beforeKey,
            focusOffset: beforeBlock.getText().length,
        }) as any;

        editorState = EditorState.push(editorState, content, "delete-character");
        editorState = EditorState.forceSelection(editorState, selection);
        return { editorState, toUpdateKeys: [selection.anchorKey] };
    } else {
        // notice: 这里假设了immutable实体占用的文字长度是1，确实也该如此
        selection = selection.merge({ anchorOffset: offset - 1 }) as any;
        content = Modifier.removeRange(content, selection, "backward");
        selection = selection.merge({ focusOffset: offset - 1 }) as any;
        editorState = EditorState.push(editorState, content, "delete-character");
        editorState = EditorState.forceSelection(editorState, selection);
        return { editorState, toUpdateKeys: [selection.anchorKey] };
    }
}

/**
 * 默认换行操作
 */
export function lineFeed(editorState: EditorState, list?: Array<string>) {
    const collResult = makeCollapsed(editorState);

    editorState = collResult.editorState;

    const selection = editorState.getSelection();
    let content = editorState.getCurrentContent();

    const currentBlock = content.getBlockForKey(selection.anchorKey);
    const curDetail = utils.getBlockDetail(content, selection.anchorKey);

    if (!curDetail.isText) {
        return collResult;
    }

    if (curDetail.isSubBlock && !curDetail.head.grow) {
        editorState = insertText(editorState, "\n").editorState;
        return { editorState, toUpdateKeys: [...collResult.toUpdateKeys, selection.anchorKey] };
    }

    let textlen = currentBlock.getText().length;
    if (textlen === 0 && !curDetail.isHead) {
        if (curDetail.isSubBlock) {
            if (!curDetail.isSubFirst) {
                let afterKey = content.getKeyAfter(selection.anchorKey);
                let afterData = utils.getBlockData(content, afterKey);
                if (afterData.get("pKey") !== curDetail.pKey) {
                    let blockData = curDetail.blockData.remove("pKey");
                    content = utils.setBlockData(content, selection.anchorKey, blockData);
                    editorState = EditorState.push(editorState, content, "insert-characters");
                    return { editorState, toUpdateKeys: [...collResult.toUpdateKeys, selection.anchorKey] };
                }
            }
        } else {
            let wrapper = curDetail.blockData.get("wrapper");
            if (wrapper) {
                let blockData;

                if (wrapper.depth > 0) {
                    blockData = curDetail.blockData.set("wrapper", { ...wrapper, depth: wrapper.depth - 1 });
                } else {
                    blockData = curDetail.blockData.remove("wrapper");
                }

                content = utils.setBlockData(content, selection.anchorKey, blockData);
                editorState = EditorState.push(editorState, content, "insert-characters");
                return { editorState, toUpdateKeys: [...collResult.toUpdateKeys, selection.anchorKey] };
            }
        }
    }

    content = utils.splitBlock(content, selection.anchorKey, undefined, selection.anchorOffset);
    const newKey = content.getKeyAfter(selection.anchorKey);
    let newBlockData = curDetail.blockData;
    if (curDetail.isHead) {
        newBlockData = newBlockData.remove("head").remove("wrapper").set("pkey", curDetail.key);
    }

    if ((list || []).indexOf(curDetail.name) !== -1) {
        newBlockData = newBlockData.set("name", "div");
    }

    content = utils.setBlockData(content, newKey, newBlockData);
    const newSelection: any = utils.basicSelState.merge({
        anchorKey: newKey,
        focusKey: newKey,
    });
    editorState = EditorState.push(editorState, content, "insert-characters");
    editorState = EditorState.forceSelection(editorState, newSelection);

    return { editorState, toUpdateKeys: [...collResult.toUpdateKeys, selection.anchorKey] };
}

export function insertNewLine(editorState: EditorState, list?: Array<string>) {
    let content = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    selection = utils.getForwardSel(selection);

    const targetKey = selection.focusKey;
    const curDetail = utils.getBlockDetail(content, targetKey);

    if (!curDetail.isText || (curDetail.isSubBlock && !curDetail.head.grow)) {
        return { editorState, toUpdateKeys: [] };
    }

    content = utils.insertBlock(content, targetKey);
    let newKey = content.getKeyAfter(targetKey);

    let newBlockData = curDetail.blockData;
    if (curDetail.isHead) {
        newBlockData = newBlockData.remove("head").remove("wrapper").set("pkey", curDetail.key);
    }

    if ((list || []).indexOf(curDetail.name) !== -1) {
        newBlockData = newBlockData.set("name", "div");
    }

    content = utils.setBlockData(content, newKey, newBlockData);
    let newSelection: any = utils.basicSelState.merge({
        focusKey: newKey,
        anchorKey: newKey,
    });
    editorState = EditorState.push(editorState, content, "insert-fragment");
    editorState = EditorState.forceSelection(editorState, newSelection);
    return { editorState, toUpdateKeys: [targetKey] };
}
