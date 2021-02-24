import { IEditorContext } from "../interface";
import { makeCollapsed, insertNewLine, insertText, backspace, lineFeed } from "./content";
import { addBlockWrapperDepth, reduceBlockWrapperDepth } from "./wrapper";

const cursorKeys = [35, 36, 37, 38, 39, 40];

export function defaultKeyHandler(editorState, keyState, ctx: IEditorContext) {
    const { keyCode, key } = keyState;
    if (cursorKeys.indexOf(keyCode) !== -1) return null;

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
