import React from "react";
import { withStyles } from "@material-ui/styles";
import clsx from "clsx";
import { applyInlineStyle, removeInlineStyle } from "@gland/geditor/core";
// @ts-ignore
import StrikeThroughIcon from "../asset/strikethrough.svg";

export const StrikeThrough = withStyles({
    icon: {
        "& svg": {
            width: "1.3em"
        }
    }
})(function(props: any) {
    const { currentState, button, buttonHighlight } = props;
    const { inlineStyle } = currentState;
    const isHighlight = inlineStyle.textDecorationLine && inlineStyle.textDecorationLine.indexOf("line-through") !== -1; // underline line-through

    return (
        <div className={clsx(button, isHighlight ? buttonHighlight : null, props.classes.icon)} onMouseDown={handleMouseDown}>
            <StrikeThroughIcon />
        </div>
    );

    function handleMouseDown(event: React.MouseEvent) {
        event.preventDefault();
        let result;
        if (!isHighlight) {
            if (inlineStyle.textDecorationLine) {
                result = applyInlineStyle(props.editorState, "textDecorationLine:underline line-through");
            } else {
                result = applyInlineStyle(props.editorState, "textDecorationLine:line-through");
            }
        } else {
            if (inlineStyle.textDecorationLine.indexOf("underline") === -1) {
                result = removeInlineStyle(props.editorState, "textDecorationLine");
            } else {
                result = applyInlineStyle(props.editorState, "textDecorationLine:underline");
            }
        }
        props.updateEditorState(result.editorState, result.toUpdateKeys);
    }
});
