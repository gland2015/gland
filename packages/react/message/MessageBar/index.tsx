import React from "react";
import { jss } from "../../common/jss";
import { fluentIcon } from "../../common/asset";

const jssSheet = jss.createStyleSheet({
    root: {
        display: "flex",
        padding: "10px 20px 10px 10px",
        wordBreak: "break-word",
        boxShadow: "0 3.2px 7.2px 0 rgb(0 0 0 / 13%), 0 0.6px 1.8px 0 rgb(0 0 0 / 11%)",
        boxSizing: "border-box",
    },
    icon: {
        padding: "6px 8px",
        color: "rgba(0,120,212,1)",
        "& svg": {
            width: 16,
            height: 16,
            fill: "currentcolor",
        },
    },
    content: {
        margin: "0 0 6px 8px",
    },
});

const { classes } = jssSheet;

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export function MessageBar(props: Props) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }

    const { children, ...rest } = props;

    return (
        <div className={classes.root} {...rest}>
            <div className={classes.icon}>
                <fluentIcon.InfoIcon />
            </div>
            <div className={classes.content}>{children}</div>
        </div>
    );
}
