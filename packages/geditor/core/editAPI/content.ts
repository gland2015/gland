import { OrderedSet } from "immutable";
import { EditorState, Modifier, SelectionState } from "@gland/draft-ts";
import { getTextData } from "../model";
import * as utils from "./utils";

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

export function insertText(editorState: EditorState, text: string, style?: Array<string>, offsetDeviation = 0) {
    let collResult = makeCollapsed(editorState);
    editorState = collResult.editorState;

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
    return { editorState, toUpdateKeys: [selection.anchorKey, ...collResult.toUpdateKeys] };
}

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
        if (!curDetail.canBackspaceAt0) {
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
        selection = selection.merge({ anchorOffset: offset - 1 }) as any;
        content = Modifier.removeRange(content, selection, "backward");
        selection = selection.merge({ focusOffset: offset - 1 }) as any;
        editorState = EditorState.push(editorState, content, "delete-character");
        editorState = EditorState.forceSelection(editorState, selection);
        return { editorState, toUpdateKeys: [selection.anchorKey] };
    }
}

export function lineFeed(editorState: EditorState, list?: Array<string>) {
    const collResult = makeCollapsed(editorState);

    editorState = collResult.editorState;

    let content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const currentBlock = content.getBlockForKey(selection.anchorKey);
    const curDetail = utils.getBlockDetail(content, selection.anchorKey);

    if (!curDetail.isText) {
        if (curDetail.isFixed) {
            return collResult;
        }

        let newData = getTextData("div");
        let pKey = curDetail.head ? curDetail.key : curDetail.pKey;
        let wrapper = curDetail.head ? null : curDetail.blockData.get("wrapper");

        if (pKey) {
            newData = newData.set("pKey", pKey);
        }
        if (wrapper) {
            newData = newData.set("wrapper", wrapper);
        }

        content = utils.splitBlock(content, curDetail.key, newData);
        const newKey = content.getKeyAfter(curDetail.key);
        const newSel = utils.basicSelState.merge({
            anchorKey: newKey,
            focusKey: newKey,
        }) as any;
        editorState = EditorState.push(editorState, content, "insert-characters");
        editorState = EditorState.forceSelection(editorState, newSel);
        return { editorState, toUpdateKeys: [...collResult.toUpdateKeys, selection.anchorKey] };
    }

    if (curDetail.isFixed) {
        editorState = insertText(editorState, "\n").editorState;
        return { editorState, toUpdateKeys: [...collResult.toUpdateKeys, selection.anchorKey] };
    }

    let textlen = currentBlock.getText().length;
    if (textlen === 0 && !curDetail.head) {
        let wrapper = curDetail.blockData.get("wrapper");
        if (wrapper) {
            let blockData;

            if (wrapper.depth > 0) {
                blockData = curDetail.blockData.set("wrapper", { ...wrapper, depth: wrapper.depth - 1 });
            } else {
                blockData = curDetail.blockData.remove("wrapper");
            }

            content = utils.setBlockData(content, selection.anchorKey, blockData);
            const newSelection: any = utils.basicSelState.merge({
                anchorKey: selection.anchorKey,
                focusKey: selection.anchorKey,
            });
            editorState = EditorState.push(editorState, content, "change-block-data");
            editorState = EditorState.forceSelection(editorState, newSelection);

            return { editorState, toUpdateKeys: [...collResult.toUpdateKeys, selection.anchorKey] };
        }

        if (curDetail.isSubBlock && !curDetail.isSubFirst) {
            let afterKey = content.getKeyAfter(selection.anchorKey);
            let afterData = utils.getBlockData(content, afterKey);
            if (afterData.get("pKey") !== curDetail.pKey) {
                const pData = curDetail.pData;
                const ppKey = pData.get("pKey");
                const ppWrapper = pData.get("wrapper");

                let blockData = curDetail.blockData;
                if (ppKey) {
                    blockData = blockData.set("pKey", ppKey);
                } else {
                    blockData = blockData.remove("pKey");
                }

                if (ppWrapper) {
                    blockData = blockData.set("wrapper", ppWrapper);
                } else {
                    blockData = blockData.remove("wrapper");
                }

                content = utils.setBlockData(content, selection.anchorKey, blockData);
                const newSelection = utils.basicSelState.merge({
                    anchorKey: curDetail.key,
                    focusKey: curDetail.key,
                }) as any;
                editorState = EditorState.push(editorState, content, "change-block-data");
                editorState = EditorState.forceSelection(editorState, newSelection);

                return { editorState, toUpdateKeys: [...collResult.toUpdateKeys, selection.anchorKey] };
            }
        }
    }

    let newBlockData = curDetail.blockData;
    if (curDetail.head) {
        newBlockData = newBlockData.remove("head").remove("wrapper").set("pKey", curDetail.key);
    }
    if ((list || []).indexOf(curDetail.name) !== -1) {
        newBlockData = newBlockData.set("name", "div");
    }

    content = utils.splitBlock(content, selection.anchorKey, newBlockData, selection.anchorOffset);

    const newKey = content.getKeyAfter(selection.anchorKey);
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

    if (!curDetail.isText || curDetail.isFixed) {
        return { editorState, toUpdateKeys: [] };
    }

    content = utils.insertBlock(content, targetKey);
    let newKey = content.getKeyAfter(targetKey);

    let newBlockData = curDetail.blockData;
    if (curDetail.head) {
        newBlockData = newBlockData.remove("head").remove("wrapper").set("pKey", curDetail.key);
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
