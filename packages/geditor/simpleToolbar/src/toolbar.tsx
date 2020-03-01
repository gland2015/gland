import React from "react";
import { EditorState } from "@gland/draft-ts";
import { editorConfigContext } from "@gland/geditor/core";
import Button from "@material-ui/core/Button";

import { withStyles } from "@material-ui/styles";
import { Bold, Italic, StrikeThrough, Underline, FontColor, BackColor, FontSize, Emoticon, Link, Image, File } from "./menus";
import { insertEntity } from "@gland/geditor/core";

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
        console.log("log theSelection", selection.toJS());
        console.log("log winSelection", window.getSelection());
        console.log("log text", text, text.length);
        //console.log("entity", block.getEntityAt(4));
    };

    entityTest = (event: React.MouseEvent) => {
        event.preventDefault();
        this.context.editor.focus();
        let editorState = this.context.editor.state.editorState;
        let selection = editorState.getSelection().merge({
            anchorOffset: 3,
            focusOffset: 3
        });
        editorState = EditorState.forceSelection(editorState, selection);
        this.context.editor.updateEditorState(editorState, [selection.anchorKey]);
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
                {window['__DEV__'] ? (
                    <>
                        <Button onMouseDown={this.handleLog}>log</Button>
                        <Button onMouseDown={this.entityTest}>test</Button>
                    </>
                ) : null}
            </div>
        );
    }
}

const Toolbar1 = withStyles({
    root: {
        display: "flex",
        padding: "0 5px",
        borderBottom: "1px solid #ccc",
        fill: "#999",
        fontFamily: "FontAwesome"
    },
    button: {
        "&:hover": {
            fill: "#333"
        },
        textAlign: "center",
        padding: "5px 10px",
        cursor: "pointer",
        lineHeight: 1,
        display: "inline-flex"
    },
    buttonHighlight: {
        fill: "#1e88e5"
    }
})(Toolbar);

export { Toolbar1 as Toolbar };
