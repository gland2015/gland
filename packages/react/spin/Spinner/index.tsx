import React from "react";
import clsx from "clsx";
import { jss } from "../../common/jss";

const jssSheet = jss.createStyleSheet({
    root: {
        "--themePrimary": "var(--glSpinThemePrimary, #0078d4)", // rgb(0,120,212)
        "--themeLight": "var(--glSpinThemeLight, #c7e0f4)", // rgb(199, 224, 244)

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    "@keyframes spin": {
        "0%": {
            transform: "rotate(0deg)",
        },
        "100%": {
            transform: "rotate(360deg)",
        },
    },
    content: {
        boxSizing: "border-box",
        borderRadius: "50%",
        borderWidth: 1.5,
        borderStyle: "solid",
        borderColor: "var(--themePrimary) var(--themeLight) var(--themeLight)",
        borderImage: "initial",
        animationName: "$spin",
        animationDuration: "1.3s",
        animationIterationCount: "infinite",
        animationTimingFunction: "cubic-bezier(0.53, 0.21, 0.29, 0.67)",
        width: "1.25em",
        height: "1.25em",
    },
    hide: {
        display: "none",
    },
});

const classes = jssSheet.classes;

export interface SpinnerProps {
    className?: string;
    style?: React.CSSProperties;

    lazy?: number | boolean;
}

export function Spinner(props: SpinnerProps) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }

    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        let timer;
        if (props.lazy) {
            let lazy = 1000;
            if (typeof props.lazy === "number") {
                lazy = props.lazy;
            }

            timer = setTimeout(() => {
                setShow(true);
            }, lazy);
        } else {
            setShow(true);
        }

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const rootClsName = clsx(classes.root, show ? null : classes.hide, props.className);

    return (
        <div className={rootClsName} style={props.style}>
            <div className={classes.content}></div>
        </div>
    );
}
