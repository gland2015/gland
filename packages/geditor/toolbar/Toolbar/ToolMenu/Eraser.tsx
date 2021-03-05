import React from "react";

import { icons } from "../../icons";
import { toolNormalBtn } from "../style";
import { ToolAttr } from "../utils";

export function Eraser(props: { attr: ToolAttr }) {
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
