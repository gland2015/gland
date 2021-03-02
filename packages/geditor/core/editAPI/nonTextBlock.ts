import { EditorState, Modifier } from "@gland/draft-ts";
import { getNonTextData } from "../model";
import { makeCollapsed } from "./content";
import * as utils from "./utils";

export function InsertNonTextBlock(editorState: EditorState, ComponentName: string, data: any) {
    const collR = makeCollapsed(editorState);
    editorState = collR.editorState;
    const selection = editorState.getSelection();
    let content = editorState.getCurrentContent();

    const safeR = utils.newSafeCustomLine(content, selection.focusKey, selection.focusOffset);
    content = safeR.content;

    const newKey = safeR.newKey;
    const newBlock = content.getBlockForKey(newKey);
    const newData = newBlock.getData();
    const wrapper = newData.get("wrapper");
    const pKey = newData.get("pKey");

    let newBlockData = getNonTextData(ComponentName);
    newBlockData = newBlockData.set("data", data);
    if (wrapper) {
        newBlockData = newBlockData.set("wrapper", wrapper);
    }
    if (pKey) {
        newBlockData = newBlockData.set("pKey", pKey);
    }

    content = utils.setBlockData(content, newKey, newBlockData);

    const afterKey = content.getKeyAfter(newKey);

    let newSelection: any = utils.basicSelState.merge({
        focusKey: afterKey,
        anchorKey: afterKey,
    });
    editorState = EditorState.push(editorState, content, "insert-fragment");
    editorState = EditorState.forceSelection(editorState, newSelection);
    return { editorState, toUpdateKeys: [selection.focusKey, afterKey] };
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
