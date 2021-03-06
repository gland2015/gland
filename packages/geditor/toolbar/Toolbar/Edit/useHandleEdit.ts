import React from "react";
import { ToolAttr } from "../utils";
import * as handles from "./handles";

export function useHandleEdit(toolAttr) {
    React.useEffect(() => {
        const attr: ToolAttr = toolAttr;
        const editorCtx = attr.editorCtx;

        function handleFocus() {
            const editorState = editorCtx.editorState;
            let result = handles.handleFocus(editorState);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        // inline style
        function handleBold(bool) {
            const editorState = editorCtx.editorState;
            let result = handles.handleBold(editorState, bool);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleItalic(bool) {
            const editorState = editorCtx.editorState;
            let result = handles.handleItalic(editorState, bool);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleUnderline(bool) {
            const editorState = editorCtx.editorState;
            const currentState = attr.currentState;

            let result = handles.handleUnderline(editorState, bool, currentState);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleStrikeThrough(bool) {
            const editorState = editorCtx.editorState;
            const currentState = attr.currentState;

            let result = handles.handleStrikeThrough(editorState, bool, currentState);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleEraser() {
            const editorState = editorCtx.editorState;
            const currentState = attr.currentState;

            let result = handles.handleEraser(editorState);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleColor(value) {
            const editorState = editorCtx.editorState;
            let result = handles.handleColor(editorState, value);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleBgColor(value) {
            const editorState = editorCtx.editorState;
            let result = handles.handleBgColor(editorState, value);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleFontSize(value) {
            const editorState = editorCtx.editorState;
            let result = handles.handleFontSize(editorState, value);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleFontFamily(value) {
            const editorState = editorCtx.editorState;
            let result = handles.handleFontFamily(editorState, value);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleLineHeight(value) {
            const editorState = editorCtx.editorState;
            let result = handles.handleLineHeight(editorState, value);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleFontEffect(value) {
            const editorState = editorCtx.editorState;
            let result = handles.handleFontEffect(editorState, value);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        // block
        function handleToggleBlock(value) {
            const editorState = editorCtx.editorState;
            let result = handles.handleToggleBlock(editorState, value);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleBlockAlign(value) {
            const editorState = editorCtx.editorState;
            let result = handles.handleBlockAlign(editorState, value);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleToggleBlockWrapper(value) {
            const editorState = editorCtx.editorState;
            let result = handles.handleToggleBlockWrapper(editorState, value);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleEmoTicon(value) {
            const editorState = editorCtx.editorState;
            let result = handles.handleEmotion(editorState, value);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleAddLink(value) {
            const editorState = editorCtx.editorState;
            let result = handles.handleAddLink(editorState, value);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleEditLink(args) {
            const editorState = editorCtx.editorState;
            let result = handles.handleEditLink(editorState, args.key, args.data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleRemoveLink(args) {
            const editorState = editorCtx.editorState;
            let result = handles.handleRemoveLink(editorState, args);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleAddCode(data) {
            const editorState = editorCtx.editorState;
            let result = handles.handleAddCode(editorState, data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleEditCode(args) {
            const editorState = editorCtx.editorState;
            let result = handles.handleEditCode(editorState, args.key, args.data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleAddFormula(data) {
            const editorState = editorCtx.editorState;
            let result = handles.handleAddFormula(editorState, data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleEditFormula(args) {
            const editorState = editorCtx.editorState;
            let result = handles.handleEditFormula(editorState, args.key, args.data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleAddInlineFormula(data) {
            const editorState = editorCtx.editorState;
            let result = handles.handleAddInlineFormula(editorState, data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleEditInlineFormula(args) {
            const editorState = editorCtx.editorState;
            let result = handles.handleEditInlineFormula(editorState, args.key, args.data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleAddHorizontalRule(args) {
            const editorState = editorCtx.editorState;
            let result = handles.handleAddHorizontalRule(editorState);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleAddImage(args) {
            const editorState = editorCtx.editorState;
            let result = handles.handleAddImage(editorState, args);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleEditImage(args) {
            const editorState = editorCtx.editorState;
            let result = handles.handleEditImage(editorState, args.key, args.data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleAddInlineImage(data) {
            const editorState = editorCtx.editorState;
            let result = handles.handleAddInlineImage(editorState, data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleEditInlineImage(args) {
            const editorState = editorCtx.editorState;
            let result = handles.handleEditInlineImage(editorState, args.key, args.data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleAddVideo(data) {
            const editorState = editorCtx.editorState;
            let result = handles.handleAddVideo(editorState, data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleEditVideo(args) {
            const editorState = editorCtx.editorState;
            let result = handles.handleEditVideo(editorState, args.key, args.data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleAddAudio(data) {
            const editorState = editorCtx.editorState;
            let result = handles.handleAddAudio(editorState, data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleEditAudio(args) {
            const editorState = editorCtx.editorState;
            let result = handles.handleEditAudio(editorState, args.key, args.data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleAddFile(data) {
            const editorState = editorCtx.editorState;
            let result = handles.handleAddFile(editorState, data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleEditFile(args) {
            const editorState = editorCtx.editorState;
            let result = handles.handleEditFile(editorState, args.key, args.data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleAddIframe(data) {
            const editorState = editorCtx.editorState;
            let result = handles.handleAddIframe(editorState, data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleEditIframe(args) {
            const editorState = editorCtx.editorState;
            let result = handles.handleEditIframe(editorState, args.key, args.data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleAddComment(data) {
            const editorState = editorCtx.editorState;
            let result = handles.handleAddComment(editorState, data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleEditComment(args) {
            const editorState = editorCtx.editorState;
            let result = handles.handleEditComment(editorState, args.key, args.data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleAddExpandableList(args) {
            const editorState = editorCtx.editorState;
            let result = handles.handleAddExpandableList(editorState);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleEditExpandableList(args) {
            const editorState = editorCtx.editorState;
            let result = handles.handleEditExpandableList(editorState, args.key, args.data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleAddTable(data) {
            const editorState = editorCtx.editorState;
            let result = handles.handleAddTable(editorState, data, data.row * data.column);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleEditTableAttr(args) {
            const editorState = editorCtx.editorState;
            let result = handles.handleEditTableAttr(editorState, args.key, args.data);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleEditTableNum(args) {
            const editorState = editorCtx.editorState;
            let result = handles.handleEditTableNum(editorState, args);
            editorCtx.updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleRedo(args) {
            const editorState = editorCtx.editorState;
            let newState = handles.handleRedo(editorState);
            editorCtx.updateEditorState(newState, null);
        }

        function handleUndo(args) {
            const editorState = editorCtx.editorState;
            let newState = handles.handleUndo(editorState);
            editorCtx.updateEditorState(newState, null);
        }

        attr.event.on(attr.editEvent.focus, handleFocus);
        attr.event.on(attr.editEvent.bold, handleBold);
        attr.event.on(attr.editEvent.italic, handleItalic);
        attr.event.on(attr.editEvent.underline, handleUnderline);
        attr.event.on(attr.editEvent.strikeThrough, handleStrikeThrough);
        attr.event.on(attr.editEvent.eraser, handleEraser);
        attr.event.on(attr.editEvent.color, handleColor);
        attr.event.on(attr.editEvent.bgColor, handleBgColor);

        attr.event.on(attr.editEvent.fontSize, handleFontSize);
        attr.event.on(attr.editEvent.fontFamily, handleFontFamily);
        attr.event.on(attr.editEvent.lineHeight, handleLineHeight);
        attr.event.on(attr.editEvent.fontEffect, handleFontEffect);
        attr.event.on(attr.editEvent.toggleBlock, handleToggleBlock);
        attr.event.on(attr.editEvent.blockAlign, handleBlockAlign);

        attr.event.on(attr.editEvent.wrapper, handleToggleBlockWrapper);

        attr.event.on(attr.editEvent.emoticon, handleEmoTicon);
        attr.event.on(attr.editEvent.addLink, handleAddLink);
        attr.event.on(attr.editEvent.editLink, handleEditLink);
        attr.event.on(attr.editEvent.removeLink, handleRemoveLink);

        attr.event.on(attr.editEvent.addCode, handleAddCode);
        attr.event.on(attr.editEvent.editCode, handleEditCode);

        attr.event.on(attr.editEvent.addFormula, handleAddFormula);
        attr.event.on(attr.editEvent.editFormula, handleEditFormula);
        attr.event.on(attr.editEvent.addHorizontalRule, handleAddHorizontalRule);
        attr.event.on(attr.editEvent.editInlineFormula, handleEditInlineFormula);
        attr.event.on(attr.editEvent.addImage, handleAddImage);
        attr.event.on(attr.editEvent.editImage, handleEditImage);
        attr.event.on(attr.editEvent.addInlineImage, handleAddInlineImage);
        attr.event.on(attr.editEvent.editInlineImage, handleEditInlineImage);

        attr.event.on(attr.editEvent.addVideo, handleAddVideo);
        attr.event.on(attr.editEvent.editVideo, handleEditVideo);

        attr.event.on(attr.editEvent.addAudio, handleAddAudio);
        attr.event.on(attr.editEvent.editAudio, handleEditAudio);

        attr.event.on(attr.editEvent.addFile, handleAddFile);
        attr.event.on(attr.editEvent.editFile, handleEditFile);

        attr.event.on(attr.editEvent.addIframe, handleAddIframe);
        attr.event.on(attr.editEvent.editIframe, handleEditIframe);

        attr.event.on(attr.editEvent.addComment, handleAddComment);
        attr.event.on(attr.editEvent.editComment, handleEditComment);

        attr.event.on(attr.editEvent.expandableList, handleAddExpandableList);
        attr.event.on(attr.editEvent.editExpandableList, handleEditExpandableList);

        attr.event.on(attr.editEvent.addTable, handleAddTable);
        attr.event.on(attr.editEvent.editTableAttr, handleEditTableAttr);
        attr.event.on(attr.editEvent.editTableNum, handleEditTableNum);
        attr.event.on(attr.editEvent.addInlineFormula, handleAddInlineFormula);

        attr.event.on(attr.editEvent.redo, handleRedo);
        attr.event.on(attr.editEvent.undo, handleUndo);

        return () => {
            attr.event.removeAllListeners();
        };
    }, []);
}
