import { SelectionState, ContentState, Modifier, ContentBlock } from "@gland/draft-ts";

import { identifier } from "../../public/constants";
import { getTextData } from "../../model";
import { basicSelState, getForwardSel, splitBlock, getParentKeys, getBlockData, setBlockData, findNearInputBlock, isInputBlock } from "./basic";

export function getInsertStrVaildPos(content: ContentState, tarKey: string, tarOffset: number) {
    if (!isInputBlock(content, tarKey)) {
        let block = findNearInputBlock(content, tarKey, "backward");
        tarKey = block ? block.getKey() : null;
        tarOffset = 0;
    }
    if (!tarKey) {
        let textData = getTextData();
        let lastKey = content.getLastBlock().getKey();
        content = splitBlock(content, lastKey, textData);
        tarKey = content.getKeyAfter(lastKey);
    }
    return { content, key: tarKey, offset: tarOffset };
}

export function addText(content: ContentState, key: string, offset: number, text: string, inlineStyle, entityKey?): ContentState {
    const block = content.getBlockForKey(key);
    const blockData = block.getData();
    const head = blockData.get("head");
    if (head && !head.grow) {
        return content;
    }
    if (!blockData.get("isText")) {
        return content;
    }

    if (entityKey === undefined && offset) {
        const theEntityKey = block.getEntityAt(offset);
        if (theEntityKey) {
            const beforeEntityKey = block.getEntityAt(offset - 1);

            if (theEntityKey === beforeEntityKey) {
                const theEntity = content.getEntity(theEntityKey);
                const mutability = theEntity.get("mutability");
                if (mutability === "MUTABLE") {
                    entityKey = theEntityKey;
                }
            }
        }
    }
    entityKey = entityKey || null;

    if (inlineStyle === undefined) {
        inlineStyle = block.getInlineStyleAt(offset);
    }
    const selection = basicSelState.merge({
        anchorKey: key,
        focusKey: key,
        anchorOffset: offset,
        focusOffset: offset,
    }) as any;
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

export function applyEntity(contentState: ContentState, selection: SelectionState, name?: string, data?) {
    if (selection.isCollapsed()) {
        return { content: contentState, toUpdateKeys: [] };
    }

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
    let tarEntityKey = null;
    if (name) {
        newContentState = newContentState.createEntity(identifier, "MUTABLE", {
            name,
            data,
        });
        tarEntityKey = newContentState.getLastCreatedEntityKey();
    }

    const toUpdateKeys = [];
    const Fn = (newFnContent: ContentState, start, end, block: ContentBlock, key) => {
        if (toUpdateKeys[0] !== key) {
            toUpdateKeys.unshift(key);
        }
        let eKey = block.getEntityAt(start);
        let eData = eKey ? newFnContent.getEntity(eKey) : null;

        if (!eData || eData.getMutability() !== "IMMUTABLE") {
            const sel: any = basicSelState.merge({
                anchorKey: key,
                anchorOffset: start,
                focusKey: key,
                focusOffset: end,
            });
            newFnContent = Modifier.applyEntity(newFnContent, sel, tarEntityKey);
            hasUpdate = true;
        }

        return newFnContent;
    };

    let hasUpdate = false;
    while (1) {
        currentBlock = newContentState.getBlockForKey(currentKey);
        if (currentKey !== focusKey) {
            currentBlock.findEntityRanges(filterFn, (start, end) => {
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
            currentBlock.findEntityRanges(filterFn, (start, end) => {
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
    if (!hasUpdate) {
        return { content: contentState, toUpdateKeys };
    }
    return { content: newContentState, toUpdateKeys };
}

export function updateEntityData(content: ContentState, entityKey: string, data) {
    let oldData = content.getEntity(entityKey).getData();

    return content.replaceEntityData(
        entityKey,
        Object.assign({}, oldData, {
            data,
        })
    );
}

export function insertEntity(content: ContentState, key: string, offset: number, name, data?) {
    const block = content.getBlockForKey(key);
    const blockData = block.getData();
    const head = blockData.get("head");
    if (head && !head.grow) {
        return content;
    }
    if (!blockData.get("isText")) {
        return content;
    }

    const style = block.getInlineStyleAt(offset - 1);

    const contentStateWithEntity = content.createEntity(identifier, "IMMUTABLE", {
        name,
        data,
    });

    const selection = basicSelState.merge({
        anchorKey: key,
        focusKey: key,
        anchorOffset: offset,
        focusOffset: offset,
    }) as any;

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    content = Modifier.insertText(content, selection, identifier, style, entityKey);
    return content;
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
