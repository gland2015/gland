import React from "react";
import { icons } from "../../icons";
import { DropButton } from "./widget";
import { ToolAttr } from "../utils";

export function LineHeight(props: { attr: ToolAttr }) {
    const lang = props.attr.lang;

    return (
        <DropButton
            tip={lang.tip.lineHeight}
            list={[
                {
                    label: lang.other.defaultLH,
                    value: null,
                },
                {
                    label: "1",
                    value: "1",
                },
                {
                    label: "1.5",
                    value: "1.5",
                },
                {
                    label: "2.0",
                    value: "2",
                },
                {
                    label: "2.5",
                    value: "2.5",
                },
                {
                    label: "3.0",
                    value: "3",
                },
            ]}
            getCurValue={() => {
                const attr = props.attr;
                return attr.currentState.blockStyle?.lineHeight || null;
            }}
            onSelect={(item) => {
                const attr = props.attr;
                attr.event.emit(attr.editEvent.lineHeight, item.value);
            }}
        >
            <icons.LineHeight />
        </DropButton>
    );
}
