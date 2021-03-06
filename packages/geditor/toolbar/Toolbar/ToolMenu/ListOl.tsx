import React from "react";
import clsx from "clsx";

import { icons } from "../../icons";
import { toolNormalBtn, toolClasses as classes } from "../style";
import { ToolAttr, ToolContext } from "../utils";
import { BtnTip } from "./widget";

export function ListOl(props: { attr: ToolAttr }) {
    const lang = props.attr.lang;

    return (
        <BtnTip tip={lang.tip.listol}>
            <ListOlContent attr={props.attr} />
        </BtnTip>
    );
}

function ListOlContent(props: { attr: ToolAttr }) {
    const ctx = React.useContext(ToolContext);

    const selected = ctx.wrapperName === "ListOl";

    return (
        <div
            className={clsx(toolNormalBtn, selected ? classes.btn_s : null)}
            onClick={() => {
                const attr = props.attr;
                attr.event.emit(attr.editEvent.wrapper, selected ? null : "ListOl");
            }}
        >
            <icons.ListOl />
        </div>
    );
}
