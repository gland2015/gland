import React from 'react';
import { withStyles } from '@material-ui/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { applyInlineStyle, removeInlineStyle } from '../../../core/editAPI/inlineStyle';
import Grow from '@material-ui/core/Grow';

const fontSizes = ['1.0', '0.8', '1.2', '1.5', '2.0', '2.5', '3.0', '4.0'];

//
export const FontSize = withStyles({
    root: {
        position: 'relative'
    },
    menu: {
        position: 'absolute',
        top: '100%',
        left: '-150%',
        textAlign: 'center',
        boxShadom: '1px 1px 5px gray',
        backgroundColor: 'white'
    },
    Item: {
        padding: '2px 5px',
        lineHeight: 1.5,
        display: 'inline-block'
    },
    itemContainer: {
        padding: 0,
        width: 200,
        borderTop: '1px solid rgbs(222,222,222, 0.5)',
        fontSize: '25px',
        lineHeight: 1,
        color: '#aaa'
    },
    icon: {
        '&:before': {
            content: `"\\f034"`
        }
    },
    popover: {},
    paper: {
        padding: 3
    }
})(function(props: any) {
    const { currentState, button, buttonHighlight, classes } = props;
    const { inlineStyle } = currentState;
    const [isOpen, setIsOpen] = React.useState(false);
    const handleOpen = event => {
        setIsOpen(true);
    };
    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div className={clsx(button, classes.root)} onMouseDown={handleMouseDown} onMouseEnter={handleOpen} onMouseLeave={handleClose}>
            <span className={props.classes.icon}></span>
            <Grow in={isOpen}>
                <div className={classes.menu}>
                    <div>字号</div>
                    <div className={classes.itemContainer}>
                        {fontSizes.map(function(fontSize) {
                            return (
                                <span
                                    key={fontSize}
                                    className={classes.Item}
                                    onMouseDown={e => {
                                        event.preventDefault();
                                        handleApplyFontSize(fontSize);
                                    }}
                                >
                                    {fontSize}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </Grow>
        </div>
    );

    function handleApplyFontSize(fontSize) {
        let result;
        if (fontSize === fontSizes[0]) {
            result = removeInlineStyle(props.editorState, 'fontSize');
        } else {
            result = applyInlineStyle(props.editorState, 'fontSize:' + fontSize + 'em');
        }
        props.updateEditorState(result.editorState, result.toUpdateKeys);
    }

    function handleMouseDown(event) {
        event.preventDefault();
    }
});
