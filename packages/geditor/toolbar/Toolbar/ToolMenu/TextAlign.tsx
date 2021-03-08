import React from "react";
import { icons } from "../../icons";
import { DropButton } from "./widget";
import { ToolAttr, ToolContext } from "../utils";

export function TextAlign(props: { attr: ToolAttr }) {
    const lang = props.attr.lang;

    return (
        <DropButton
            tip={lang.tip.align}
            list={[
                {
                    label: <span style={{ marginLeft: "1.3em" }}>{lang.other.defaultAlign}</span>,
                    value: null,
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.AlignLeft />
                            <span>{lang.other.leftAlign}</span>
                        </React.Fragment>
                    ),
                    value: "left",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.AlignRight />
                            <span>{lang.other.rightAlign}</span>
                        </React.Fragment>
                    ),
                    value: "right",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.AlignCenter />
                            <span>{lang.other.centerAlign}</span>
                        </React.Fragment>
                    ),
                    value: "center",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.AlignJustify />
                            <span>{lang.other.justifyAlign}</span>
                        </React.Fragment>
                    ),
                    value: "justify",
                },
            ]}
            getCurValue={() => {
                const attr = props.attr;
                return attr.toolCtx.blockStyle?.textAlign || null;
            }}
            onSelect={(item) => {
                const attr = props.attr;
                attr.event.emit(attr.editEvent.blockAlign, item.value);
            }}
        >
            <AlignIcon />
        </DropButton>
    );
}

function getLabel(value) {
    if (!value || value === "left") return <icons.AlignLeft />;
    if (value === "right") return <icons.AlignRight />;
    if (value === "center") return <icons.AlignCenter />;
    if (value === "justify") return <icons.AlignJustify />;
    return null;
}

function AlignIcon(props) {
    let ctx = React.useContext(ToolContext);
    return getLabel(ctx.blockStyle?.textAlign);
}
