import {
    applyInlineStyle,
    removeInlineStyle,
    applyBlockType,
    removeBlockStyle,
    applyBlockStyle,
    insertEntity,
    applyEntity,
    InsertNonTextBlock,
    updateBlockData,
    applyBlockWrapper,
    insertSubBlock,
    updateSubblockHeadData,
    updateFixedSubblockNum,
    deleteFixedSubBlock,
    updateEntity,
    removeEntity,
    redo,
    undo,
    focusKeepSelection,
} from "@gland/geditor/core";

// inline style
export function handleBold(state, bool: boolean) {
    if (bool) {
        return applyInlineStyle(state, "fontWeight:bold");
    } else {
        return removeInlineStyle(state, "fontWeight");
    }
}

export function handleItalic(state, bool: boolean) {
    if (bool) {
        return applyInlineStyle(state, "fontStyle:italic");
    } else {
        return removeInlineStyle(state, "fontStyle");
    }
}

export function handleUnderline(state, bool: boolean, currentState) {
    let result;
    let curTextDec = currentState.inlineStyle?.textDecorationLine || "";
    let haslineThrough = curTextDec.indexOf("line-through") !== -1;

    if (bool) {
        if (haslineThrough) {
            result = applyInlineStyle(state, "textDecorationLine:underline line-through");
        } else {
            result = applyInlineStyle(state, "textDecorationLine:underline");
        }
    } else {
        if (haslineThrough) {
            result = applyInlineStyle(state, "textDecorationLine:line-through");
        } else {
            result = removeInlineStyle(state, "textDecorationLine");
        }
    }

    return result;
}

export function handleStrikeThrough(state, bool: boolean, currentState) {
    let result;
    let curTextDec = currentState.inlineStyle?.textDecorationLine || "";
    let hasUnderline = curTextDec.indexOf("underline") !== -1;

    if (bool) {
        if (hasUnderline) {
            result = applyInlineStyle(state, "textDecorationLine:underline line-through");
        } else {
            result = applyInlineStyle(state, "textDecorationLine:line-through");
        }
    } else {
        if (hasUnderline) {
            result = applyInlineStyle(state, "textDecorationLine:underline");
        } else {
            result = removeInlineStyle(state, "textDecorationLine");
        }
    }

    return result;
}

export function handleEraser(state) {
    return removeInlineStyle(state, null);
}

export function handleColor(state, color) {
    if (color) {
        return applyInlineStyle(state, `color:${color}`);
    } else {
        return removeInlineStyle(state, "color");
    }
}

export function handleBgColor(state, color) {
    if (color) {
        return applyInlineStyle(state, `backgroundColor:${color}`);
    } else {
        return removeInlineStyle(state, "backgroundColor");
    }
}

export function handleFontSize(state, value) {
    if (value) {
        return applyInlineStyle(state, `fontSize:${value}`);
    } else {
        return removeInlineStyle(state, "fontSize");
    }
}

export function handleFontFamily(state, value) {
    if (value) {
        return applyInlineStyle(state, `fontFamily:${value}`);
    } else {
        return removeInlineStyle(state, "fontFamily");
    }
}

export function handleFontEffect(state, value) {
    let r = removeInlineStyle(state, ".");

    if (value) {
        return applyInlineStyle(r.editorState, value);
    }
    return r;
}

// block style
export function handleToggleBlock(state, value) {
    return applyBlockType(state, value);
}

export function handleBlockAlign(state, value) {
    if (value) {
        return applyBlockStyle(state, { textAlign: value });
    } else {
        return removeBlockStyle(state, ["textAlign"]);
    }
}

export function handleLineHeight(state, value) {
    if (value) {
        return applyBlockStyle(state, { lineHeight: value });
    } else {
        return removeBlockStyle(state, ["lineHeight"]);
    }
}

export function handleToggleBlockWrapper(state, value) {
    return applyBlockWrapper(state, value);
}

// emoji
export function handleEmotion(state, value) {
    return insertEntity(state, "Emoticon", { title: value });
}

export function handleAddLink(state, value) {
    return applyEntity(state, "Link", { url: value });
}

export function handleEditLink(state, key, data) {
    return updateEntity(state, key, data);
}

export function handleRemoveLink(state, args) {
    return removeEntity(state, args.key, args.start, args.end);
}

export function handleAddCode(state, data) {
    return InsertNonTextBlock(state, "Code", data);
}

export function handleEditCode(state, key, data) {
    return updateBlockData(state, key, data);
}

export function handleAddFormula(state, data) {
    return InsertNonTextBlock(state, "Formula", data);
}

export function handleAddInlineFormula(state, data) {
    return insertEntity(state, "InlineFormula", data);
}

export function handleEditInlineFormula(state, key, data) {
    return updateEntity(state, key, data);
}

export function handleEditFormula(state, key, data) {
    return updateBlockData(state, key, data);
}

export function handleAddHorizontalRule(state) {
    return InsertNonTextBlock(state, "HorizontalRule", null);
}

export function handleAddImage(state, data) {
    return InsertNonTextBlock(state, "Image", data);
}

export function handleEditImage(state, key, data) {
    return updateBlockData(state, key, data);
}

export function handleAddInlineImage(state, data) {
    return insertEntity(state, "InlineImage", data);
}

export function handleEditInlineImage(state, key, data) {
    return updateEntity(state, key, data);
}

export function handleAddVideo(state, data) {
    return InsertNonTextBlock(state, "Video", data);
}

export function handleEditVideo(state, key, data) {
    return updateBlockData(state, key, data);
}

export function handleAddAudio(state, data) {
    return InsertNonTextBlock(state, "Audio", data);
}

export function handleEditAudio(state, key, data) {
    return updateBlockData(state, key, data);
}

export function handleAddFile(state, data) {
    return InsertNonTextBlock(state, "File", data);
}

export function handleEditFile(state, key, data) {
    return updateBlockData(state, key, data);
}

export function handleAddIframe(state, data) {
    return InsertNonTextBlock(state, "Iframe", data);
}

export function handleEditIframe(state, key, data) {
    return updateBlockData(state, key, data);
}

export function handleAddComment(state, data) {
    return insertEntity(state, "Comment", data);
}

export function handleEditComment(state, key, data) {
    return updateEntity(state, key, data);
}

export function handleAddExpandableList(state) {
    return insertSubBlock(state, { name: "ExpandableList", grow: true, data: { open: true } }, 1);
}

export function handleEditExpandableList(state, key, data) {
    return updateSubblockHeadData(state, key, data);
}

export function handleAddTable(state, data, childNum) {
    return insertSubBlock(state, { name: "Table", grow: false, data }, childNum);
}

export function handleEditTableAttr(state, key, data) {
    return updateSubblockHeadData(state, key, data);
}

export function handleEditTableNum(state, { key, type, point, rows }) {
    let colNum = rows[0].length;
    let rowNum = rows.length;
    if (type === "col-left") {
        return updateFixedSubblockNum(
            state,
            key,
            (block, index) => {
                if ((index - point[1]) % colNum === 0) {
                    return ["left", 1];
                }
            },
            (oldData) =>
                Object.assign({}, oldData, {
                    column: oldData.column + 1,
                })
        );
    }

    if (type === "col-right") {
        return updateFixedSubblockNum(
            state,
            key,
            (block, index) => {
                if ((index - point[1]) % colNum === 0) {
                    return ["right", 1];
                }
            },
            (oldData) =>
                Object.assign({}, oldData, {
                    column: oldData.column + 1,
                })
        );
    }

    if (type === "row-up") {
        return updateFixedSubblockNum(
            state,
            key,
            (block, index) => {
                let tar = point[0] * colNum;
                if (tar === index) {
                    return ["left", colNum];
                }
            },
            (oldData) =>
                Object.assign({}, oldData, {
                    row: oldData.row + 1,
                })
        );
    }

    if (type === "row-down") {
        return updateFixedSubblockNum(
            state,
            key,
            (block, index) => {
                let tar = (point[0] + 1) * colNum - 1;
                if (tar === index) {
                    return ["right", colNum];
                }
            },
            (oldData) =>
                Object.assign({}, oldData, {
                    row: oldData.row + 1,
                })
        );
    }

    if (type === "col-del") {
        if (colNum <= 1) {
            return deleteFixedSubBlock(state, key);
        }

        return updateFixedSubblockNum(
            state,
            key,
            (block, index) => {
                if ((index - point[1]) % colNum === 0) {
                    return ["del"];
                }
            },
            (oldData) =>
                Object.assign({}, oldData, {
                    column: oldData.column - 1,
                })
        );
    }

    if (type === "row-del") {
        if (rowNum <= 1) {
            return deleteFixedSubBlock(state, key);
        }

        return updateFixedSubblockNum(
            state,
            key,
            (block, index) => {
                let tarRow = (index / colNum) | 0;

                if (tarRow === point[0]) {
                    return ["del"];
                }
            },
            (oldData) =>
                Object.assign({}, oldData, {
                    row: oldData.row - 1,
                })
        );
    }
}

export function handleRedo(state) {
    return redo(state);
}

export function handleUndo(state) {
    return undo(state);
}

export function handleFocus(state) {
    return focusKeepSelection(state);
}
