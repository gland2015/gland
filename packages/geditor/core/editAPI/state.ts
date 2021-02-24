import { EditorState, ContentState, ContentBlock, convertFromRaw, genKey } from "@gland/draft-ts";

import { getDecorator, getTextData } from "../model";
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

/**
 * 获取焦点处编辑器情况的概要
 * @param editorState
 * @param editorTheme
 */
export function getCurrentState(editorState) {
    const contentState = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    selection = getForwardSel(selection);
    // notice 样式皆以选择的前点为准
    const block = contentState.getBlockForKey(selection.anchorKey);
    const blockData = block.getData();
    let wrapperName = blockData.get("wrapper");
    wrapperName = wrapperName ? wrapperName.name : null;

    const name = blockData.get("name");
    if (!blockData.get("isText")) {
        return { blockComponentName: name, wrapperName };
    }

    const isCollapsed = selection.isCollapsed();
    const blockStyle = blockData.get("style");

    const inlineStyle = {};
    const inlineClassName = [];

    let entityData;
    // todo
    let rangleEntityData;

    let blockStyleProtoArr = [];
    let blockStyleProto = {};

    if (blockStyleProtoArr.length) {
        blockStyleProtoArr.forEach(function (obj) {
            obj = Object.assign({}, obj);
            Object.setPrototypeOf(obj, blockStyleProto);
            blockStyleProto = obj;
        });
        Object.setPrototypeOf(blockStyle, blockStyleProto);
    }

    const inlineStyleName = editorState.getCurrentInlineStyle().toArray();
    inlineStyleName.forEach(function (name) {
        if (name.charCodeAt(0) === 46) {
            inlineClassName.push(name);
        } else {
            const arr = name.split(";");
            arr.forEach(function (style) {
                if (style) {
                    style = style.split(":");
                    inlineStyle[style[0]] = style[1];
                }
            });
        }
    });

    let entityKey = block.getEntityAt(selection.anchorOffset);
    if (entityKey) {
        entityData = contentState.getEntity(entityKey).data;
    }

    return {
        wrapperName,
        blockType: name,
        blockStyle,
        inlineStyle,
        inlineClassName,
        isCollapsed,
        entityData,
        rangleEntityData,
    };
}
