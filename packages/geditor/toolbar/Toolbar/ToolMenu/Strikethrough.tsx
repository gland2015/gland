import React from "react";
import clsx from "clsx";
import { ToolContext, ToolAttr } from "../utils";
import { icons } from "../../icons";
import { toolNormalBtn, toolClasses as classes } from "../style";
import { BtnTip } from "./widget";

export function Strikethrough(props: { attr: ToolAttr }) {
    const lang = props.attr.lang;

    return (
        <BtnTip tip={lang.tip.strikethrough}>
            <StrikethroughContent attr={props.attr} />
        </BtnTip>
    );
}

function StrikethroughContent(props: { attr: ToolAttr }) {
    const ctx = React.useContext(ToolContext);

    return (
        <div
            className={clsx(toolNormalBtn, ctx.isStrikethrough ? classes.btn_s : null)}
            onClick={(e) => {
                const attr = props.attr;
                attr.event.emit(attr.editEvent.strikeThrough, !ctx.isStrikethrough);
            }}
        >
            <icons.Strikethrough />
        </div>
    );
}
