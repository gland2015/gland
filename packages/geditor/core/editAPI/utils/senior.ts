import { Map } from "immutable";
import { SelectionState, ContentBlock, ContentState, EditorState, Modifier, convertFromRaw } from "@gland/draft-ts";

import { identifier } from "../../public/constants";
import { basicSelState, getForwardSel, deleteBlock } from "./basic";

export function addText(content: ContentState, selection: SelectionState, text: string, inlineStyle, entityKey?): ContentState {
    if (!selection.isCollapsed()) {
        selection = selection.merge({
            anchorKey: selection.focusKey,
            anchorOffset: selection.anchorOffset,
        }) as SelectionState;
    }
    const block = content.getBlockForKey(selection.anchorKey);
    if (entityKey === undefined && selection.anchorOffset) {
        const theEntityKey = block.getEntityAt(selection.anchorOffset);
        if (theEntityKey) {
            const beforeEntityKey = block.getEntityAt(selection.anchorOffset - 1);

            if (theEntityKey === beforeEntityKey) {
                const theEntity = content.getEntity(theEntityKey);
                const mutability = theEntity.get("mutability");
                if (mutability === "MUTABLE") {
                    entityKey = theEntityKey;
                }
            }
        }
    }
    if (inlineStyle === undefined) {
        inlineStyle = block.getInlineStyleAt(selection.anchorOffset);
    }
    content = Modifier.insertText(content, selection, text, inlineStyle, entityKey);
    return content;
}

export function clearText(content: ContentState, key: string) {
    const block = content.getBlockForKey(key);
    const selection = basicSelState.merge({
        anchorKey: key,
        focusKey: key,
        anchorOffset: 0,
        focusOffset: block.getText().length,
    }) as SelectionState;
    return Modifier.removeRange(content, selection, "backward");
}

/**
 * 应用实体, 若name为空，则删除实体
 * @param contentState
 * @param selection
 * @param name 组件名
 * @param data 组件数据
 */
export function applyEntity(contentState: ContentState, selection: SelectionState, name?: string, data?) {
    if (!name) {
        return Modifier.applyEntity(contentState, selection, null);
    }
    const contentStateWithEntity = contentState.createEntity(identifier, "MUTABLE", {
        name,
        data,
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    return Modifier.applyEntity(contentState, selection, entityKey);
}

/**
 * 在选择的后点插入一个实体。不会移除非折叠的区域
 * @param contentState
 * @param selection
 * @param name
 * @param data
 */
export function insertEntity(contentState: ContentState, selection: SelectionState, name?: string, data?) {
    if (!selection.isCollapsed()) {
        selection = getForwardSel(selection);
        selection = selection.merge({
            anchorKey: selection.focusKey,
            anchorOffset: selection.focusOffset,
        }) as any;
    }
    const style = contentState.getBlockForKey(selection.anchorKey).getInlineStyleAt(selection.anchorOffset - 1);
    // notice 插入实体都是不可变的
    const contentStateWithEntity = contentState.createEntity(identifier, "IMMUTABLE", {
        name,
        data,
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    contentState = Modifier.insertText(contentState, selection, identifier, style, entityKey);
    return contentState;
}
