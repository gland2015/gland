import React from "react";
import clsx from "clsx";
import { SyntaxHighlighter, syntaxStyles } from "@gland/react/common/SyntaxHighlighter";

import { richClasses as classes } from "../style";
import { editEvent } from "../editEvent";
import { icons } from "../icons";

export function Code(props) {
    const { context, block, data, isSelected, blockKey } = props;

    return (
        <div
            contentEditable="false"
            suppressContentEditableWarning
            className={clsx(
                classes.code,
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
        >
            <div className={clsx(context.readOnly ? null : classes.notSelect, classes.codeContent)}>
                <SyntaxHighlighter style={syntaxStyles[data.theme]} language={data.mode} children={data.value || ""} />
            </div>
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
        context.event.emit(editEvent.openEditCode, { key: block.getKey(), data });
    }
}
