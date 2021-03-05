import React from "react";
import clsx from "clsx";
import { ToolContext, ToolAttr } from "../utils";
import { icons } from "../../icons";
import { toolNormalBtn, toolClasses as classes } from "../style";

export function Underline(props: { attr: ToolAttr }) {
    const ctx = React.useContext(ToolContext);

    return (
        <div
            className={clsx(toolNormalBtn, ctx.isUnderline ? classes.btn_s : null)}
            onClick={(e) => {
                const attr = props.attr;
                attr.event.emit(attr.editEvent.underline, !ctx.isUnderline);
            }}
        >
            <icons.Underline />
        </div>
    );
}
