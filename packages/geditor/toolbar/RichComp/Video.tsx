import React from "react";
import clsx from "clsx";
import ReactPlayer from "react-player";
import { Spinner } from "@gland/react/spin";

import { richClasses as classes } from "../style";
import { icons } from "../icons";

import { editEvent } from "../editEvent";

export function Video(props) {
    return props.data.isRemote ? <RemoteVideo props={props} /> : <VideoContent URL={props.data.URL} props={props} />;
}

function RemoteVideo(props) {
    props = props.props;

    const [URL, setURL] = React.useState(null);

    React.useEffect(() => {
        const getContentAsset = props.context.editor?.remote?.getContentAsset;
        if (getContentAsset) {
            getContentAsset(props.data, setURL, "Video");
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

    return <VideoContent URL={URL} props={props} />;
}

function VideoContent(props) {
    const URL = props.URL;
    const { context, data, isSelected, blockKey } = props.props;
    const { width, height, align, title, catalog } = data;

    let style = {} as any;

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
            {catalog === "2" ? (
                <iframe src={URL} width={width} height={height} className={clsx(classes.iframeEle, context.readOnly ? null : classes.notSelect)} />
            ) : (
                <ReactPlayer
                    url={URL}
                    controls
                    volume={1}
                    width={width}
                    height={height}
                    style={
                        context.readOnly
                            ? null
                            : {
                                  pointerEvents: "none",
                                  userSelect: "none",
                              }
                    }
                />
            )}
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
        context.event.emit(editEvent.openEditVideo, { key: blockKey, data, type: "block" });
    }
}
