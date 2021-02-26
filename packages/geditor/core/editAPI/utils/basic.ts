import { Map } from "immutable";
import { SelectionState, ContentBlock, ContentState, EditorState, Modifier, convertFromRaw } from "@gland/draft-ts";

import { getTextData } from "../../model";
import { utils } from "xlsx/types";

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

export function deleteSubBlock(content: ContentState, key) {
    let blockMap = content.getBlockMap();
    blockMap = blockMap.filter(function (block, bKey) {
        if (bKey === key) return false;
        return block.getData().get("pKey") !== key;
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

// todo
export function insertBlock(contentState: ContentState, key, blockData?, offset?, num = 1, blockDataLast?) {
    if (num > 1) {
        if (!blockDataLast) blockDataLast = blockData;
    } else {
        blockDataLast = blockData;
    }
    const firstBlock = contentState.getBlockForKey(key);
    contentState = splitBlock(contentState, key, blockDataLast, offset);

    const nextKey = contentState.getKeyAfter(key);

    if (!isCanCustomBlock(contentState, nextKey)) {
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

export function getBlockDetail(content: ContentState, key: string) {
    const blockData = getBlockData(content, key);
    const pKey = blockData.get("pKey");
    const pData = pKey ? getBlockData(content, pKey) : null;
    const pHead = pData ? pData.get("head") : null;
    const head = blockData.get("head");
    const isSubFirst = pKey ? content.getKeyBefore(key) === pKey : false;
    const isSubBlock = Boolean(pKey || head);
    const name = blockData.get("name");
    const isText = blockData.get("isText");
    const isFixed = Boolean((head && !head.grow) || (pHead && !pHead.grow));

    return {
        key,
        pKey,
        pData,
        pHead,
        head,
        isFixed,
        isSubBlock,
        name,
        isText,
        blockData,
        isSubFirst,
        get canInsertSubBlock() {
            let can = isText && !head && !isFixed;
            if (can) {
                let pKeys = getParentKeys(content, key);
                can = pKeys.length < 5;
            }
            return can;
        },
        get canBackspaceAt0() {
            return !head && !isSubFirst && !isFixed;
        },
        get isNormal() {
            if (!isText && (isFixed || head)) {
                return false;
            }
            return true;
        },
    };
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

export function isCanCustomBlock(content: ContentState, key) {
    const block = content.getBlockForKey(key);
    if (block.getText()) {
        return false;
    }
    const nextBlock = content.getBlockAfter(key);
    if (!nextBlock) {
        return false;
    }
    const bData = block.getData();
    const nextData = nextBlock.getData();

    if (!nextData.get("isText")) {
        return false;
    }
    if (nextData.get("pKey") !== bData.get("pKey")) {
        return false;
    }
    if (nextData.get("head")) {
        return false;
    }
    return true;
}

/**
 * insert a safe line
 * @param content
 * @param key
 * @param offset
 */
export function newSafeTextLine(content: ContentState, key: string, offset?: number) {
    let block = content.getBlockForKey(key);
    let detail = getBlockDetail(content, key);

    if (typeof offset !== "number") {
        offset = block.getText().length;
    }

    let newData = detail.blockData;
    let splitKey = key;
    let fromKey = key;

    if (detail.isFixed) {
        const isSelf = detail.head && !detail.head.grow;
        if (!isSelf) {
            newData = detail.pData;
            fromKey = detail.pKey;
        }
        splitKey = findSubBlockLastKey(content, fromKey);
        offset = content.getBlockForKey(splitKey).getText().length;
    }

    let newHead = newData.get("head");
    if (newHead) {
        newData = newData.remove("head");
        if (newHead.grow) {
            newData = newData.set("pKey", fromKey).remove("wrapper");
        }
    }

    if (!newData.get("isText")) {
        newData = newData.set("isText", true).set("name", "div").remove("data");
    }

    content = splitBlock(content, splitKey, newData, offset);

    return {
        content,
        newKey: content.getKeyAfter(splitKey),
        isSafeBefore: !detail.isFixed && detail.isText,
    };
}

export function findSubBlockLastKey(content: ContentState, key: string) {
    let blockMap = content.getBlockMap();
    let tarKey: string;

    blockMap.reverse().every(function (item, curKey) {
        let data = item.getData();
        if (data.get("pKey") === key || curKey === key) {
            tarKey = curKey;
            return false;
        }

        return true;
    });

    return tarKey;
}

export function newSafeCustomLine(content: ContentState, key, offset) {
    const restKeys = [];
    let tr = newSafeTextLine(content, key, offset);

    content = tr.content;
    let newKey = tr.newKey;
    if (!tr.isSafeBefore) {
        restKeys.push(tr.newKey);
        content = splitBlock(tr.content, tr.newKey, undefined, 0);
        newKey = content.getKeyAfter(tr.newKey);
    }

    let newBlock = content.getBlockForKey(newKey);
    let newData = newBlock.getData();

    let nextBlock = content.getBlockAfter(newKey);
    let nextData = nextBlock ? nextBlock.getData() : null;

    if (!nextBlock || newBlock.getText() || !nextData.get("isText") || nextData.get("head") || nextData.get("pKey") !== newData.get("pKey")) {
        content = splitBlock(tr.content, newKey, undefined, 0);
        let restKey = content.getKeyAfter(newKey);
        restKeys.push(restKey);
    }

    return {
        content,
        newKey,
        restKeys,
    };
}

export function toggleListNameByKeys(content: ContentState, list: Array<string>, keys: Array<string>, name = "div") {
    if (!name) {
        name = "div";
    }
    keys.forEach(function (key) {
        let data = getBlockData(content, key);
        if (!data.get("isText")) return;
        let oldName = data.get("name");

        if (list.indexOf(oldName) !== -1) {
            data = data.set("name", name);
            content = setBlockData(content, key, data);
        }
    });

    return content;
}
