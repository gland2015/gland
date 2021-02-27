import { EditorState, Modifier, SelectionState } from "@gland/draft-ts";
import * as utils from "./utils";
import { makeCollapsed } from "./content";
import { getTextData } from "../model";

export function insertSubBlock(editorState: EditorState, head: { name: string; grow: boolean; data: any }, childNum: number) {
    let oldState = editorState;
    const collR = makeCollapsed(editorState);

    editorState = collR.editorState;
    const selection = editorState.getSelection();
    let content = editorState.getCurrentContent();

    let pKeyList = utils.getParentKeys(content, selection.anchorKey);
    if (pKeyList.length > 5) {
        return { editorState: oldState, toUpdateKeys: [] };
    }

    const safeR = utils.newSafeCustomLine(content, selection.focusKey, selection.focusOffset);
    content = safeR.content;

    const newKey = safeR.newKey;
    const newBlock = content.getBlockForKey(newKey);

    const headBlockData = newBlock.getData().set("head", head);
    content = utils.setBlockData(content, newKey, headBlockData);

    let childData = getTextData("div").set("pKey", newKey);

    while (childNum > 0) {
        content = utils.splitBlock(content, newKey, childData);
        childNum--;
    }

    let newSel;
    if (head.grow) {
        newSel = utils.basicSelState.merge({
            anchorKey: newKey,
            focusKey: newKey,
        }) as any;
    } else {
        let theKey = content.getKeyAfter(newKey);
        newSel = utils.basicSelState.merge({
            anchorKey: theKey,
            focusKey: theKey,
        }) as any;
    }

    editorState = EditorState.push(editorState, content, "delete-character");
    editorState = EditorState.forceSelection(editorState, newSel);
    return { editorState, toUpdateKeys: [...collR.toUpdateKeys, selection.anchorKey, selection.focusKey] };
}

export function updateSubblockHeadData(editorState: EditorState, key: string, data) {
    const selection = editorState.getSelection();
    let content = editorState.getCurrentContent();
    let blockData = utils.getBlockData(content, key);

    let head = blockData.get("head");
    head = Object.assign({}, head, { data });

    blockData = blockData.set("head", head);

    content = utils.setBlockData(content, key, blockData);

    editorState = EditorState.push(editorState, content, "change-block-data");
    editorState = EditorState.forceSelection(editorState, selection);

    return {
        editorState,
        toUpdateKeys: null,
    };
}

export function updateFixedSubblockNum(editorState: EditorState, pKey: string, getOp, getHeadData) {
    const selection = editorState.getSelection();
    let content = editorState.getCurrentContent();

    let blockData = utils.getBlockData(content, pKey);
    let head = blockData.get("head");

    if (head.grow) {
        throw new Error("The type is wrong");
    }
    let newHeadData = getHeadData(head.data);
    head = Object.assign({}, head, {
        data: newHeadData,
    });
    blockData = blockData.set("head", head);
    content = utils.setBlockData(content, pKey, blockData);

    let childs = [];
    let key = pKey;

    while (key) {
        let afterBlock = content.getBlockAfter(key);
        if (!afterBlock) {
            break;
        }
        let data = afterBlock.getData();
        if (data.get("pKey") === pKey) {
            childs.push(afterBlock);
            key = afterBlock.getKey();
        } else {
            break;
        }
    }

    let selKey = selection.focusKey;
    childs.forEach(function (block, index) {
        let op = getOp(block, index);
        if (!op) return;
        let bKey = block.getKey();
        if (op[0] === "del") {
            if (selKey === bKey) {
                let nextData = utils.getBlockData(content, bKey);
                if (!nextData || nextData.get("pKey") !== pKey) {
                    selKey = content.getKeyBefore(bKey);
                } else {
                    selKey = content.getKeyAfter(bKey);
                }
            }
            content = utils.deleteBlock(content, bKey);
        } else if (op[0] === "right") {
            let times = op[1] || 1;
            while (times > 0) {
                content = utils.splitBlock(content, bKey);
                times--;
            }
        } else if (op[0] === "left") {
            let times = op[1] || 1;
            while (times > 0) {
                content = utils.splitBlock(content, bKey, undefined, 0);
                times--;
            }
        }
    });

    let newSel: any = utils.basicSelState.merge({
        anchorKey: selKey,
        focusKey: selKey,
    });

    editorState = EditorState.push(editorState, content, "split-block");
    editorState = EditorState.forceSelection(editorState, newSel);

    return {
        editorState,
        toUpdateKeys: null,
    };
}

export function deleteFixedSubBlock(editorState: EditorState, pKey: string) {
    let content = editorState.getCurrentContent();
    let beforeKey = content.getKeyBefore(pKey);

    content = utils.deleteSubBlock(content, pKey);

    let selKey;

    if (beforeKey) {
        selKey = content.getKeyAfter(beforeKey);
        if (!selKey) {
            selKey = beforeKey;
        }
    } else {
        selKey = content.getFirstBlock().getKey();
    }

    let newSel: any = utils.basicSelState.merge({
        anchorKey: selKey,
        focusKey: selKey,
    });

    editorState = EditorState.push(editorState, content, "split-block");
    editorState = EditorState.forceSelection(editorState, newSel);

    return {
        editorState,
        toUpdateKeys: null,
    };
}
