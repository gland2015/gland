import React from "react";
import clsx from "clsx";
import { Spinner } from "@gland/react/spin";
import { icons } from "../icons";
import { richClasses as classes } from "../style";
import { editEvent } from "../editEvent";

export function InlineImage(props) {
    const ele = React.cloneElement(props.children[0], {
        custom: <Container props={props} />,
    });

    return ele;
}

function Container(props) {
    props = props.props;
    return props.data.isRemote ? <RemoteImage props={props} /> : <ImageContent URL={props.data.URL} props={props} />;
}

function RemoteImage(props) {
    props = props.props;

    const [URL, setURL] = React.useState(null);

    React.useEffect(() => {
        const getContentAsset = props.context.editor?.remote?.getContentAsset;
        if (getContentAsset) {
            getContentAsset(props.data, setURL, "InlineImage");
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
    const { data, context, entityKey, children } = props.props;

    const { widthType, width } = data;

    let w = null;
    if (width) {
        if (widthType === "px") {
            w = width + "px";
        }
    }

    return (
        <div
            className={clsx(classes.inlineImage, context.readOnly ? null : classes.inlineMaskContainer)}
            onClick={
                context.readOnly
                    ? null
                    : () => {
                          context.event.emit(editEvent.openEditImage, { key: entityKey, data, type: "inline" });
                      }
            }
        >
            <img src={URL} style={w ? { width: w } : null} />
            {context.readOnly ? null : (
                <div className={clsx(classes.inlineMask)}>
                    <icons.Edit />
                </div>
            )}
        </div>
    );
}
