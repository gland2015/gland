import { EditorState, Modifier, SelectionState } from "@gland/draft-ts";
import * as utils from "./utils";
import { makeCollapsed } from "./content";
import { getTextData } from "../model";

export function insertSubBlock(editorState: EditorState, head: { name: string; grow: boolean; data: any }, childNum: number) {
    const collR = makeCollapsed(editorState);
    editorState = collR.editorState;
    const selection = editorState.getSelection();
    let content = editorState.getCurrentContent();

    const safeR = utils.newSafeCustomLine(content, selection.focusKey, selection.focusOffset);
    content = safeR.content;

    const newKey = safeR.newKey;
    const newBlock = content.getBlockForKey(newKey);

    const headBlockData = newBlock.getData().set("head", head);
    content = utils.setBlockData(content, newKey, headBlockData);

    let childData = getTextData("div").set("pKey", newKey);

    while (childNum > 0) {
        content = utils.splitBlock(content, newKey, childData);
        childNum--;
    }

    let newSel;
    if (head.grow) {
        newSel = utils.basicSelState.merge({
            anchorKey: newKey,
            focusKey: newKey,
        }) as any;
    } else {
        let theKey = content.getKeyAfter(newKey);
        newSel = utils.basicSelState.merge({
            anchorKey: theKey,
            focusKey: theKey,
        }) as any;
    }

    editorState = EditorState.push(editorState, content, "delete-character");
    editorState = EditorState.forceSelection(editorState, newSel);
    return { editorState, toUpdateKeys: [...collR.toUpdateKeys, selection.anchorKey, selection.focusKey] };
}
