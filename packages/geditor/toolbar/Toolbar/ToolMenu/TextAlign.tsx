import React from "react";
import { icons } from "../../icons";
import { DropButton } from "./widget";
import { ToolAttr, ToolContext } from "../utils";

export function TextAlign(props: { attr: ToolAttr }) {
    return (
        <DropButton
            tip="对齐"
            list={[
                {
                    label: <span style={{ marginLeft: "1.3em" }}>默认对齐</span>,
                    value: null,
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.AlignLeft />
                            <span>左对齐</span>
                        </React.Fragment>
                    ),
                    value: "left",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.AlignRight />
                            <span>右对齐</span>
                        </React.Fragment>
                    ),
                    value: "right",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.AlignCenter />
                            <span>居中对齐</span>
                        </React.Fragment>
                    ),
                    value: "center",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.AlignJustify />
                            <span>两端对齐</span>
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
