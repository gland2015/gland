import React from "react";
import clsx from "clsx";
import { icons } from "../../icons";
import { toolNormalBtn, toolClasses as classes } from "../style";
import { ToolAttr, ToolContext } from "../utils";

export function Bold(props: { attr: ToolAttr }) {
    const ctx = React.useContext(ToolContext);

    return (
        <div
            className={clsx(toolNormalBtn, ctx.isBold ? classes.btn_s : null)}
            onClick={(e) => {
                const attr = props.attr;
                attr.event.emit(attr.editEvent.bold, !ctx.isBold);
            }}
        >
            <icons.Bold />
        </div>
    );
}
