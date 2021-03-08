import React from "react";

import { icons } from "../../icons";
import { toolNormalBtn } from "../style";
import { ToolAttr } from "../utils";

import { BtnTip } from "./widget";

export function Eraser(props: { attr: ToolAttr }) {
    const tip = props.attr.lang.tip;
    return (
        <BtnTip tip={tip.eraser}>
            <EraserContent attr={props.attr} />
        </BtnTip>
    );
}

function EraserContent(props: { attr: ToolAttr }) {
    return (
        <div
            className={toolNormalBtn}
            onClick={() => {
                const attr = props.attr;
                attr.event.emit(attr.editEvent.eraser, true);
            }}
        >
            <icons.Eraser />
        </div>
    );
}
