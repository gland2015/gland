import { Map } from "immutable";
import { SelectionState, ContentBlock, ContentState, EditorState, Modifier, convertFromRaw } from "@gland/draft-ts";

import { getTextData } from "../../model";

export const basicSelState = SelectionState.createEmpty("").merge({
    isBackward: false,
    anchorOffset: 0,
    focusOffset: 0,
    hasFocus: true,
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

export function ajustIsBackward(content: ContentState, selection: SelectionState): SelectionState {
    let isBackward = false;
    if (selection.anchorKey === selection.focusKey) {
        if (selection.anchorOffset > selection.focusOffset) {
            isBackward = true;
        }
    } else {
        const startKey = content
            .getBlockMap()
            .keySeq()
            .skipUntil((v) => v === selection.anchorKey || v === selection.focusKey)
            .first();

        isBackward = startKey === selection.focusKey;
    }

    if (isBackward === selection.isBackward) {
        return selection;
    }
    return selection.merge({
        isBackward,
    }) as any;
}

export function getBlockLastSel(block: ContentBlock) {
    let offset = block.getText().length;
    let key = block.getKey();

    return basicSelState.merge({
        anchorKey: key,
        anchorOffset: offset,
        focusKey: key,
        focusOffset: offset,
    }) as SelectionState;
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
        currentBlock = newContentState.getBlockForKey(currentKey);
        if (currentKey !== focusKey) {
            currentBlock.findStyleRanges(filterFn, (start, end) => {
                if (end > currentOffset) {
                    if (start < currentOffset) {
                        start = currentOffset;
                    }
                    newContentState = Fn(newContentState, start, end, currentBlock, currentKey);
                }
            });
            currentKey = newContentState.getKeyAfter(currentKey);
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

export function deleteSubBlock(content: ContentState, key) {
    let blockMap = content.getBlockMap();
    blockMap = blockMap.filter(function (block, bKey) {
        return !isContain(content, key, bKey);
    }) as any;
    return content.set("blockMap", blockMap) as any;
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

export function getParentKeys(content: ContentState, key) {
    const pKeys = [];
    while (key) {
        let data = getBlockData(content, key);
        let pKey = data.get("pKey");

        if (!pKey) {
            break;
        }
        if (pKeys.indexOf(pKey) !== -1) {
            break;
        }
        pKeys.push(pKey);
        key = pKey;
    }

    return pKeys;
}

export function isContain(content: ContentState, pKey, key) {
    if (key === pKey) return true;

    let pKeys = getParentKeys(content, key);
    return pKeys.indexOf(pKey) !== -1;
}

export function findNearInputBlock(content: ContentState, key: string, direction: "forward" | "backward") {
    let block: ContentBlock;
    while (key) {
        key = direction === "forward" ? content.getKeyBefore(key) : content.getKeyAfter(key);
        if (!key) {
            break;
        }
        if (isInputBlock(content, key)) {
            block = content.getBlockForKey(key);
            break;
        }
    }
    return block;
}

export function isInputBlock(content: ContentState, key) {
    const block = content.getBlockForKey(key);
    let data = block.getData();
    if (!data.get("isText")) {
        return false;
    }
    let head = data.get("head");
    if (head && !head.grow) {
        return false;
    }
    return true;
}
