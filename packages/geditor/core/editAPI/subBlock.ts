import { EditorState, Modifier, SelectionState } from "@gland/draft-ts";
import * as utils from "./utils";
import { getTextData } from "../model";

export function insertSubBlock(editorState: EditorState, head: { name: string; grow: boolean; data: any }, childNum: number) {
    let selection = editorState.getSelection();
    selection = utils.getForwardSel(selection);
    let curDetail = utils.getBlockDetail(editorState.getCurrentContent(), selection.anchorKey);

    if (!curDetail.canInsertSubBlock) {
        return { editorState, toUpdateKeys: [] };
    }

    let content = editorState.getCurrentContent();
    let removeResult = utils.removeRange(content, selection);

    content = removeResult.content;
    selection = selection.merge({
        focusKey: selection.anchorKey,
        focusOffset: selection.anchorOffset,
    }) as any;

    const startKey = selection.anchorKey;

    content = utils.splitBlock(content, startKey, undefined, selection.anchorOffset);

    let nextBlock = content.getBlockAfter(startKey);
    let nextKey = nextBlock.getKey();

    if (!utils.isCanCustomBlock(content, nextKey)) {
        content = utils.splitBlock(content, nextKey, undefined, 0);
        nextBlock = content.getBlockForKey(nextKey);
    }

    let headBlockData = nextBlock.getData().set("head", head);
    content = utils.setBlockData(content, nextKey, headBlockData);

    let childData = getTextData("div").set("pKey", nextKey);

    while (childNum > 0) {
        content = utils.splitBlock(content, nextKey, childData);
        childNum--;
    }

    if (head.grow) {
        selection = utils.basicSelState.merge({
            anchorKey: nextKey,
            focusKey: nextKey,
        }) as any;
    } else {
        let theKey = content.getKeyAfter(nextKey);
        selection = utils.basicSelState.merge({
            anchorKey: theKey,
            focusKey: theKey,
        }) as any;
    }

    editorState = EditorState.push(editorState, content, "delete-character");
    editorState = EditorState.forceSelection(editorState, selection);
    return { editorState, toUpdateKeys: removeResult.toUpdateKeys };
}
