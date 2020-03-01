import React from "react";
import { withStyles } from "@material-ui/styles";
import clsx from "clsx";
import { insertEntity } from "@gland/geditor/core";
// @ts-ignore
import FolderOpenIcon from "../asset/folder-open.svg";

export const File = withStyles({
    icon: {
        "& svg": {
            width: "1.4em"
        }
    }
})(function(props: any) {
    const { button, classes } = props;

    const attr = React.useRef({
        fileInput: null
    }).current;

    return (
        <div className={clsx(button, classes.icon)} onMouseDown={handleSelectFile}>
            <FolderOpenIcon />
            <input ref={r => (attr.fileInput = r)} type="file" style={{ display: "none" }} onChange={handleFileChange} />
        </div>
    );

    function handleSelectFile(event) {
        event.preventDefault();
        attr.fileInput.click();
    }

    function handleFileChange(event) {
        const file = event.target.files[0];

        props.editor.remoteDataProvider.addContentAsset(file).then(storeData => {
            handleConfirm(storeData);
            attr.fileInput.value = null;
        });
    }

    function handleConfirm(data) {
        props.editor.focus();
        const result = insertEntity(props.editorState, "File", data);
        props.updateEditorState(result.editorState, result.toUpdateKeys);
    }
});
