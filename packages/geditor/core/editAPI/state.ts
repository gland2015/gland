import { EditorState, ContentState, ContentBlock, convertFromRaw, genKey } from "@gland/draft-ts";

import { getDecorator, getTextData } from "../model";
import { setBlockData, getInitContent } from "./utils";

export function getEditorState(rawContent?, decorators?: Array<any>) {
    let content;
    if (rawContent) {
        if (typeof rawContent === "string") {
            try {
                content = convertFromRaw(JSON.parse(rawContent));
            } catch (err) {
                content = getInitContent(rawContent);
            }
        } else {
            content = convertFromRaw(rawContent);
        }
    } else {
        content = getInitContent();
    }

    return EditorState.createWithContent(content, getDecorator(decorators));
}

export function setStateBlockData(editorState, key: string, blockData) {
    let contentState = editorState.getCurrentContent();

    contentState = setBlockData(contentState, key, blockData);

    editorState = EditorState.set(editorState, { currentContent: contentState });
    return editorState;
}
