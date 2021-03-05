import React from "react";
import { jss } from "../jss";
import clsx from "clsx";

const jssSheet = jss.createStyleSheet({
    root: { minWidth: 150, margin: "5px 0" },
    label: {
        textAlign: "right",
        fontSize: 14,
    },
    content: {
        height: 3,
        display: "flex",
        justifyContent: "flex-start",
        backgroundColor: "#deecf9",
    },
    bar: {
        height: "100%",
        backgroundColor: "#0078d4",
    },
});
const { classes } = jssSheet;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    rate: number;
    label?: string;
}

export function RateHint(props: Props) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }

    const { rate, label, className, ...rest } = props;

    return (
        <div {...rest} className={clsx(classes.root, className)}>
            {label ? <div className={classes.label}>{label}</div> : null}
            <div className={classes.content}>
                <div className={classes.bar} style={{ width: rate * 100 + "%" }}></div>
            </div>
        </div>
    );
}
