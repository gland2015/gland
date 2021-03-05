import React from "react";
import clsx from "clsx";

import { jss } from "../../common/jss";
import { fluentIcon } from "../../common/asset/icons";

const jssSheet = jss.createStyleSheet({
    root: {
        display: "flex",
        alignItems: "center",
        userSelect: "none",
    },
    default: {
        "&:hover $markBox svg": {
            opacity: 1,
            fill: "rgb(96, 94, 92)",
        },
    },
    checked: {
        "& $markBox": {
            border: "1px solid rgb(0, 120, 212)",
            background: "rgb(0, 120, 212)",
            "& svg": {
                opacity: 1,
                fill: "white !important",
            },
        },
        "&:hover $markBox": {
            border: "1px solid rgb(0, 90, 158)",
            background: "rgb(0, 90, 158)",
        },
    },
    indet: {
        "& $markBox": {
            border: "1px solid rgb(0, 120, 212)",
            "&:after": {
                content: '""',
                borderRadius: 2,
                position: "absolute",
                width: 10,
                height: 10,
                top: 4,
                left: 4,
                boxSizing: "border-box",
                borderWidth: 5,
                borderStyle: "solid",
                borderColor: "rgb(0, 120, 212)",
                transitionProperty: "border-width, border, border-color",
                transitionDuration: "200ms",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.23, 1)",
            },
        },
        "&:hover $markBox": {
            border: "1px solid rgb(0, 90, 158)",
            "&:after": {
                borderColor: "rgb(0, 90, 158)",
            },
        },
    },
    markBox: {
        position: "relative",
        display: "flex",
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
        height: 20,
        width: 20,
        border: "1px solid rgb(50, 49, 48)",
        borderRadius: 2,
        boxSizing: "border-box",
        transitionProperty: "background, border, border-color",
        transitionDuration: "200ms",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.23, 1)",
        overflow: "hidden",
        marginRight: 4,
        cursor: "pointer",
        "& svg": {
            opacity: 0,
            fill: "transparent",
            width: 15,
            height: 18,
        },
    },
    label: {
        display: "inline-block",
        cursor: "pointer",
    },
});

const classes = jssSheet.classes;

interface CheckboxProps extends React.HTMLAttributes<HTMLDivElement> {
    label?: string;
    checked?: boolean;
    indeterminate?: boolean;
    onCheck?: (checked?: boolean, indeterminate?: boolean) => any;
}

export function Checkbox(props: CheckboxProps) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }

    const { label, checked, indeterminate, className, onCheck, ...rest } = props;

    const rcls = clsx(classes.root, checked ? classes.checked : indeterminate ? classes.indet : classes.default, className);

    return (
        <div className={rcls} {...rest}>
            <div className={classes.markBox} onClick={handleClick}>
                <fluentIcon.CheckMarkIcon />
            </div>
            <div className={classes.label} onClick={handleClick}>
                {label}
            </div>
        </div>
    );

    function handleClick() {
        onCheck && onCheck(!checked, indeterminate);
    }
}
