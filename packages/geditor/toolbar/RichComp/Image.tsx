import React from "react";
import clsx from "clsx";

import { richClasses as classes } from "../style";
import { FabricButton, Spinner } from "@/components/fluent";
import { icons } from "../icons";

import { editEvent } from "../editEvent";

export function Image(props) {
    return props.data.isRemote ? <RemoteImage props={props} /> : <ImageContent URL={props.data.URL} props={props} />;
}

function RemoteImage(props) {
    props = props.props;

    const [URL, setURL] = React.useState(null);

    React.useEffect(() => {
        const getContentAsset = props.context.editor?.remote?.getContentAsset;
        if (getContentAsset) {
            getContentAsset(props.data, setURL, "Image");
        } else {
            setURL("");
        }
    }, [props.data]);

    if (URL === null) {
        return (
            <div contentEditable="false" suppressContentEditableWarning style={{ overflow: "hidden" }}>
                <Spinner />
            </div>
        );
    }

    return <ImageContent URL={URL} props={props} />;
}

function ImageContent(props) {
    const URL = props.URL;
    const { context, data, isSelected, blockKey } = props.props;
    const { widthType, width, align, title } = data;

    let style = {} as any;
    let imgStyle = {};
    if (width) {
        if (widthType === "rate") {
            style["width"] = width + "%";
            imgStyle["width"] = "100%";
        } else if (widthType === "px") {
            imgStyle["width"] = width + "px";
        }
    }

    if (align === "left" || align === "right") {
        style.float = align;
    }

    return (
        <div
            contentEditable="false"
            suppressContentEditableWarning
            className={clsx(
                classes.nonTextBlock,
                context.readOnly ? null : classes.inEditor,
                context.readOnly ? null : classes.blockEditContainer,
                !context.readOnly && isSelected ? classes.inFocus : null
            )}
            data-offset-key={blockKey + "-0-0"}
            onClick={
                context.readOnly
                    ? null
                    : (e) => {
                          if (e.detail >= 2) {
                              openEdit();
                          }
                      }
            }
            style={style}
        >
            <img src={URL} style={imgStyle} className={clsx(context.readOnly ? null : classes.notSelect, classes.imageContent)} />
            {context.readOnly ? null : <div style={{ fontSize: 0 }}>{"\r"}</div>}
            {title ? <div className={classes.blockTitle}>{title}</div> : null}
            {context.readOnly ? null : (
                <div
                    className={classes.blockEditIcon}
                    onClick={(event) => {
                        event.stopPropagation();
                        openEdit();
                    }}
                >
                    <icons.Edit />
                </div>
            )}
        </div>
    );

    function openEdit() {
        context.event.emit(editEvent.openEditImage, { key: blockKey, data, type: "block" });
    }
}
