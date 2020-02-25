import React from 'react';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { applyInlineStyle, removeInlineStyle } from '../../../core/editAPI/inlineStyle';

export const Underline = withStyles({
    icon: {
        '&:before': {
            content: `"\\f0cd"`
        }
    }
})(function(props: any) {
    const { currentState, button, buttonHighlight } = props;
    const { inlineStyle } = currentState;
    const isHighlight = inlineStyle.textDecorationLine && inlineStyle.textDecorationLine.indexOf('underline') !== -1; // underline line-through

    return (
        <div className={clsx(button, isHighlight ? buttonHighlight : null)} onMouseDown={handleMouseDown}>
            <span className={props.classes.icon}></span>
        </div>
    );

    function handleMouseDown(event: React.MouseEvent) {
        event.preventDefault();
        let result;
        if (!isHighlight) {
            if (inlineStyle.textDecorationLine) {
                result = applyInlineStyle(props.editorState, 'textDecorationLine:underline line-through');
            } else {
                result = applyInlineStyle(props.editorState, 'textDecorationLine:underline');
            }
        } else {
            if (inlineStyle.textDecorationLine.indexOf('underline') === -1) {
                result = removeInlineStyle(props.editorState, 'textDecorationLine');
            } else {
                result = applyInlineStyle(props.editorState, 'textDecorationLine:line-through');
            }
        }
        props.updateEditorState(result.editorState, result.toUpdateKeys);
    }
});