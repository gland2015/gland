import React from 'react';
import { withStyles } from '@material-ui/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { insertEntity } from '../../../core/editAPI/entity';
import Grow from '@material-ui/core/Grow';

const emotions = ['http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/pcmoren_tian_org.png', 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/50/pcmoren_huaixiao_org.png'];

//
export const Emoticon = withStyles({
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
            content: `"\\f118"`
        }
    },
    popover: {},
    paper: {
        padding: 3
    }
})(function(props: any) {
    const { currentState, button, buttonHighlight, classes } = props;
    const { inlineStyle } = currentState;
    let backgroundColor = inlineStyle.backgroundColor || '#999';
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
                    <div>表情包</div>
                    <div className={classes.itemContainer}>
                        {emotions.map(function(url) {
                            return (
                                <img
                                    key={url}
                                    src={url}
                                    className={classes.Item}
                                    onMouseDown={e => {
                                        event.preventDefault();
                                        handleInsertEmoticon(url);
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </Grow>
        </div>
    );

    function handleInsertEmoticon(url) {
        let result = insertEntity(props.editorState, 'Emoticon', { url });
        props.updateEditorState(result.editorState, result.toUpdateKeys);
    }

    function handleMouseDown(event) {
        event.preventDefault();
    }
});
