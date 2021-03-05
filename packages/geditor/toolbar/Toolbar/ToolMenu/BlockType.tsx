import React from "react";
import { DropButton } from "./widget";
import { ToolAttr, ToolContext } from "../utils";

export function BlockType(props: { attr: ToolAttr }) {
    return (
        <DropButton
            mode="wider"
            tip="块类型"
            list={list}
            getCurValue={() => {
                const attr = props.attr;
                return attr.currentState.blockType;
            }}
            onSelect={(item) => {
                const attr = props.attr;
                const value = item.value;
                attr.event.emit(attr.editEvent.toggleBlock, value);
            }}
            style={{ minWidth: 100 }}
        >
            <div style={{ minWidth: 60 }}>
                <BlockName />
            </div>
        </DropButton>
    );
}

const list = [
    {
        label: "正文",
        value: "div",
    },
    {
        label: "标题1",
        value: "h1",
    },
    {
        label: "标题2",
        value: "h2",
    },
    {
        label: "标题3",
        value: "h3",
    },
    {
        label: "标题4",
        value: "h4",
    },
    {
        label: "引用",
        value: "blockquote",
    },
];

const labelMap = {
    div: "正文",
    h1: "标题1",
    h2: "标题2",
    h3: "标题3",
    h4: "标题4",
    blockquote: "引用",
    Code: "代码",
    Formula: "公式",
    HorizontalRule: "水平线",
    Image: "图片",
    Video: "视频",
    Audio: "音频",
    File: "附件",
    Iframe: "Iframe",
};

function getLabel(blockType, blockComponentName) {
    return labelMap[blockType] || labelMap[blockComponentName] || "";
}

function BlockName(props) {
    let ctx = React.useContext(ToolContext);
    return getLabel(ctx.blockType, ctx.blockComponentName);
}
