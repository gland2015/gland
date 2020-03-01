import React from "react";
import { withStyles } from "@material-ui/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { applyInlineStyle, removeInlineStyle } from "@gland/geditor/core";
import Grow from "@material-ui/core/Grow";
// @ts-ignore
import FontColorIcon from "../asset/font.svg";

const colors = [
    "#000000",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#34495e",
    "#16a085",
    "#27ae60",
    "#2980b9",
    "#8e44ad",
    "#2c3e50",
    "#f1c40f",
    "#e67e22",
    "#e74c3c",
    "#ecf0f1",
    "#95a5a6",
    "#f39c12",
    "#d35400",
    "#c0392b",
    "#bdc3c7",
    "#7f8c8d"
];

//
export const FontColor = withStyles({
    root: {
        position: "relative"
    },
    menu: {
        position: "absolute",
        top: "100%",
        left: "-150%",
        textAlign: "center",
        boxShadom: "1px 1px 5px gray",
        backgroundColor: "white"
    },
    colorItem: {
        width: 20,
        height: 20,
        display: "inline-block",
        margin: "1px 3px"
    },
    colorContainer: {
        padding: 0,
        width: 150,
        borderTop: "1px solid rgbs(222,222,222, 0.5)",
        fontSize: "12px",
        lineHeight: 1,
        color: "#aaa"
    },
    icon: {
        "& svg": {
            width: "1.2em"
        }
    },
    popover: {},
    paper: {
        padding: 3
    }
})(function(props: any) {
    const { currentState, button, buttonHighlight, classes } = props;
    const { inlineStyle } = currentState;
    let color = inlineStyle.color || null;
    const [isOpen, setIsOpen] = React.useState(false);
    const handleOpen = event => {
        setIsOpen(true);
    };
    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div className={clsx(button, classes.root, props.classes.icon)} onMouseDown={handleMouseDown} onMouseEnter={handleOpen} onMouseLeave={handleClose}>
            <FontColorIcon style={{ fill: color }} />
            <Grow in={isOpen}>
                <div className={classes.menu}>
                    <div>字体颜色</div>
                    <div className={classes.colorContainer}>
                        {colors.map(function(backgroundColor) {
                            return (
                                <span
                                    key={backgroundColor}
                                    style={{ backgroundColor }}
                                    className={classes.colorItem}
                                    onMouseDown={e => {
                                        event.preventDefault();
                                        handleApplyColor(backgroundColor);
                                    }}
                                ></span>
                            );
                        })}
                    </div>
                </div>
            </Grow>
        </div>
    );

    function handleApplyColor(color) {
        let result;
        if (color === colors[0]) {
            result = removeInlineStyle(props.editorState, "color");
        } else {
            result = applyInlineStyle(props.editorState, "color:" + color);
        }
        props.updateEditorState(result.editorState, result.toUpdateKeys);
    }

    function handleMouseDown(event) {
        event.preventDefault();
    }
});
