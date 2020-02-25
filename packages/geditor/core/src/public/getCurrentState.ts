import { IEditorTheme } from "../model";
import { utils } from "../editAPI";
import { getClassNameByType, getClassNameByBlockKey } from "./keys";

export interface currentState {
    blockType?: string;
    blockComponentName?: string;
    blockStyle?: object;
    entityData?: any;
    // todo: 返回非焦点处的但在选择范围的其他实体数据
    rangleEntityData?: any;
    isCollapsed?: boolean;
    inlineStyle?: Array<string>;
    inlineClassName?: Array<string>;
}
/**
 * 获取焦点处编辑器情况的概要
 * @param editorState
 * @param editorTheme
 */
export function getCurrentState(editorState, editorTheme: IEditorTheme) {
    const contentState = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    selection = utils.getForwardSelection(selection);
    // notice 样式皆以选择的前点为准
    const block = contentState.getBlockForKey(selection.anchorKey);
    const blockData = block.getData();

    const blockComponentName = blockData.get("ComponentName");
    if (blockComponentName) {
        return { blockComponentName };
    }
    const { classStyles } = editorTheme;
    const isCollapsed = selection.isCollapsed();
    const blockType = blockData.get("type");
    const blockStyle = blockData.get("style").toJS();

    const inlineStyle = {};
    const inlineClassName = [];

    let entityData;
    // todo
    let rangleEntityData;

    const typeClassName = getClassNameByType(blockType, editorTheme.identifier);
    const keyClassName = getClassNameByBlockKey(block.getKey(), editorTheme.identifier);
    let blockStyleProtoArr = [];
    let blockStyleProto = {};
    if (classStyles.block[typeClassName]) {
        blockStyleProtoArr.push(classStyles.block[typeClassName]);
    }
    if (classStyles.block[keyClassName]) {
        blockStyleProtoArr.push(classStyles.block[keyClassName]);
    }

    if (blockStyleProtoArr.length) {
        blockStyleProtoArr.forEach(function(obj) {
            obj = Object.assign({}, obj);
            Object.setPrototypeOf(obj, blockStyleProto);
            blockStyleProto = obj;
        });
        Object.setPrototypeOf(blockStyle, blockStyleProto);
    }

    const inlineStyleName = editorState.getCurrentInlineStyle().toArray();
    inlineStyleName.forEach(function(name) {
        if (name.charCodeAt(0) === 46) {
            inlineClassName.push(name);
        } else {
            const arr = name.split(";");
            arr.forEach(function(style) {
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
        blockType,
        blockStyle,
        inlineStyle,
        inlineClassName,
        isCollapsed,
        entityData,
        rangleEntityData
    };
}
