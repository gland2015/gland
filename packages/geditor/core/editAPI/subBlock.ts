import { EditorState, Modifier, SelectionState } from "@gland/draft-ts";
import * as utils from "./utils";
import { getTextData } from "../model";

export function insertSubBlock(editorState: EditorState, name: string, grow: boolean, childNum: number) {
    let selection = editorState.getSelection();
    selection = utils.getForwardSel(selection);
    let curDetail = utils.getBlockDetail(editorState.getCurrentContent(), selection.anchorKey);

    if (curDetail.isSubBlock) {
        if (curDetail.isHead || !curDetail.head.grow) {
            return { editorState, toUpdateKeys: [] };
        }
    }

    if (!curDetail.isText) {
        return { editorState, toUpdateKeys: [] };
    }

    let content = editorState.getCurrentContent();
    let removeResult = utils.removeRange(content, selection);

    content = removeResult.content;
    selection = selection.merge({
        focusKey: selection.anchorKey,
        focusOffset: selection.anchorOffset,
    }) as any;

    let startKey = selection.anchorKey;

    content = Modifier.splitBlock(content, selection);

    let nextBlock = content.getBlockAfter(startKey);
    let nextKey = nextBlock.getKey();

    if (nextBlock.getText() || !content.getBlockAfter(nextKey)) {
        let tempSelection = utils.basicSelState.merge({
            focusKey: nextKey,
            anchorKey: nextKey,
        }) as any;
        content = Modifier.splitBlock(content, tempSelection);
        nextBlock = content.getBlockForKey(nextKey);
    }

    let headBlockData = nextBlock.getData().set("head", { name, grow });
    content = utils.setBlockData(content, nextKey, headBlockData);

    let childData = getTextData("div").set("pKey", nextKey);

    while (childNum > 0) {
        content = utils.splitBlock(content, nextKey, childData);
        childNum--;
    }

    editorState = EditorState.push(editorState, content, "delete-character");
    editorState = EditorState.forceSelection(editorState, selection);
    return { editorState, toUpdateKeys: removeResult.toUpdateKeys };
}
