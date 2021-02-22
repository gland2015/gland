import React from "react";
import { Editor as DraftEditor, EditorState, convertToRaw, genKey } from "@gland/draft-ts";

import { customStyleFn } from "./model";

export const Editor = React.memo(function (props) {
 
    return <DraftEditor customStyleFn={customStyleFn} />;
});


/**
 
    to do onmusedown event.detail >= 3   event.preventDefault()

 */