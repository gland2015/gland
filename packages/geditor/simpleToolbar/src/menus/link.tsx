import React from 'react';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { applyEntity } from '../../../core/editAPI/entity';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

// notice startOffset
export const Link = withStyles({
    icon: {
        '&:before': {
            content: `"\\f0c1"`
        }
    }
})(function(props: any) {
    const { currentState, button, buttonHighlight } = props;
    const { entityData } = currentState;
    let url;
    if (entityData&&entityData.name==='Link') {
        url = entityData.data.url;
    }
    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);

    return (
        <>
            <div className={clsx(button)} onMouseDown={handleMouseDown}>
                <span className={props.classes.icon}></span>
            </div>
            {open ? (
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                >
                    <LinkInput url={url} isNew={true} handleConfirm={handleConfirm} />
                </Popover>
            ) : null}
        </>
    );

    function handleMouseDown(event) {
        event.preventDefault();
        //handleConfirm('https://baidu.com/')
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function handleConfirm(value: string) {
        handleClose()
        props.editor.focus()
        const result = applyEntity(props.editorState, 'Link', { url: value });
        props.updateEditorState(result.editorState, result.toUpdateKeys);
    }
});

function LinkInput(props) {
    const { url = '', isNew, handleClear, handleConfirm } = props;
    const [value, setValue] = React.useState(url);

    return (
        <div>
            <Input value={value} onChange={handleInputChange} />
            {isNew ? null : <Button onClick={handleClear}>清除链接</Button>}
            <Button onMouseDown={handleConfirmClick}>确定</Button>
        </div>
    );

    function handleConfirmClick(event) {
        event.preventDefault()
        handleConfirm(value);
    }

    function handleInputChange(event) {
        setValue(event.target.value);
    }
}
