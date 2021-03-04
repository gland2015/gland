import { EditorState } from "@gland/draft-ts";
import * as utils from "./utils";

export function moveSelection(editorState: EditorState, type: "beforeBlock" | "afterBlock" | "beforeChar" | "afterChar", keepAnchor?: boolean) {
    let content = editorState.getCurrentContent();
    let selection = editorState.getSelection();

    let startKey = selection.focusKey;
    let startOffset = selection.focusOffset;

    let nextKey, nextOffset;

    let maxOffset = content.getBlockForKey(startKey).getText().length;
    if (type === "beforeChar") {
        if (startOffset < 1) {
            type = "beforeBlock";
        } else {
            nextKey = startKey;
            nextOffset = startOffset - 1;
        }
    } else if (type === "afterChar") {
        if (startOffset >= maxOffset) {
            type = "afterBlock";
        } else {
            nextKey = startKey;
            nextOffset = startOffset + 1;
        }
    }

    if (type === "beforeBlock") {
        let block = utils.findNearInputBlock(content, startKey, "forward");
        if (block) {
            nextKey = block.getKey();
            nextOffset = block.getText().length;
        } else {
            nextKey = startKey;
            nextOffset = 0;
        }
    } else if (type === "afterBlock") {
        let block = utils.findNearInputBlock(content, startKey, "backward");
        if (block) {
            nextKey = block.getKey();
            nextOffset = 0;
        } else {
            nextKey = startKey;
            nextOffset = maxOffset;
        }
    }

    let newSel = selection.merge({
        anchorKey: keepAnchor ? selection.anchorKey : nextKey,
        anchorOffset: keepAnchor ? selection.anchorOffset : nextOffset,
        focusKey: nextKey,
        focusOffset: nextOffset,
    }) as any;
    newSel = utils.ajustIsBackward(content, newSel);
    editorState = EditorState.forceSelection(editorState, newSel);
    return {
        editorState,
        toUpdateKeys: utils.findRangeBlockKeys(content, newSel),
    };
}

export function focusKeepSelection(editorState: EditorState) {
    let selection = editorState.getSelection();
    editorState = EditorState.acceptSelection(editorState, selection);

    return { editorState, toUpdateKeys: [] };
}
