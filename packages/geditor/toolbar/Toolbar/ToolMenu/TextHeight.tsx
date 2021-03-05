import React from "react";
import { icons } from "../../icons";
import { DropButton } from "./widget";
import { ToolAttr } from "../utils";

export function TextHeight(props: { attr: ToolAttr }) {
    return (
        <DropButton
            tip="字体大小"
            list={[
                {
                    label: "默认大小",
                    value: null,
                },
                {
                    label: "0.6",
                    value: 0.6,
                },
                {
                    label: "0.8",
                    value: 0.8,
                },
                {
                    label: "1.0",
                    value: 1,
                },
                {
                    label: "1.2",
                    value: 1.2,
                },
                {
                    label: "1.5",
                    value: 1.5,
                },
                {
                    label: "2.0",
                    value: 2,
                },
                {
                    label: "2.5",
                    value: 2.5,
                },
                {
                    label: "3.0",
                    value: 3,
                },
                {
                    label: "4.0",
                    value: 4,
                },
                {
                    label: "5.0",
                    value: 5,
                },
            ]}
            getCurValue={() => {
                const attr = props.attr;
                let str = attr.currentState.inlineStyle?.fontSize || "";
                let m = str.match(/\d+/);
                if (m) {
                    let size = parseInt(m[0]);
                    return size;
                } else {
                    return null;
                }
            }}
            onSelect={(item) => {
                const attr = props.attr;
                attr.event.emit(attr.editEvent.fontSize, item.value ? `${item.value}em` : null);
            }}
        >
            <icons.TextHeight />
        </DropButton>
    );
}
