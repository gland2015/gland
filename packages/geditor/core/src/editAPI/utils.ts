import { OrderedSet, Map } from "immutable";
import { SelectionState, Modifier, EditorState, convertFromRaw, ContentState } from "@gland/draft-ts";
import { identifier } from "../public/constants";
import { getFixedWrapperFirstKey, getTextBlockData } from "../model";
import { getDecorator } from "../model";

// selection部分
/**
 * 基本selection
 */
export const basicSelectionState = SelectionState.createEmpty("").merge({
    isBackward: false,
    anchorOffset: 0,
    focusOffset: 0,
    hasFocus: false
});

/**
 * 获取正向selection
 * @param sel
 */
export const getForwardSelection = sel => {
    if (sel.getIsBackward()) {
        const newSel = sel.merge({
            isBackward: false,
            focusOffset: sel.getAnchorOffset(),
            focusKey: sel.getAnchorKey(),
            anchorOffset: sel.getFocusOffset(),
            anchorKey: sel.getFocusKey()
        });
        return newSel;
    } else {
        return sel;
    }
};

/**
 * 返回有selection的块
 * @param content 
 * @param selection 
 */
export function findRangeKeys(content, selection) {
    if(selection.isCollapsed()) return [selection.anchorKey];
    selection = getForwardSelection(selection);
    const keys = [selection.anchorKey, selection.focusKey];
    let nextKey = content.getKeyAfter(selection.anchorKey);
    while(nextKey&&nextKey !== selection.focusKey) {
        keys.push(nextKey);
        nextKey = content.getKeyAfter(nextKey);
    }
    return keys;
}

/**
 * 遍历当前选择范围的块
 * @param Fn
 * @param contentState
 * @param selection
 */
export function reduceCurrentBlocks(Fn: (contentState, blockData, key) => any, contentState, selection) {
    selection = getForwardSelection(selection);
    const focusKey = selection.getFocusKey();
    let key = selection.getAnchorKey();
    let block;
    do {
        block = contentState.getBlockForKey(key);
        contentState = Fn(contentState, block.getData(), key);
        if (key === focusKey) break;
        key = contentState.getKeyAfter(key);
    } while (key);
    return contentState;
}

/**
 * 遍历当前选择范围的内联文本
 * @param Fn 应返回修改后的contentState
 * @param contentState
 * @param selection
 */
export function reduceCurrentStyles(Fn: (newContentState, start, end, currentBlock?, currentKey?) => any, contentState, selection) {
    selection = getForwardSelection(selection);
    const anchorKey = selection.getAnchorKey();
    const anchorOffset = selection.getAnchorOffset();
    const focusKey = selection.getFocusKey();
    const focusOffset = selection.getFocusOffset();
    const filterFn = () => true;
    let currentKey = anchorKey;
    let currentOffset = anchorOffset;
    let currentBlock;
    let newContentState = contentState;
    while (1) {
        currentBlock = contentState.getBlockForKey(currentKey);
        if (currentKey !== focusKey) {
            currentBlock.findStyleRanges(filterFn, (start, end) => {
                if (end > currentOffset) {
                    if (start < currentOffset) {
                        start = currentKey;
                    }
                    newContentState = Fn(newContentState, start, end, currentBlock, currentKey);
                }
            });
            currentKey = contentState.getKeyAfter(currentKey);
            currentOffset = 0;
            if (currentKey == null) {
                console.log("error next blockKey not find");
                break;
            }
        } else {
            currentBlock.findStyleRanges(filterFn, (start, end) => {
                if (end > currentOffset && start < focusOffset) {
                    if (start < currentOffset) {
                        start = currentOffset;
                    }
                    if (end > focusOffset) {
                        end = focusOffset;
                    }
                    newContentState = Fn(newContentState, start, end, currentBlock, currentKey);
                }
            });
            break;
        }
    }
    return newContentState;
}

// 块/contentState操作

/**
 * 通过块key删除块
 * @param contentState
 * @param key string or array<string>
 */
export function deleteBlock(contentState, key: string | Array<string>) {
    // 勿删第一个块
    let blockMap = contentState.getBlockMap();
    if (typeof key === "string") {
        blockMap = blockMap.delete(key);
    } else {
        key.forEach(key => {
            blockMap = blockMap.delete(key);
        });
    }
    return contentState.set("blockMap", blockMap);
}

/**
 * 将指定块融入前一个块中
 * @param contentState
 * @param key
 */
export function mergeBlock(contentState, key: string) {
    let beforeBlock = contentState.getBlockBefore(key);
    if (!beforeBlock) return contentState;
    let beforeKey = beforeBlock.getKey();
    let sel: any = basicSelectionState.merge({
        anchorKey: beforeKey,
        focusKey: key,
        anchorOffset: beforeBlock.getText().length
    });
    contentState = Modifier.removeRange(contentState, sel, "forward");
    return contentState;
}

/**
 * 设置块数据
 * @param contentState
 * @param key
 * @param blockData
 */
export function setBlockData(contentState, key, blockData) {
    let sel: any = basicSelectionState.merge({ anchorKey: key, focusKey: key });
    return Modifier.setBlockData(contentState, sel, blockData);
}

/**
 * 将一个块从指定位置分块
 * @param contentState
 * @param key
 * @param blockData 新块的数据,默认保持一致
 * @param offset 起点，默认结尾
 */
export function splitBlock(contentState, key, blockData?, offset?: number) {
    if (!blockData) {
        blockData = contentState.getBlockForKey(key).getData();
    }
    if (offset === undefined) {
        offset = contentState.getBlockForKey(key).getText().length;
    }
    let sel: any = basicSelectionState.merge({
        anchorKey: key,
        focusKey: key,
        anchorOffset: offset,
        focusOffset: offset
    });
    contentState = Modifier.splitBlock(contentState, sel);
    key = contentState.getKeyAfter(key);
    return setBlockData(contentState, key, blockData);
}

/**
 * 插入块,若是offset在最后且非最后一个块，则不会多出新空行
 * @param contentState
 * @param key
 * @param blockData 插入的块的数据
 * @param offset 默认最后
 * @param num 插入数量
 * @param blockDataLast  若插入多个块，可以额外指定最后一个块的数据，默认已有的块数据
 */
export function insertBlock(contentState, key, blockData?, offset?, num = 1, blockDataLast?) {
    if (num > 1) {
        if (!blockDataLast) blockDataLast = blockData;
    } else {
        blockDataLast = blockData;
    }
    const firstBlock = contentState.getBlockForKey(key);
    contentState = splitBlock(contentState, key, blockDataLast, offset);
    let nextBlock = contentState.getBlockAfter(key);
    let nextKey = nextBlock.getKey();
    if (nextBlock.getText().length || !contentState.getBlockAfter(nextKey)) {
        // 如果有文本或者无文本但是最后一个块，则再分一次
        contentState = splitBlock(contentState, key, blockDataLast);
        contentState = setBlockData(contentState, nextKey, firstBlock.getData());
    }
    while (num > 1) {
        contentState = splitBlock(contentState, key, blockData);
        num--;
    }
    return contentState;
}

/**
 * 返回是否为第一个块
 * @param contentState
 * @param key
 */
export function isFirstBlock(contentState, key) {
    return !contentState.getBlockBefore(key);
}

/**
 * 返回是否为最后一个块
 * @param contentState
 * @param key
 */
export function isLastBlock(contentState, key) {
    return !contentState.getKeyAfter(key);
}

/**
 * 插入字符
 * @param contentState
 * @param text
 */
export function addText(contentState, selection, text, inlineStyle, entityKey?) {
    if (!selection.isCollapsed()) {
        selection = selection.merge({
            anchorKey: selection.focusKey,
            anchorOffset: selection.anchorOffset
        });
    }
    const block = contentState.getBlockForKey(selection.anchorKey);
    if (entityKey === undefined && selection.anchorOffset) {
        const theEntityKey = block.getEntityAt(selection.anchorOffset);
        if (theEntityKey) {
            const beforeEntityKey = block.getEntityAt(selection.anchorOffset - 1);
            // notice 这里决定了immutable实体不会增多，也保证了mutable实体前面输入不会增多
            if (theEntityKey === beforeEntityKey) {
                const theEntity = contentState.getEntity(theEntityKey);
                const mutability = theEntity.get("mutability");
                if (mutability === "MUTABLE") {
                    entityKey = theEntityKey;
                }
            }
        }
    }
    if (inlineStyle === undefined) {
        inlineStyle = block.getInlineStyleAt(selection.offset);
    }
    contentState = Modifier.insertText(contentState, selection, text, inlineStyle, entityKey);
    return contentState;
}

/**
 * 删除某个块里的全部文本
 * @param contentState
 * @param key
 */
export function clearText(contentState, key) {
    const block = contentState.getBlockForKey(key);
    const selection: any = basicSelectionState.merge({
        anchorKey: key,
        focusKey: key,
        anchorOffset: 0,
        focusOffset: block.getText().length
    });
    return Modifier.removeRange(contentState, selection, "backward");
}

/**
 * 从contentState中移除指定范围，要考虑复杂的块包装情况
 * 最后的焦点必然是选择范围的前点
 * @param contentState
 * @param selection
 */
export function removeRange(contentState, selection) {
    // 1、已折叠则直接返回
    if (selection.isCollapsed()) return contentState;
    selection = getForwardSelection(selection);
    if (selection.anchorKey === selection.focusKey) {
        // 2、同块，直接移除范围即可
        return Modifier.removeRange(contentState, selection, "backward");
    }
    if (selection.focusOffset === 0 && contentState.getKeyAfter(selection.anchorKey) === selection.focusKey) {
        selection = selection.merge({
            focusKey: selection.anchorKey,
            focusOffset: contentState.getBlockForKey(selection.anchorKey).getText().length
        });
        // 3、 focusKey就在下一个块且offset为0，这是谷歌浏览器双击或三击选择文本的行为，视为同块
        return Modifier.removeRange(contentState, selection, "backward");
    }
    /**
        不折叠且不同块，则要寻找合适的selection范围以删除
        我们认为selection的任意一端不会在非文本块里。
     */

    const anchorBlock = contentState.getBlockForKey(selection.anchorKey);
    let anchorWrapperFirstKey = getFixedWrapperFirstKey(anchorBlock);
    const focusBlock = contentState.getBlockForKey(selection.focusKey);
    let focusWrapperFirstKey = getFixedWrapperFirstKey(focusBlock);
    if (!focusWrapperFirstKey && !anchorWrapperFirstKey) {
        // 4、两端都不是固定块，直接移除范围即可
        return Modifier.removeRange(contentState, selection, "backward");
    }
    let tempSelection = selection.merge({
        focusKey: selection.anchorKey,
        focusOffset: anchorBlock.getText().length
    });
    contentState = Modifier.removeRange(contentState, tempSelection, "backward");
    tempSelection = selection.merge({
        anchorKey: selection.focusKey,
        anchorOffset: 0
    });
    contentState = Modifier.removeRange(contentState, tempSelection, "backward");

    anchorWrapperFirstKey = anchorWrapperFirstKey || {};
    focusWrapperFirstKey = focusWrapperFirstKey || {};
    let nextKey = contentState.getKeyAfter(selection.anchorKey);
    while (nextKey !== selection.focusKey) {
        const block = contentState.getBlockForKey(nextKey);
        const wrapperFirstKey = getFixedWrapperFirstKey(block);
        nextKey = contentState.getKeyAfter(nextKey);
        if (wrapperFirstKey === anchorWrapperFirstKey || wrapperFirstKey === focusWrapperFirstKey) {
            contentState = clearText(contentState, nextKey);
        } else {
            contentState = deleteBlock(contentState, nextKey);
        }
    }
    // 5、有一端是固定块，则只删除两端和固定块的文本，其余的块被删除
    return contentState;
}

/**
 * 应用实体, 若name为空，则删除实体
 * @param contentState
 * @param selection
 * @param name 组件名
 * @param data 组件数据
 */
export function applyEntity(contentState, selection, name?: string, data?) {
    if (!name) {
        return Modifier.applyEntity(contentState, selection, null);
    }
    const contentStateWithEntity = contentState.createEntity(identifier, "MUTABLE", {
        name,
        data
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
export function insertEntity(contentState, selection, name?: string, data?) {
    if (!selection.isCollapsed()) {
        selection = getForwardSelection(selection);
        selection = selection.merge({
            anchorKey: selection.focusKey,
            anchorOffset: selection.focusOffset
        });
    }
    const style = contentState.getBlockForKey(selection.anchorKey).getInlineStyleAt(selection.anchorOffset);
    // notice 插入实体都是不可变的
    const contentStateWithEntity = contentState.createEntity(identifier, "MUTABLE", {
        name,
        data
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    contentState = Modifier.insertText(contentState, selection, identifier, style, entityKey);
    return contentState;
}

/**
 * 生成编辑器的editorState
 * @param rawContent
 * @param decorators
 */
export function getEditorState(rawContent?, decorators?: Array<any>) {
    const editorDecorator = getDecorator(decorators);
    let editorState;
    if (!rawContent) {
        editorState = EditorState.createEmpty(editorDecorator);
        editorState = setStateBlockData(editorState);
    } else {
        if(typeof rawContent === 'string') {
            rawContent = JSON.parse(rawContent)
            // notice 需要将map的data再变回来
            rawContent.blocks.forEach(function(block) {
                block.data.data = Map(block.data.data);
                if(block.data.style) {
                    block.data.style = Map(block.data.style)
                }
                if(block.data.wrapper) {
                    block.data.wrapper.data = Map(block.data.wrapper.data);
                    block.data.wrapper = Map(block.data.wrapper)
                }
            })
        }
        let contentState = convertFromRaw(rawContent);
        editorState = EditorState.createWithContent(contentState, editorDecorator);
    }
    return editorState;
}


// editorState操作
/**
 * 设置editorState的块数据
 * @param editorState
 * @param key 默认第一个块的key
 * @param blockData 默认普通文本块的数据
 */
export function setStateBlockData(editorState, key?: string, blockData?) {
    let contentState = editorState.getCurrentContent();
    if (!key) key = contentState.getFirstBlock().getKey();
    if (!blockData) blockData = getTextBlockData("div");
    contentState = setBlockData(contentState, key, blockData);
    editorState = EditorState.set(editorState, { currentContent: contentState });
    return editorState;
}

export function getCurrentEntity(editorState, offset?) {
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(selection.anchorKey);
    if (typeof offset === "undefined") {
        offset = selection.anchorOffset;
    }
    const entityKey = block.getEntityAt(offset);
    if (!entityKey) return;
    return content.getEntity(entityKey);
}
