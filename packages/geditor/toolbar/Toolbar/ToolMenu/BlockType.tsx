import React from "react";
import { DropButton } from "./widget";
import { ToolAttr, ToolContext } from "../utils";

export function BlockType(props: { attr: ToolAttr }) {
    const attr = props.attr;
    let blockType = attr.lang.blockType;

    return (
        <DropButton
            mode="wider"
            tip={attr.lang.tip.blockType}
            list={blockList.map(function (value) {
                return {
                    value,
                    label: blockType[value],
                };
            })}
            getCurValue={() => {
                return attr.currentState.blockType;
            }}
            onSelect={(item) => {
                const value = item.value;
                attr.event.emit(attr.editEvent.toggleBlock, value);
            }}
            style={{ minWidth: 100 }}
        >
            <div style={{ minWidth: 60 }}>
                <BlockName attr={attr} />
            </div>
        </DropButton>
    );
}

const blockList = ["div", "h1", "h2", "h3", "h4", "blockquote"];

function BlockName(props: { attr: ToolAttr }) {
    let ctx = React.useContext(ToolContext);
    let blockType = props.attr.lang.blockType;
    return blockType[ctx.blockType] || blockType[ctx.blockComponentName];
}
