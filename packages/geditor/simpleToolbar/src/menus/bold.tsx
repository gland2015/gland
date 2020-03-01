import React from "react";
import { withStyles } from "@material-ui/styles";
import clsx from "clsx";
import { applyInlineStyle, removeInlineStyle } from "@gland/geditor/core";
// @ts-ignore
import BoldIcon from "../asset/bold.svg";

export const Bold = withStyles({
    icon: {
        "& svg": {
            width: "1em"
        }
    }
})(function(props: any) {
    const { currentState, button, buttonHighlight } = props;
    const { inlineStyle } = currentState;
    const isHighlight = inlineStyle.fontWeight === "bold";

    return (
        <div className={clsx(button, isHighlight ? buttonHighlight : null, props.classes.icon)} onMouseDown={handleMouseDown}>
            <BoldIcon />
        </div>
    );

    function handleMouseDown(event: React.MouseEvent) {
        event.preventDefault();
        let result;
        if (!isHighlight) {
            result = applyInlineStyle(props.editorState, "fontWeight:bold");
        } else {
            result = removeInlineStyle(props.editorState, "fontWeight");
        }
        props.updateEditorState(result.editorState, result.toUpdateKeys);
    }
});
