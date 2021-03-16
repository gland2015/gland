import { EditorState } from "@gland/draft-ts";
import { IEditorContext } from "../interface";
import { insertNewLine, insertText, backspace, lineFeed } from "./content";
import { addBlockWrapperDepth, reduceBlockWrapperDepth } from "./wrapper";
import { moveSelection } from "./selection";
import { undo, redo } from "./state";

const cursorKeys = [35, 36, 37, 38, 39, 40];

export function defaultKeyHandler(editorState: EditorState, keyState, ctx: IEditorContext) {
    const { keyCode, key } = keyState;
    const curIndex = cursorKeys.indexOf(keyCode);
    if (curIndex !== -1) {
        if (curIndex > 1 && ctx.target) {
            let selection = editorState.getSelection();
            let content = editorState.getCurrentContent();
            let block = content.getBlockForKey(selection.focusKey);
            if (block) {
                let data = block.getData();
                if (!data.get("isText")) {
                    if (keyCode === 37 || keyCode === 38) {
                        return moveSelection(editorState, "beforeBlock");
                    } else {
                        return moveSelection(editorState, "afterBlock");
                    }
                }

                if (keyCode === 37 || keyCode === 39) {
                    let keepAnchor = keyState.shiftKey;
                    if (!selection.isCollapsed() && !keepAnchor) {
                        return null;
                    }
                    const lftKey = block.getEntityAt(selection.focusOffset - 1);
                    const rgtKey = block.getEntityAt(selection.focusOffset);
                    if (!lftKey && !rgtKey) return null;

                    let lftData = lftKey && content.getEntity(lftKey);
                    let rgtData = rgtKey && content.getEntity(rgtKey);
                    if ((lftData && lftData.getMutability() === "IMMUTABLE") || (rgtData && rgtData.getMutability() === "IMMUTABLE")) {
                        return moveSelection(editorState, keyCode === 37 ? "beforeChar" : "afterChar", keepAnchor);
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
        if (key.length === 1) {
            return insertText(editorState, key);
        }
        return;
    }
    if (keyState.ctrlKey || keyState.metaKey) {
        if (keyCode === 13) {
            return insertNewLine(editorState, ctx.noFollowBlocks);
        }
        if (keyCode === 65) {
            // a
            return null;
        }
        if (keyCode === 67) {
            // c
            return null;
        }
        if (keyCode === 86) {
            // v
            return null;
        }
        if (keyCode === 88) {
            // x
            return null;
        }
        if (keyCode === 89) {
            // y
            return {
                editorState: redo(editorState),
            };
        }
        if (keyCode === 90) {
            // z
            return {
                editorState: undo(editorState),
            };
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
