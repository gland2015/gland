import React from "react";

import clsx from "clsx";
import { jss } from "../../common/jss";

const { classes } = jss
    .createStyleSheet({
        root: {
            fontSize: 14,
            minHeight: 2,
        },
        progressWrapper: {
            position: "relative",
            overflow: "hidden",
            height: 2,
            padding: "8px 0px",
        },
        progressTrack: {
            position: "absolute",
            width: "100%",
            height: 2,
            backgroundColor: "rgb(237, 235, 233)",
        },
        "@keyframes bar": {
            "0%": {
                left: "-20%",
            },
            "100%": {
                left: "100%",
            },
        },
        progressBar: {
            height: 2,
            position: "absolute",
            transition: "width 0.3s ease 0s",
            width: 0,
            minWidth: "33%",
            background: "linear-gradient(to right, rgb(237, 235, 233) 0%, rgb(0, 120, 212) 50%, rgb(237, 235, 233) 100%)",
            animation: "2.5s ease 0s infinite normal none running $bar",
        },
        label: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "rgb(50, 49, 48)",
            paddingTop: 4,
            lineHeight: "20px",
        },
        description: {
            color: "rgb(96, 94, 92)",
            fontSize: 12,
            lineHeight: "18px",
        },
        noPadding: {
            padding: "unset",
        },
    })
    .attach();

export interface ProgressIndicatorProps {
    className?: string;
    style?: React.CSSProperties;
    hide?: boolean;
    label?: any;
    description?: any;
    noPadding?;
}

export function ProgressIndicator(props: ProgressIndicatorProps) {
    return (
        <div className={clsx(classes.root, props.className)} style={props.style}>
            {props.label ? <div className={classes.label}>{props.label}</div> : null}
            {!props.hide ? (
                <div className={clsx(classes.progressWrapper, props.noPadding ? classes.noPadding : null)}>
                    <div className={classes.progressTrack}></div>
                    <div className={classes.progressBar}></div>
                </div>
            ) : null}
            {props.description ? <div className={classes.description}>{props.description}</div> : null}
        </div>
    );
}
