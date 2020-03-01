import React from "react";
import { withStyles } from "@material-ui/styles";
import clsx from "clsx";
import { applyInlineStyle, removeInlineStyle } from "@gland/geditor/core";
// @ts-ignore
import ItalicIcon from "../asset/italic.svg";

export const Italic = withStyles({
    icon: {
        "& svg": {
            width: "0.8em"
        }
    }
})(function(props: any) {
    const { currentState, button, buttonHighlight } = props;
    const { inlineStyle } = currentState;
    const isHighlight = inlineStyle.fontStyle === "italic";

    return (
        <div className={clsx(button, isHighlight ? buttonHighlight : null, props.classes.icon)} onMouseDown={handleMouseDown}>
            <ItalicIcon />
        </div>
    );

    function handleMouseDown(event: React.MouseEvent) {
        event.preventDefault();
        let result;
        if (!isHighlight) {
            result = applyInlineStyle(props.editorState, "fontStyle:italic");
        } else {
            result = removeInlineStyle(props.editorState, "fontStyle");
        }
        props.updateEditorState(result.editorState, result.toUpdateKeys);
    }
});
