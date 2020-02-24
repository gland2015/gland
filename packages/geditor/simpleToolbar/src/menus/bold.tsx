import React from 'react';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { applyInlineStyle, removeInlineStyle } from '../../../core/editAPI/inlineStyle';

export const Bold = withStyles({
    icon: {
        '&:before': {
            content: `"\\f032"`
        }
    }
})(function(props: any) {
    const { currentState, button, buttonHighlight } = props;
    const { inlineStyle } = currentState;
    const isHighlight =  inlineStyle.fontWeight === 'bold';

    return (
        <div className={clsx(button,  isHighlight ? buttonHighlight : null)}  onMouseDown={handleMouseDown} >
            <span className={props.classes.icon}></span>
        </div>
    );

    function handleMouseDown(event: React.MouseEvent) {
        event.preventDefault();
        let result;
        if(!isHighlight) {
            result = applyInlineStyle(props.editorState, 'fontWeight:bold');
        } else {
            result = removeInlineStyle(props.editorState, 'fontWeight')
        }
        props.updateEditorState(result.editorState, result.toUpdateKeys);

    }
});
