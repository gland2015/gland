import React, { LegacyRef } from "react";

import clsx from "clsx";
import { jss } from "../../common/jss";

const jssSheet = jss.createStyleSheet({
    root: {
        display: "block",
        height: 1,
        backgroundColor: "rgb(237, 235, 233)",
        position: "relative",
    },
});
const classes = jssSheet.classes;

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Divider(props: DividerProps) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }

    const { className, ...rest } = props;

    return <div className={clsx(classes.root, className)} {...rest}></div>;
}
