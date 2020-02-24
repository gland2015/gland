import * as utils from './utils';
import { makeCollapsed } from './content';
import { EditorState }from "@gland/draft-ts";
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
    editorState = EditorState.push(editorState, content, 'insert-characters');
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
    let selection = editorState.getSelection();
    let content = editorState.getCurrentContent();
    content = utils.applyEntity(content, selection, name, data);
    editorState = EditorState.push(editorState, content, 'insert-characters');
    editorState = EditorState.forceSelection(editorState, selection)
    const toUpdateKeys = utils.findRangeKeys(content, selection);
    return { editorState, toUpdateKeys };
}
