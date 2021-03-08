import React from "react";
import clsx from "clsx";
import { jss } from "../../common/jss";

const { classes } = jss
    .createStyleSheet({
        root: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: "0.4em",
            paddingRight: "0.4em",
            pointerEvents: "none",
            "& .content": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "1em",
                height: "1em",
                "& svg": {
                    width: "1em",
                    height: "1em",
                    fill: "currentcolor",
                },
            },
        },
    })
    .attach();

export function FixedIcon(
    Icon,
    options?: {
        style?: React.CSSProperties;
        contentStyle?: React.CSSProperties;
        className?;
        onMouseDown?;
    }
) {
    return function (props) {
        return (
            <div style={options?.style} className={clsx(classes.root, options?.className)} onMouseDown={options?.onMouseDown}>
                <div style={options?.contentStyle} className="content">
                    {typeof Icon === "function" ? Icon(props) : Icon}
                </div>
            </div>
        );
    };
}
