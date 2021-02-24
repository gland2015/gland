import * as utils from "./utils";
import { EditorState } from "@gland/draft-ts";

export function reduceTextBlockData(editorState: EditorState, Fn: (conent, blockData, currenType, key) => any) {
    let selection = editorState.getSelection();
    let content = editorState.getCurrentContent();
    const toUpdateKeys = [];
    content = utils.reduceCurrentBlocks(myFn, content, selection);
    editorState = EditorState.push(editorState, content, "change-block-data");
    editorState = EditorState.forceSelection(editorState, selection);
    return { editorState, toUpdateKeys };

    function myFn(conent, blockData, key) {
        if (blockData.get("isText")) {
            let newBlockData = Fn(conent, blockData, blockData.get("name"), key);
            if (blockData !== newBlockData) {
                toUpdateKeys.push(key);
                conent = utils.setBlockData(conent, key, newBlockData);
            }
        }

        return conent;
    }
}

export function applyBlockType(editorState, type: string) {
    return reduceTextBlockData(editorState, Fn);
    function Fn(theContent, blockData, currenType, key) {
        if (type !== currenType) {
            blockData = blockData.set("name", type);
        }
        return blockData;
    }
}

export function applyBlockStyle(editorState, style: object) {
    return reduceTextBlockData(editorState, Fn);
    function Fn(theContent, blockData, currenType, key) {
        const styleObj = Object.assign({}, blockData.get("style"), style);
        blockData = blockData.set("style", styleObj);
        return blockData;
    }
}

export function removeBlockStyle(editorState, styles: Array<string>) {
    return reduceTextBlockData(editorState, Fn);

    function Fn(theContent, blockData, currenType, key) {
        let styleObj = Object.assign({}, blockData.get("style"));
        for (let i = 0; i < styles.length; i++) {
            delete styleObj[styles[i]];
        }
        blockData = blockData.set("style", styleObj);
        return blockData;
    }
}
