import { SelectionState, ContentBlock, ContentState, EditorState, Modifier, convertFromRaw } from "@gland/draft-ts";
import { getForwardSel, deleteBlock, isPureTextBlock, getBlockData, mergeBlock, getParentKeys } from "./basic";
import { clearText } from "./senior";

export function removeRange(content: ContentState, sel: SelectionState) {
    if (sel.isCollapsed()) {
        return {
            content,
            toUpdateKeys: [],
        };
    }

    sel = getForwardSel(sel);
    if (sel.anchorKey === sel.focusKey) {
        return {
            content: Modifier.removeRange(content, sel, "backward"),
            toUpdateKeys: [sel.anchorKey],
        };
    }

    const anchorKey = sel.anchorKey;
    const focusKey = sel.focusKey;

    if (isPureTextBlock(content, anchorKey) && isPureTextBlock(content, focusKey)) {
        return {
            content: Modifier.removeRange(content, sel, "backward"),
            toUpdateKeys: [sel.anchorKey],
        };
    }

    const anchorBlock = content.getBlockForKey(sel.anchorKey);
    const focusBlock = content.getBlockForKey(sel.focusKey);
    const fPKeys = getParentKeys(content, sel.focusKey);

    let tempSel = sel.merge({
        focusKey: sel.anchorKey,
        focusOffset: anchorBlock.getText().length,
    }) as SelectionState;
    content = Modifier.removeRange(content, tempSel, "backward");

    tempSel = sel.merge({
        anchorKey: sel.focusKey,
        anchorOffset: 0,
    }) as SelectionState;
    content = Modifier.removeRange(content, tempSel, "backward");

    let nextKey = content.getKeyAfter(sel.anchorKey);
    const endKey = focusKey;
    let toUpdateKeys = [anchorKey, focusKey];
    while (nextKey && nextKey !== endKey) {
        const curKey = nextKey;
        nextKey = content.getKeyAfter(curKey);

        const data = getBlockData(content, curKey);
        const pKey = data.get("pKey");
        const head = data.get("head");

        let del = true;
        if (head) {
            del = fPKeys.indexOf(curKey) === -1 ? true : false;
        } else if (pKey) {
            const pBlock = content.getBlockForKey(pKey);
            if (pBlock) {
                const pHead = pBlock.getData().get("head");
                if (pHead.grow) {
                    let beforeKey = content.getKeyBefore(curKey);
                    if (beforeKey === pKey) {
                        del = false;
                    } else {
                        del = true;
                    }
                } else {
                    del = false;
                }
            } else {
                del = true;
            }
        } else {
            del = true;
        }

        if (del) {
            content = deleteBlock(content, curKey);
        } else {
            content = clearText(content, curKey);
            toUpdateKeys.push(curKey);
        }
    }

    if (content.getKeyAfter(anchorKey) === focusKey) {
        let arData = getBlockData(content, anchorKey);
        let fcData = getBlockData(content, focusKey);
        let arPKey = arData.get("pKey");
        let fcPKey = fcData.get("pKey");

        if (arData.get("isText") && fcData.get("isText") && arPKey && arPKey === fcPKey) {
            let pData = getBlockData(content, arPKey);
            if (pData.get("head").grow) {
                content = mergeBlock(content, focusKey);
            }
        }
    }

    return { content, toUpdateKeys };
}
