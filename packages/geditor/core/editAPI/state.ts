import { EditorState, convertFromRaw } from "@gland/draft-ts";

import { getDecorator } from "../model";
import { setBlockData, getInitContent, getForwardSel } from "./utils";

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

export function getCurrentState(editorState: EditorState) {
    const contentState = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    selection = getForwardSel(selection);
    // notice： style in forward selection key
    const block = contentState.getBlockForKey(selection.anchorKey);
    if (!block) {
        return {};
    }
    const blockData = block.getData();

    const pKey = blockData.get("pKey");
    let pData = null;
    if (pKey) {
        pData = contentState.getBlockForKey(pKey).getData();
    }

    let wrapperName;
    if (pData && !pData.get("head").grow) {
        const wrapper = pData.get("wrapper");
        wrapperName = wrapper ? wrapper.name : null;
    } else {
        const wrapper = blockData.get("wrapper");
        wrapperName = wrapper ? wrapper.name : null;
    }

    const name = blockData.get("name");
    if (!blockData.get("isText")) {
        return { blockComponentName: name, wrapperName };
    }

    const isCollapsed = selection.isCollapsed();
    const blockStyle = blockData.get("style") || {};

    const inlineStyle = {};
    const inlineClassName = [];

    let entityData;

    const inlineStyleName = editorState.getCurrentInlineStyle().toArray();
    inlineStyleName.forEach(function (name) {
        if (name.charCodeAt(0) === 46) {
            inlineClassName.push(name);
        } else {
            const arr = name.split(";");
            arr.forEach(function (style: any) {
                if (style) {
                    style = style.split(":");
                    inlineStyle[style[0]] = style[1];
                }
            });
        }
    });

    let entityKey = block.getEntityAt(selection.anchorOffset);
    if (entityKey) {
        entityData = (contentState.getEntity(entityKey) as any).data;
    }

    return {
        wrapperName,
        blockType: name,
        blockStyle,
        inlineStyle,
        inlineClassName,
        isCollapsed,
        entityData,
    };
}

export function redo(state: EditorState) {
    return EditorState.redo(state);
}

export function undo(state: EditorState) {
    return EditorState.undo(state);
}
