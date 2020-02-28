import * as utils from "./utils";
import { makeCollapsed } from "./content";
import { EditorState } from "@gland/draft-ts";
/**
 * 插入实体
 * @param editorState
 * @param name
 * @param data
 */
export function insertEntity(eState, name: string, data) {
    let { editorState, toUpdateKeys } = makeCollapsed(eState);
    let selection = editorState.getSelection();
    let content = editorState.getCurrentContent();
    content = utils.insertEntity(content, selection, name, data);
    editorState = EditorState.push(editorState, content, "insert-characters");
    selection = selection.merge({
        anchorOffset: selection.anchorOffset + 1,
        focusOffset: selection.anchorOffset + 1
    });
    editorState = EditorState.forceSelection(editorState, selection);
    toUpdateKeys.push(selection.anchorKey);
    return { editorState, toUpdateKeys };
}

// notice 更新状态前，先使编辑器聚焦
export function applyEntity(editorState, name: string, data) {
    let selection = utils.getForwardSelection(editorState.getSelection());

    let content = editorState.getCurrentContent();
    content = utils.applyEntity(content, selection, name, data);
    editorState = EditorState.push(editorState, content, "insert-characters");
    selection = selection.merge({
        anchorOffset: selection.focusOffset,
        anchorKey: selection.focusKey
    })
    editorState = EditorState.forceSelection(editorState, selection);
    const toUpdateKeys = utils.findRangeKeys(content, selection);
    return { editorState, toUpdateKeys };
}

/**
 * 输入法输入时，获取是否处在需要额外添加元素的位置，
 * 具体说是任意实体在结尾处，焦点也在结尾处
 * 非结尾处的可变实体尾部
 * 此时需要添加'\r'，帮助编辑器更改正确的输入焦点
 * @param editorState
 */
export function isEntityLast(editorState) {
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(selection.anchorKey);
    const leftEntityKey = block.getEntityAt(selection.anchorOffset - 1);
    const leftEntity = leftEntityKey && content.getEntity(leftEntityKey);
    const rightEntityKey = block.getEntityAt(selection.anchorOffset);
    // const rightEntity = rightEntityKey && content.getEntity(rightEntityKey);
    const length = block.getText().length;

    if (length === selection.anchorOffset && leftEntityKey) return true;
    if (leftEntityKey && leftEntity.getMutability() === "MUTABLE" && leftEntityKey !== rightEntityKey) {
        return true;
    }
    return false;
}
