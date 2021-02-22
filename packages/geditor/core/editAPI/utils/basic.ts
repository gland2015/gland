import { Map } from "immutable";
import { SelectionState, ContentBlock, ContentState, EditorState, Modifier, convertFromRaw } from "@gland/draft-ts";

import { getTextData } from "../../model";

export const basicSelState = SelectionState.createEmpty("").merge({
    isBackward: false,
    anchorOffset: 0,
    focusOffset: 0,
    hasFocus: false,
});

export function getInitContent(text?: string) {
    let content = ContentState.createFromText(text || "");
    let firstKey = content.getFirstBlock().getKey();
    content = setBlockData(content, firstKey, getTextData());
    return content;
}

export function getForwardSel(sel: SelectionState): SelectionState {
    if (sel.getIsBackward()) {
        const newSel = sel.merge({
            isBackward: false,
            focusOffset: sel.getAnchorOffset(),
            focusKey: sel.getAnchorKey(),
            anchorOffset: sel.getFocusOffset(),
            anchorKey: sel.getFocusKey(),
        });
        return newSel as any;
    } else {
        return sel;
    }
}

export function findRangeBlockKeys(content: ContentState, sel: SelectionState) {
    if (sel.isCollapsed()) return [sel.anchorKey];
    sel = getForwardSel(sel);
    const keys = [sel.anchorKey, sel.focusKey];
    let nextKey = content.getKeyAfter(sel.anchorKey);
    while (nextKey && nextKey !== sel.focusKey) {
        keys.push(nextKey);
        nextKey = content.getKeyAfter(nextKey);
    }
    return keys;
}

export function reduceCurrentBlocks(Fn: (contentState: ContentState, blockData, key) => ContentState, contentState, sel) {
    sel = getForwardSel(sel);
    const focusKey = sel.getFocusKey();
    let key = sel.getAnchorKey();
    let block;
    do {
        block = contentState.getBlockForKey(key);
        contentState = Fn(contentState, block.getData(), key);
        if (key === focusKey) break;
        key = contentState.getKeyAfter(key);
    } while (key);
    return contentState;
}

export function reduceCurrentStyles(
    Fn: (contentState: ContentState, start, end, block?: ContentBlock, key?) => ContentState,
    contentState: ContentState,
    selection: SelectionState
) {
    selection = getForwardSel(selection);
    const anchorKey = selection.getAnchorKey();
    const anchorOffset = selection.getAnchorOffset();
    const focusKey = selection.getFocusKey();
    const focusOffset = selection.getFocusOffset();
    const filterFn = () => true;
    let currentKey = anchorKey;
    let currentOffset = anchorOffset;
    let currentBlock: ContentBlock;
    let newContentState = contentState;

    while (1) {
        currentBlock = contentState.getBlockForKey(currentKey);
        if (currentKey !== focusKey) {
            currentBlock.findStyleRanges(filterFn, (start, end) => {
                if (end > currentOffset) {
                    if (start < currentOffset) {
                        start = currentOffset;
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

export function setBlockData(content: ContentState, key: String, blockData: Map<any, any>) {
    let sel: any = basicSelState.merge({ anchorKey: key, focusKey: key });
    return Modifier.setBlockData(content, sel, blockData);
}

// todo limit
export function mergeBlock(contentState, key: string) {
    let beforeBlock = contentState.getBlockBefore(key);
    if (!beforeBlock) return contentState;
    let beforeKey = beforeBlock.getKey();
    let sel: any = basicSelState.merge({
        anchorKey: beforeKey,
        focusKey: key,
        anchorOffset: beforeBlock.getText().length,
    });
    contentState = Modifier.removeRange(contentState, sel, "forward");
    return contentState;
}

// todo limit only block
export function deleteBlock(contentState, key: string | Array<string>) {
    let blockMap = contentState.getBlockMap();
    if (typeof key === "string") {
        blockMap = blockMap.delete(key);
    } else {
        key.forEach((key) => {
            blockMap = blockMap.delete(key);
        });
    }
    return contentState.set("blockMap", blockMap);
}

export function splitBlock(contentState: ContentState, key, blockData?, offset?: number) {
    if (!blockData) {
        blockData = contentState.getBlockForKey(key).getData();
    }
    if (typeof offset !== "number") {
        offset = contentState.getBlockForKey(key).getText().length;
    }
    let sel: any = basicSelState.merge({
        anchorKey: key,
        focusKey: key,
        anchorOffset: offset,
        focusOffset: offset,
    });
    contentState = Modifier.splitBlock(contentState, sel);
    key = contentState.getKeyAfter(key);
    return setBlockData(contentState, key, blockData);
}

export function intertOneBlock(content: ContentState, key: string, blockData?) {
    return splitBlock(content, key, blockData);
}

// todo
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
    if (nextBlock.getText().length || !contentState.getBlockAfter(nextKey) || !nextBlock.getData().get("isTextBlock")) {
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

export function isFirstBlock(content: ContentState, key: string) {
    return !content.getBlockBefore(key);
}

export function isLastBlock(content: ContentState, key: string) {
    return !content.getKeyAfter(key);
}

export function getBlockData(content: ContentState, key: string) {
    const block = content.getBlockForKey(key);
    return block ? block.getData() : null;
}

export function isTextBlock(content: ContentState, key: string) {
    return getBlockData(content, key).get("isText");
}

export function isPureTextBlock(content: ContentState, key: string) {
    const data = getBlockData(content, key);
    return !data.get("isText") || data.get("pKey") || data.get("head") ? false : true;
}
