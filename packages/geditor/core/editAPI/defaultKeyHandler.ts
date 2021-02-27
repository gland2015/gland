import { EditorState } from "@gland/draft-ts";
import { IEditorContext } from "../interface";
import { makeCollapsed, insertNewLine, insertText, backspace, lineFeed } from "./content";
import { addBlockWrapperDepth, reduceBlockWrapperDepth } from "./wrapper";
import { moveSelection } from "./selection";

const cursorKeys = [35, 36, 37, 38, 39, 40];

export function defaultKeyHandler(editorState: EditorState, keyState, ctx: IEditorContext) {
    const { keyCode, key } = keyState;
    const curIndex = cursorKeys.indexOf(keyCode);
    if (curIndex !== -1) {
        if (curIndex > 1 && ctx.targetKey) {
            let selection = editorState.getSelection();
            if (selection.isCollapsed()) {
                let content = editorState.getCurrentContent();
                let block = content.getBlockForKey(ctx.targetKey);
                if (block) {
                    let data = block.getData();
                    if (!data.get("isText")) {
                        if (keyCode === 37 || keyCode === 38) {
                            return moveSelection(editorState, "beforeBlock");
                        } else {
                            return moveSelection(editorState, "afterBlock");
                        }
                    }
                }
            }
        }
        return null;
    }

    if (keyState.altKey) {
        return;
    }
    if (keyState.shiftKey) {
        if (keyCode === 9) {
            return reduceBlockWrapperDepth(editorState);
        }
        return;
    }
    if (keyState.ctrlKey) {
        if (keyCode === 13) {
            return insertNewLine(editorState, ctx.noFollowBlocks);
        }
        return;
    }

    if (keyCode === 8) {
        const result = backspace(editorState);
        return result;
    }

    if (keyCode === 9) {
        return addBlockWrapperDepth(editorState);
    }

    if (keyCode === 13) {
        return lineFeed(editorState, ctx.noFollowBlocks);
    }
    if (key.length === 1) {
        return insertText(editorState, key);
    }
    return;
}
