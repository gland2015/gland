import React from "react";
import { withStyles } from "@material-ui/styles";
import clsx from "clsx";
import { insertEntity } from "@gland/geditor/core";
// @ts-ignore
import ImageIcon from "../asset/image.svg";
// @ts-ignore
import UploadIcon from "../asset/cloud-upload.svg";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";

import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// https://raw.githubusercontent.com/gland2015/images/master/%E7%A5%9E%E9%9B%95%E4%BE%A0%E4%BE%A3.jpg

// todo 无需更新
export const Image = withStyles({
    icon: {
        "& svg": {
            width: "1.4em"
        }
    },
    uploadIcon: {
        "& svg": {
            width: "1em"
        },
        fontSize: 70,
        cursor: "pointer",
        "&:hover": {
            fill: "#333"
        }
    },
    upload: {
        lineHeight: 1,
        textAlign: "center",
        color: "#999",
        padding: "20px"
    }
})(function(props: any) {
    const { button, classes } = props;

    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);

    return (
        <>
            <div className={clsx(button, classes.icon)} onMouseDown={handleMouseDown}>
                <ImageIcon />
            </div>
            {open ? (
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center"
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center"
                    }}
                >
                    <ImageInput handleConfirm={handleConfirm} classes={classes} />
                </Popover>
            ) : null}
        </>
    );

    function handleMouseDown(event) {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function handleConfirm(value: any) {
        handleClose();
        if (typeof value === "string") {
            props.editor.focus();
            const result = insertEntity(props.editorState, "Image", { url: value, isRemote: false });
            props.updateEditorState(result.editorState, result.toUpdateKeys);
        } else {
            props.editor.remoteDataProvider.addContentAsset(value).then(storeData => {
                console.log("store data", storeData);
                props.editor.focus();
                const result = insertEntity(props.editorState, "Image", storeData);
                props.updateEditorState(result.editorState, result.toUpdateKeys);
            });
        }
    }
});

function ImageInput(props) {
    const { handleConfirm, classes } = props;
    const [value, setValue] = React.useState("");

    const [tab, setTab] = React.useState(0);
    const attr = React.useRef({
        fileInput: null
    }).current;

    return (
        <div>
            <Paper>
                <Tabs value={tab} indicatorColor="primary" textColor="primary" onChange={handleTabChange}>
                    <Tab label="本地图片" />
                    <Tab label="网络图片" />
                </Tabs>
                {tab ? (
                    <>
                        <Input value={value} onChange={handleInputChange} />
                        <Button onClick={handleConfirmClick}>确定</Button>
                    </>
                ) : (
                    <div className={classes.upload} onMouseDown={handleSelectImage}>
                        <span className={classes.uploadIcon}>
                            <UploadIcon />
                        </span>
                        <input ref={r => (attr.fileInput = r)} type="file" style={{ display: "none" }} onChange={handleFileChange} />
                    </div>
                )}
            </Paper>
        </div>
    );

    function handleSelectImage() {
        attr.fileInput.click();
    }

    async function handleFileChange(event: any) {
        // notice 允许最大110kb的文件为base64，长度150000， file.size 110000
        event.persist();
        const file = event.target.files[0];
        handleConfirm(file);
    }

    function handleTabChange(event, newValue) {
        setTab(newValue);
    }

    function handleConfirmClick() {
        handleConfirm(value);
    }

    function handleInputChange(event) {
        setValue(event.target.value);
    }
}
