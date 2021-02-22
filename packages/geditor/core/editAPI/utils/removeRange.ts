import { Map } from "immutable";
import { SelectionState, ContentBlock, ContentState, EditorState, Modifier, convertFromRaw } from "@gland/draft-ts";
import {
    basicSelState,
    getForwardSel,
    deleteBlock,
    isTextBlock,
    intertOneBlock,
    insertBlock,
    isPureTextBlock,
    getBlockData,
    mergeBlock,
} from "./basic";
import { clearText } from "./senior";
import { getTextData } from "../../model";

export function removeRange(content: ContentState, sel: SelectionState) {
    if (sel.isCollapsed()) return content;
    sel = getForwardSel(sel);
    if (sel.anchorKey === sel.focusKey) {
        return Modifier.removeRange(content, sel, "backward");
    }

    const anchorKey = sel.anchorKey;
    const focusKey = sel.focusKey;

    if (isPureTextBlock(content, anchorKey) && isPureTextBlock(content, focusKey)) {
        return Modifier.removeRange(content, sel, "backward");
    }

    let anchorBlock = content.getBlockForKey(sel.anchorKey);
    let focusBlock = content.getBlockForKey(sel.focusKey);

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
    while (nextKey && nextKey !== endKey) {
        const curKey = nextKey;
        nextKey = content.getKeyAfter(curKey);

        const data = getBlockData(content, nextKey);
        const pKey = data.get("pKey");
        const head = data.get("head");

        let del = true;
        if (head) {
            del = focusBlock.getData().get("pKey") === curKey ? false : true;
        } else if (pKey) {
            const pBlock = content.getBlockForKey(pKey);
            if (pBlock) {
                const pHead = pBlock.getData().get("head");
                del = pHead.grow ? true : false;
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

    return content;
}
