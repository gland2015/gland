import { EditorState } from "@gland/draft-ts";
import * as utils from "./utils";
import { makeCollapsed } from "./content";

export function getCurrentEntity(editorState: EditorState) {
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(selection.anchorKey);
    const offset = selection.anchorOffset;

    const entityKey = block.getEntityAt(offset);
    if (!entityKey) return null;
    return content.getEntity(entityKey);
}

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
        focusOffset: selection.anchorOffset + 1,
    });
    editorState = EditorState.forceSelection(editorState, selection);
    toUpdateKeys.push(selection.anchorKey);
    return { editorState, toUpdateKeys };
}

// notice 更新状态前，先使编辑器聚焦
export function applyEntity(editorState, name: string, data) {
    let selection = utils.getForwardSel(editorState.getSelection());

    let content = editorState.getCurrentContent();
    content = utils.applyEntity(content, selection, name, data);
    editorState = EditorState.push(editorState, content, "insert-characters");
    selection = selection.merge({
        anchorOffset: selection.focusOffset,
        anchorKey: selection.focusKey,
    }) as any;
    editorState = EditorState.forceSelection(editorState, selection);
    const toUpdateKeys = utils.findRangeBlockKeys(content, selection);
    return { editorState, toUpdateKeys };
}

/**
 * 输入法输入时，由于无法阻止其插入，为防止在块级写入或写入其他区域，需调整输入位置
 * 具体说是
 * 1、任意实体在结尾处，输入焦点也在结尾处
 * 2、非结尾处的可变实体尾部
 * 3、段落开头后有实体
 * 4、两实体相交处
 * 此时需要添加'\r'，帮助编辑器更改正确的输入焦点
 * 注意在0位置的左右实体返回是一样的
 * @param editorState
 */
export function haveSpecEntity(editorState): boolean {
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(selection.anchorKey);
    const leftEntityKey = block.getEntityAt(selection.anchorOffset - 1);
    const rightEntityKey = block.getEntityAt(selection.anchorOffset);
    if (!leftEntityKey && !rightEntityKey) return false;
    if (rightEntityKey) {
        if (selection.anchorOffset === 0) return true;
        if (rightEntityKey === leftEntityKey) return false;
        if (leftEntityKey) return true;
        return false;
    }
    const length = block.getText().length;
    if (length === selection.anchorOffset) return true;
    const leftEntity = leftEntityKey && content.getEntity(leftEntityKey);

    if (leftEntity.getMutability() === "MUTABLE") return true;

    return false;
}
