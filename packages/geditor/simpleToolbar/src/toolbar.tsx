import React from 'react';
import { editorConfigContext } from '@gland/geditor/core';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/styles';
import { Bold, Italic, StrikeThrough, Underline, FontColor, BackColor, FontSize, Emoticon, Link, Image, File } from './menus';
import { insertEntity } from '@gland/geditor/core';

class Toolbar extends React.Component<any, any> {
    static contextType = editorConfigContext;
    constructor(props) {
        super(props);
    }

    handleLog = (event: React.MouseEvent) => {
        event.preventDefault();
        let editorState = this.context.editor.state.editorState;
        let selection = editorState.getSelection();
        let content = editorState.getCurrentContent();
        let block = content.getFirstBlock();
        let text = block.getText();
        console.log('log theSelection', selection.toJS());
        console.log('log winSelection', window.getSelection());
    };

    entityTest = (event: React.MouseEvent) => {
        event.preventDefault();
        this.context.editor.focus();
        const result = insertEntity(this.context.editor.state.editorState, 'EntityTest', {});
        this.context.editor.updateEditorState(result.editorState, result.toUpdateKeys);
    };

    render() {
        //console.log('props', this.props);
        const { classes, currentState } = this.props;
        const { buttonHighlight, button, root } = classes;
        const editor = this.context.editor;
        const updateEditorState = editor.updateEditorState;
        const editorState = editor.state.editorState;
        const buttonProps = {
            button,
            buttonHighlight,
            currentState,
            updateEditorState,
            editorState,
            editor
        };
        return (
            <div className={root}>
                <Bold {...buttonProps} />
                <Italic {...buttonProps} />
                <StrikeThrough {...buttonProps} />
                <Underline {...buttonProps} />
                <FontColor {...buttonProps} />
                <BackColor {...buttonProps} />
                <FontSize {...buttonProps} />
                <Emoticon {...buttonProps} />
                <Link {...buttonProps} />
                <Image {...buttonProps} />
                <File {...buttonProps} />
                <Button onMouseDown={this.handleLog}>log</Button>
                <Button onMouseDown={this.entityTest}>test</Button>
            </div>
        );
    }
}

const Toolbar1 = withStyles({
    root: {
        display: 'flex',
        padding: '0 5px',
        borderBottom: '1px solid #ccc',
        color: '#999',
        fontFamily: 'FontAwesome'
    },
    button: {
        '&:hover': {
            color: '#333'
        },
        textAlign: 'center',
        padding: '5px 10px',
        cursor: 'pointer',
        lineHeight: 1
    },
    buttonHighlight: {
        color: '#1e88e5'
    }
})(Toolbar);

export { Toolbar1 as Toolbar };
