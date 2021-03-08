import React from "react";

import { editEvent } from "../editEvent";
import { ToolAttr, ToolContext } from "./utils";
import { ToolMenu } from "./ToolMenu";
import { Edit } from "./Edit";
import { attachStyle } from "./style";

export function Toolbar(props) {
    attachStyle();
    const currentState = props.currentState;
    const { inlineStyle } = currentState;

    const editorCtx = props.context;
    const attr = useInitAttr(editorCtx, props.config);
    attr.currentState = currentState;

    const ctxValue = {
        isBold: inlineStyle?.fontWeight === "bold",
        isItalic: inlineStyle?.fontStyle === "italic",
        isUnderline: inlineStyle?.textDecorationLine && inlineStyle.textDecorationLine.indexOf("underline") !== -1,
        isStrikethrough: inlineStyle?.textDecorationLine && inlineStyle.textDecorationLine.indexOf("line-through") !== -1,
        blockType: currentState.blockType,
        blockStyle: currentState.blockStyle,
        wrapperName: currentState.wrapperName,
        blockComponentName: currentState.blockComponentName,
    };
    attr.toolCtx = ctxValue;

    return (
        <ToolContext.Provider value={ctxValue}>
            <ToolMenu attr={attr} className={props.className} menus={props.config.menus} />
            <Edit attr={attr} />
        </ToolContext.Provider>
    );
}

function useInitAttr(editorCtx, config) {
    const attr = React.useRef({} as ToolAttr).current;
    React.useMemo(() => {
        attr.editorCtx = editorCtx;

        attr.event = editorCtx.event;
        attr.editEvent = editEvent;
        attr.defaultBgColor = config.defaultBgColor;
        attr.defaultTextColor = config.defaultTextColor;
        attr.textColors = config.textColors;
        attr.bgColors = config.bgColors;
        attr.lang = editorCtx.lang;
    }, []);
    return attr;
}
