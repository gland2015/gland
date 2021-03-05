import React from "react";
import clsx from "clsx";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

import { richClasses as classes } from "../style";
import { editEvent } from "../editEvent";
import { icons } from "../icons";

export function Formula(props) {
    const { context, data, isSelected, blockKey } = props;

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
        >
            <div style={{ minHeight: 30 }} className={context.readOnly ? null : classes.notSelect}>
                <BlockMath key={data.value} math={data.value} />
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
        context.event.emit(editEvent.openEditFormula, { key: blockKey, data, type: "block" });
    }
}
