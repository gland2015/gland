import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { jss } from "../../common/jss";

const { classes } = jss
    .createStyleSheet({
        root: {
            "--themePrimary": "var(--glLinkThemePrimary, #0078d4)", // rgb(0,120,212)
            "--themeDarker": "var(--glLinkThemeDarker, #004578)", // rgb(0, 69, 120)
            "--neutralTertiary": "var(--glLinkNeutralTertiary, #a19f9d)", // rgb(161,159,157)
            margin: 0,
            padding: 0,
            fontSize: "inherit",
            overflow: "inherit",
            textOverflow: "inherit",
            color: "var(--themePrimary)",
            outline: "none",
            textDecoration: "none",
            background: "none transparent",
            borderTop: "none",
            borderRight: "none",
            borderLeft: "none",
            cursor: "pointer",
            display: "inline",
            borderBottom: "1px solid transparent",
            userSelect: "text",
            font: "inherit",
            "&:hover": {
                color: "var(--themeDarker)",
                textDecoration: "underline",
            },
        },
        disabled: {
            color: "var(--neutralTertiary)",
            outline: "none",
            textDecoration: "none",
            cursor: "default",
            "&:hover": {
                textDecoration: "none",
                color: "inherit",
            },
        },
    })
    .attach();

export interface FabricLinkProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?;
    children?: any;
    href?: string;
    target?: any;
    disabled?: boolean;
}

export function FabricLink(props: FabricLinkProps) {
    const cn = clsx(classes.root, props.disabled ? classes.disabled : null, props.className);

    if (props.href) {
        return React.createElement(
            props.target === "__blank" ? "a" : (Link as any),
            {
                className: cn,
                style: props.style,
                onClick: props.onClick,
                target: props.target,
                ...(props.target === "__blank"
                    ? {
                          href: props.href,
                      }
                    : {
                          to: props.href,
                      }),
            },
            props.children
        );
    }

    return (
        <button className={cn} style={props.style} onClick={props.onClick}>
            {props.children}
        </button>
    );
}
