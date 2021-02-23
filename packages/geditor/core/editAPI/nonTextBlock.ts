import { EditorState, Modifier } from "@gland/draft-ts";
import { getNonTextData } from "../model";
import * as utils from "./utils";

export function InsertNonTextBlock(editorState, ComponentName, data) {
    let content = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    selection = utils.getForwardSel(selection);

    let block = content.getBlockForKey(selection.focusKey);
    let can = true;

    const oldBlockData = block.getData();
    if (!oldBlockData.get("isText") || oldBlockData.get("head")) {
        can = false;
    } else {
        const pKey = oldBlockData.get("pKey");
        if (pKey) {
            let pData = utils.getBlockData(content, pKey);
            if (!pData.get("head").grow) {
                can = false;
            }
        }
    }

    if (!can) {
        return { editorState, toUpdateKeys: [] };
    }

    let newBlockData = getNonTextData(ComponentName);
    newBlockData = newBlockData.set("data", data);

    content = utils.insertBlock(content, selection.focusKey, newBlockData, selection.focusOffset);

    let newKey = content.getKeyAfter(selection.focusKey);
    newKey = content.getKeyAfter(newKey);

    let newSelection: any = utils.basicSelState.merge({
        focusKey: newKey,
        anchorKey: newKey,
    });
    editorState = EditorState.push(editorState, content, "insert-fragment");
    editorState = EditorState.forceSelection(editorState, newSelection);
    return { editorState, toUpdateKeys: [selection.focusKey] };
}

export function updateBlockData(editorState, blockKey, data) {
    let content = editorState.getCurrentContent();
    let selection = editorState.getSelection();

    let block = content.getBlockForKey(blockKey);
    if (!block) throw new Error("没有这个块" + blockKey);

    let blockData = block.getData().set("data", data);

    content = utils.setBlockData(content, blockKey, blockData);

    editorState = EditorState.push(editorState, content, "change-block-data");
    editorState = EditorState.forceSelection(editorState, selection);

    return { editorState, toUpdateKeys: [blockKey] };
}
