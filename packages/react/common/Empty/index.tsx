import React from "react";
import clsx from "clsx";
import { jss } from "../jss";
import { commonIcon } from "../asset";

const jssSheet = jss.createStyleSheet({
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: "rgba(0,0,0,.25)",
        fontSize: 14,
        margin: "1em 0",
    },
    icon: {
        width: "4.57em",
        height: "2.929em",
    },
    text: {
        marginTop: 6,
    },
});

const { classes } = jssSheet;

interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
    text?: any;
}

export function Empty(props: EmptyProps) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }
    const { className, text, ...rest } = props;

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <commonIcon.Empty className={classes.icon} />
            <div className={classes.text}>{props.text || "暂无数据"}</div>
        </div>
    );
}
