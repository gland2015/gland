import React from "react";
import clsx from "clsx";

import { richClasses as classes } from "../style";
import { editEvent } from "../editEvent";
import { icons } from "../icons";

export function Iframe(props) {
    const { context, data, isSelected, blockKey } = props;

    const { width, height, align, catalog, value } = data;

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
            <iframe
                width={width}
                height={height}
                {...(catalog === "0" ? { src: value } : { srcDoc: value })}
                className={clsx(context.readOnly ? null : classes.notSelect, classes.iframeEle)}
            />
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
        context.event.emit(editEvent.openEditIframe, { key: blockKey, data });
    }
}
