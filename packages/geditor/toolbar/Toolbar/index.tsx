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
    const attr = useInitAttr(editorCtx);
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
            <ToolMenu attr={attr} />
            <Edit attr={attr} />
        </ToolContext.Provider>
    );
}

function useInitAttr(editorCtx) {
    const attr = React.useRef({} as ToolAttr).current;
    React.useMemo(() => {
        attr.editorCtx = editorCtx;

        attr.event = editorCtx.event;
        attr.editEvent = editEvent;
        attr.defaultBgColor = "#ffffff";
        attr.defaultTextColor = "#222";
        attr.textColors = [
            "#2E2E2E",
            "#888",
            "#222",
            "#404145",
            "#f0e68c",
            "#87ceeb",
            "#FAFAFA",
            "#cd5c5c",
            "#0078d4",
            "#00bcf2",
            "#107c10",
            "#bad80a",
            "#5c005c",
            "#ff8c00",
            "#e3008c",
            "#d13438",
        ];
        attr.bgColors = [
            "#deecf9",
            "#f3f2f1",
            "#e1dfdd",
            "#a19f9d",
            "#404145",
            "#0078d4",
            "#e3008c",
            "#b4a0ff",
            "#00bcf2",
            "#107c10",
            "#bad80a",
            "#00B294",
            "#407afc",
            "#fff100",
            "#ea4300",
            "#d83b01",
        ];
    }, []);
    return attr;
}
