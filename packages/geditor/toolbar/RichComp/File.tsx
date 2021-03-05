import React from "react";
import clsx from "clsx";
import { richClasses as classes } from "../style";
import { FabricButton, Spinner } from "@/components/fluent";
import { icons } from "../icons";
import { editEvent } from "../editEvent";

export function File(props) {
    return props.data.isRemote ? <RemoteFile props={props} /> : <FileContent URL={props.data.URL} props={props} />;
}

function RemoteFile(props) {
    props = props.props;

    const [URL, setURL] = React.useState(null);

    React.useEffect(() => {
        const getContentAsset = props.context.editor?.remote?.getContentAsset;
        if (getContentAsset) {
            getContentAsset(props.data, setURL, "File");
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

    return <FileContent URL={URL} props={props} />;
}

function FileContent(props) {
    const URL = props.URL;
    const { context, data, isSelected, blockKey } = props.props;
    const { align, title, filename, size } = data;

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
            <a href={context.readOnly ? URL : null} download className={clsx(context.readOnly ? null : classes.notSelect, classes.fileContent)}>
                <div className={classes.fileIcon}>
                    <icons.Paperclip />
                </div>
                <div className={classes.fileBody}>
                    <div className={classes.fileTitle}>{title}</div>
                    <div className={classes.fileFooter}>
                        {size} · {filename}
                    </div>
                </div>
            </a>
            {context.readOnly ? null : <div style={{ fontSize: 0 }}>{"\r"}</div>}
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
        context.event.emit(editEvent.openEditFile, { key: blockKey, data });
    }
}
