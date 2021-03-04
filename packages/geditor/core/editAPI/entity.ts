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

export function insertEntity(eState, name: string, data) {
    let { editorState, toUpdateKeys } = makeCollapsed(eState);
    let selection = editorState.getSelection();
    let content = editorState.getCurrentContent();

    let vaildRes = utils.getInsertStrVaildPos(content, selection.anchorKey, selection.anchorOffset);

    content = utils.insertEntity(vaildRes.content, vaildRes.key, vaildRes.offset, name, data);
    const newSel = utils.basicSelState.merge({
        anchorKey: vaildRes.key,
        focusKey: vaildRes.key,
        anchorOffset: vaildRes.offset + 1,
        focusOffset: vaildRes.offset + 1,
    }) as any;
    editorState = EditorState.push(editorState, content, "insert-characters");
    editorState = EditorState.forceSelection(editorState, newSel);
    toUpdateKeys.push(newSel.anchorKey, selection.anchorKey);
    return { editorState, toUpdateKeys };
}

export function updateEntity(editorState: EditorState, key, data) {
    let content = editorState.getCurrentContent();
    content = utils.updateEntityData(content, key, data);

    let sel = editorState.getSelection();

    editorState = EditorState.push(editorState, content, "change-block-data");
    editorState = EditorState.forceSelection(editorState, sel);

    return { editorState, toUpdateKeys: null };
}

export function applyEntity(editorState, name: string, data) {
    let selection = utils.getForwardSel(editorState.getSelection());
    let content = editorState.getCurrentContent();
    let applyRes = utils.applyEntity(content, selection, name, data);
    editorState = EditorState.push(editorState, applyRes.content, "insert-characters");
    selection = selection.merge({
        anchorOffset: selection.focusOffset,
        anchorKey: selection.focusKey,
    }) as any;
    editorState = EditorState.forceSelection(editorState, selection);

    return { editorState, toUpdateKeys: applyRes.toUpdateKeys };
}

export function removeEntity(editorState: EditorState, key, start, end) {
    let content = editorState.getCurrentContent();

    let tempSel = utils.basicSelState.merge({
        anchorOffset: start,
        anchorKey: key,
        focusKey: key,
        focusOffset: end,
    }) as any;
    let applyRes = utils.applyEntity(content, tempSel, null);

    let offset = Math.floor((start + end) / 2);
    let newSel = utils.basicSelState.merge({
        anchorOffset: offset,
        anchorKey: key,
        focusKey: key,
        focusOffset: offset,
    }) as any;

    editorState = EditorState.push(editorState, applyRes.content, "insert-characters");
    editorState = EditorState.forceSelection(editorState, newSel);

    return { editorState, toUpdateKeys: [key] };
}

/**
 * at these position when composition start，it can only redirect position
 * need add '\r'
 * @param editorState
 */
export function haveSpecEntity(editorState: EditorState): boolean {
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();

    const block = content.getBlockForKey(selection.anchorKey);
    const lftKey = block.getEntityAt(selection.anchorOffset - 1);
    const rgtKey = block.getEntityAt(selection.anchorOffset);
    if (!lftKey && !rgtKey) return false;
    if (lftKey) return true;
    if (rgtKey) {
        if (selection.anchorOffset === 0) return true;
        if (rgtKey === lftKey) return false;
        return false;
    }
    // ??
    const length = block.getText().length;
    if (length === selection.anchorOffset) return true;
    return false;
}
