import React from "react";
import clsx from "clsx";
import { ToolContext, ToolAttr } from "../utils";
import { icons } from "../../icons";
import { toolNormalBtn, toolClasses as classes } from "../style";

export function Italic(props: { attr: ToolAttr }) {
    const ctx = React.useContext(ToolContext);

    return (
        <div
            className={clsx(toolNormalBtn, ctx.isItalic ? classes.btn_s : null)}
            onClick={() => {
                const attr = props.attr;
                attr.event.emit(attr.editEvent.italic, !ctx.isItalic);
            }}
        >
            <icons.Italic />
        </div>
    );
}
