import React from "react";
import { EventEmitter } from "events";

import { editEvent } from "../editEvent";
import { langType } from "../lang/zh";

export interface ToolAttr {
    event: EventEmitter;
    editEvent: typeof editEvent;
    defaultTextColor: string;
    defaultBgColor: string;
    textColors: Array<string>;
    bgColors: Array<string>;

    editorCtx;
    currentState;
    toolCtx: ToolCtx;
    lang: langType;
}

interface ToolCtx {
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    isStrikethrough: boolean;
    blockType: string;
    blockStyle: React.CSSProperties;
    wrapperName: string;
    blockComponentName: string;
}

export const ToolContext = React.createContext(null as ToolCtx);
