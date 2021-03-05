import { RichUtils, Modifier, EditorState } from "@gland/draft-ts";
import * as utils from "./utils";

function getReg(name) {
    if (typeof name !== "string") {
        return /[.\n]*/;
    }
    let type,
        str = "^";
    if (name.charCodeAt(0) === 46) {
        // 类名
        str += "\\" + name;
    } else {
        name = name.split(";");
        name.forEach((value, i) => {
            if (value) {
                type = value.split(":")[0];
                str += type + ":[^;]*";
                if (name[i + 1]) {
                    str += ";";
                } else {
                    str += ";?";
                }
            }
        });
    }
    return new RegExp(str);
}

function inlineRemove(eState, name) {
    let reg = getReg(name);
    let toUpdateKeys = [];
    let editorState = eState;

    const currentStyle = eState.getCurrentInlineStyle();
    const sel = eState.getSelection();
    let contentState = eState.getCurrentContent();

    const Fn = (contentState, start, end, block, key) => {
        if (toUpdateKeys[0] !== key) {
            toUpdateKeys.unshift(key);
        }
        const currentStyle = block.getInlineStyleAt(start);
        currentStyle.forEach((value) => {
            if (value.match(reg)) {
                const sel: any = utils.basicSelState.merge({
                    anchorKey: key,
                    anchorOffset: start,
                    focusKey: key,
                    focusOffset: end,
                });
                contentState = Modifier.removeInlineStyle(contentState, sel, value);
            }
        });
        return contentState;
    };
    if (sel.isCollapsed()) {
        currentStyle.forEach((value) => {
            if (value.match(reg)) {
                editorState = RichUtils.toggleInlineStyle(eState, value);
            }
        });
        toUpdateKeys = [sel.anchorKey];
    } else {
        contentState = utils.reduceCurrentStyles(Fn, contentState, sel);
        editorState = EditorState.push(eState, contentState, "change-inline-style");
        editorState = EditorState.forceSelection(editorState, sel);
    }
    return { editorState, toUpdateKeys };
}

export function applyInlineStyle(e, name) {
    let { editorState, toUpdateKeys } = inlineRemove(e, name);
    editorState = RichUtils.toggleInlineStyle(editorState, name);
    return { editorState, toUpdateKeys };
}

export function removeInlineStyle(e, name) {
    const { editorState, toUpdateKeys } = inlineRemove(e, name);
    return { editorState, toUpdateKeys };
}
