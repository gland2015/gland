import { makeCollapsed, insertNewLine, insertText, backspace, lineFeed } from "./content";

const arrowKey = [37, 38, 39, 40]

export function defaultKeyHandler(editorState, keyState, editorContext) {
    const { keyCode, key } = keyState;
    if(arrowKey.indexOf(keyCode) !== -1) return null;
    if (keyState.altKey) {
        return;
    }
    if (keyState.shiftKey) {
        return;
    }
    if (keyState.ctrlKey) {
        if (keyCode === 13) {
            // ctrl + entry
            return insertNewLine(editorState);
        }
        return;
    }

    if (keyCode === 8) {
        const result = backspace(editorState)
        if(result.toUpdateKeys.length) return result;
        return ;
    }
    if (keyCode === 13) {
        return lineFeed(editorState);
    }
    if (key.length === 1) {
        // 插入文本操作
        // 更细的限制更新较麻烦， 要考虑实体，offset位置，新样式等等.故准许更新一个个块，不启用什么原生渲染
        return insertText(editorState, key);
    }
    return;
}
