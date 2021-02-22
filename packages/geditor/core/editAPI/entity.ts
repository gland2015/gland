import { EditorState } from "@gland/draft-ts";

export function getCurrentEntity(editorState: EditorState) {
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(selection.anchorKey);
    const offset = selection.anchorOffset;

    const entityKey = block.getEntityAt(offset);
    if (!entityKey) return null;
    return content.getEntity(entityKey);
}
