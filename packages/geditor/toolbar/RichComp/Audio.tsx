import React from "react";
import clsx from "clsx";
import { richClasses as classes } from "../style";
import { FabricButton, Spinner } from "@/components/fluent";
import { icons } from "../icons";

import { editEvent } from "../editEvent";

export function Audio(props) {
    return props.data.isRemote ? <RemoteAudio props={props} /> : <AudioContent URL={props.data.URL} props={props} />;
}

function RemoteAudio(props) {
    props = props.props;

    const [URL, setURL] = React.useState(null);

    React.useEffect(() => {
        const getContentAsset = props.context.editor?.remote?.getContentAsset;
        if (getContentAsset) {
            getContentAsset(props.data, setURL, "Audio");
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

    return <AudioContent URL={URL} props={props} />;
}

function AudioContent(props) {
    const URL = props.URL;
    const { context, data, isSelected, blockKey } = props.props;
    const { align, title } = data;

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
            <audio src={URL} controls className={clsx(context.readOnly ? null : classes.notSelect, classes.audioContent)} />
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
        context.event.emit(editEvent.openEditAudio, { key: blockKey, data });
    }
}
