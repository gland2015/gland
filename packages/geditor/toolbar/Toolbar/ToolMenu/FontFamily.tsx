import React from "react";
import { icons } from "../../icons";
import { DropButton } from "./widget";
import { ToolAttr } from "../utils";

export function FontFamily(props: { attr: ToolAttr }) {
    const lang = props.attr.lang;

    return (
        <DropButton
            tip={lang.tip.fontFamily}
            list={lang.fontFamily.map(function (item) {
                return {
                    label: <span style={{ fontFamily: item.value }}>{item.label}</span>,
                    value: item.value,
                };
            })}
            getCurValue={() => {
                const attr = props.attr;
                return attr.currentState.inlineStyle?.fontFamily;
            }}
            onSelect={(item) => {
                const attr = props.attr;
                attr.event.emit(attr.editEvent.fontFamily, item.value);
            }}
        >
            <icons.FontFamily />
        </DropButton>
    );
}
