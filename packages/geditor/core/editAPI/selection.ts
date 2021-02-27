import { EditorState } from "@gland/draft-ts";
import * as utils from "./utils";

export function moveSelection(editorState: EditorState, type: "beforeBlock" | "afterBlock") {
    let content = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    let key = selection.focusKey;

    let offset = 0;
    let targetKey = key;

    if (type === "beforeBlock") {
        let before = content.getBlockBefore(key);
        if (before) {
            let data = before.getData();
            let head = data.get("head");
            if (!data.get("isText") || (head && !head.grow)) {
                before = content.getBlockBefore(before.getKey());
            }
        }
        if (before) {
            targetKey = before.getKey();
            offset = before.getText().length;
        }
    } else if (type === "afterBlock") {
        let after = content.getBlockAfter(key);
        if (after) {
            let data = after.getData();
            let head = data.get("head");
            if (!data.get("isText") || (head && !head.grow)) {
                after = content.getBlockAfter(after.getKey());
            }
        }
        if (after) {
            targetKey = after.getKey();
            offset = 0;
        }
    }

    const newSel = utils.basicSelState.merge({
        anchorKey: targetKey,
        anchorOffset: offset,
        focusKey: targetKey,
        focusOffset: offset,
    }) as any;
    editorState = EditorState.forceSelection(editorState, newSel);

    return {
        editorState,
        toUpdateKeys: [targetKey, selection.focusKey],
    };
}
