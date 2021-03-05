import React from "react";
import clsx from "clsx";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { icons } from "../icons";
import { richClasses as classes } from "../style";

import { editEvent } from "../editEvent";

export function InlineFormula(props) {
    const { data, context, entityKey, children } = props;

    const ele = React.cloneElement(children[0], {
        custom: (
            <div
                className={clsx(classes.inlineFormula, context.readOnly ? null : classes.inlineMaskContainer)}
                onClick={
                    context.readOnly
                        ? null
                        : () => {
                              context.event.emit(editEvent.openEditFormula, { key: entityKey, data, type: "inline" });
                          }
                }
            >
                <InlineMath key={data.value} math={data.value} />
                {context.readOnly ? null : (
                    <div className={clsx(classes.inlineMask)}>
                        <icons.Edit />
                    </div>
                )}
            </div>
        ),
    });

    return ele;
}
