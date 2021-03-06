import React from "react";
import { Map } from "immutable";
import { TextBlockData, NonTextBlockData } from "../../interface";

import { DraftBlock, DraftWrapper } from "../../component";

export function getTextData(name?: string) {
    return Map({
        isText: true,
        name: name || "div", // 格式：htmltype + '_' + 后缀
    } as TextBlockData);
}

export function getNonTextData(name?: String) {
    return Map({
        isText: false,
        name: name || "",
    } as NonTextBlockData);
}

export const blockRenderMap: any = Map({
    unstyled: {
        element: DraftBlock,
        wrapper: <DraftWrapper />,
    },
});

// wrapper
// depth: 0
// name

// data

// name : 'sss'
// grow: false / true

// other data
// isOpen - boolean
// colNum - 10 table
