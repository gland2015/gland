import { EditorState } from "@gland/draft-ts";
import * as utils from "./utils";

export function applyBlockWrapper(editorState: EditorState, name: string) {
    let selection = editorState.getSelection();
    let content = editorState.getCurrentContent();
    const toUpdateKeys = [];
    const headKeys = [];

    content = utils.reduceCurrentBlocks(myFn, content, selection);

    editorState = EditorState.push(editorState, content, "change-block-data");
    editorState = EditorState.forceSelection(editorState, selection);
    return { editorState, toUpdateKeys };

    function myFn(conent, blockData, key) {
        const pKey = blockData.get("pKey");
        const pData = pKey ? utils.getBlockData(content, pKey) : null;

        if (!name) {
            if (pData && !pData.get("head").grow) {
                blockData = pData.remove("wrapper");
                toUpdateKeys.push(pKey);
                return utils.setBlockData(conent, pKey, blockData);
            } else {
                toUpdateKeys.push(key);
                blockData = blockData.remove("wrapper");
                return utils.setBlockData(conent, key, blockData);
            }
        }

        const head = blockData.get("head");
        if (head?.grow) {
            headKeys.push(key);
        }

        if (pKey && headKeys.indexOf(pKey) !== -1) {
            return content;
        }

        if (pData && !pData.get("head").grow) {
            const wrapper = pData.get("wrapper");
            blockData = pData.set("wrapper", {
                name,
                depth: wrapper?.depth || 0,
            });
            toUpdateKeys.push(pKey);
            return utils.setBlockData(conent, pKey, blockData);
        } else {
            const wrapper = blockData.get("wrapper");
            blockData = blockData.set("wrapper", {
                name,
                depth: wrapper?.depth || 0,
            });
            toUpdateKeys.push(key);
            return utils.setBlockData(conent, key, blockData);
        }
    }
}

export function addBlockWrapperDepth(editorState) {
    let selection = editorState.getSelection();
    let content = editorState.getCurrentContent();
    const toUpdateKeys = [];

    content = utils.reduceCurrentBlocks(myFn, content, selection);

    editorState = EditorState.push(editorState, content, "change-block-data");
    editorState = EditorState.forceSelection(editorState, selection);
    return { editorState, toUpdateKeys };

    function myFn(conent, blockData, key) {
        const wrapper = blockData.get("wrapper");

        if (wrapper) {
            toUpdateKeys.push(key);
            blockData = blockData.set("wrapper", {
                name: wrapper.name,
                depth: wrapper.depth > 4 ? 5 : wrapper.depth + 1,
            });
            return utils.setBlockData(conent, key, blockData);
        } else {
            return content;
        }
    }
}

export function reduceBlockWrapperDepth(editorState) {
    let selection = editorState.getSelection();
    let content = editorState.getCurrentContent();
    const toUpdateKeys = [];

    content = utils.reduceCurrentBlocks(myFn, content, selection);

    editorState = EditorState.push(editorState, content, "change-block-data");
    editorState = EditorState.forceSelection(editorState, selection);
    return { editorState, toUpdateKeys };

    function myFn(conent, blockData, key) {
        const wrapper = blockData.get("wrapper");

        if (wrapper) {
            toUpdateKeys.push(key);
            blockData = blockData.set("wrapper", {
                name: wrapper.name,
                depth: wrapper.depth > 0 ? wrapper.depth - 1 : 0,
            });
            return utils.setBlockData(conent, key, blockData);
        } else {
            return content;
        }
    }
}
