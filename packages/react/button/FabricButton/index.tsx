import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";

import { jss } from "../../common/jss";
import { Spinner } from "../../spin/Spinner";
import { ContextualMenu, ContextualMenuProps } from "../../menu/ContextualMenu";
import { Callout } from "../../popover/Callout";

const { classes } = jss
    .createStyleSheet({
        root: {
            "--themePrimary": "var(--glBtnThemePrimary, #0078d4)",
            "--themeDark": "var(--glInputThemeDark, #005a9e)", // rgb(0, 90, 158)
            "--themeDarkAlt": "var(--glInputThemeDarkAlt, #106ebe)", // rgb(16, 110, 190)
            "--neutralPrimary": "var(--glInputNeutralPrimary, #323130)",
            "--neutralSecondaryAlt": "var(--glBtnNeutralSecondaryAlt, #8a8886)",
            "--neutralWhite": "var(--glInputNeutralWhite, #ffffff)",
            "--neutralTertiary": "var(--glInputNeutralTertiary, #a19f9d)", // rgb(161,159,157)
            "--neutralLight": "var(--glBtnNeutralLight, #edebe9)",
            "--neutralLighter": "var(--glInputNeutralLighter, #f3f2f1)", // rgb(243,242,241)
            "--neutralDark": "var(--glBtnNeutralDark, #201f1e)", // rgb(32, 31, 30)
            outline: "transparent",
            position: "relative",
            fontFamily: `"Segoe UI"`,
            fontWeight: 400,
            fontSize: "1em",
            boxSizing: "border-box",
            border: "1px solid var(--neutralSecondaryAlt)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            textAlign: "center",
            cursor: "pointer",
            padding: "0px 1em",
            borderRadius: "0.125em",
            minWidth: "5em",
            height: "2em",
            backgroundColor: "var(--neutralWhite)",
            color: "var(--neutralPrimary)",
            userSelect: "none",
            margin: 0,
            "&:hover": {
                backgroundColor: "var(--neutralLighter)",
                border: "1px solid var(--neutralSecondaryAlt)",
                color: "var(--neutralDark)",
            },
            "&:active": {
                backgroundColor: "var(--neutralLight)",
                color: "var(--neutralDark)",
                border: "1px solid var(--neutralSecondaryAlt)",
            },
        },
        defaultLoading: {
            backgroundColor: "var(--neutralLighter)",
            border: "1px solid var(--neutralSecondaryAlt)",
            color: "var(--neutralDark)",
            "&:hover": {
                backgroundColor: "var(--neutralLighter)",
                border: "1px solid var(--neutralSecondaryAlt)",
                color: "var(--neutralDark)",
            },
            "&:active": {
                backgroundColor: "var(--neutralLighter)",
                border: "1px solid var(--neutralSecondaryAlt)",
                color: "var(--neutralDark)",
            },
        },
        content: {
            fontSize: "0.92em",
            textAlign: "left",
            minHeight: "1em",
            minWidth: "1em",
            display: "flex",
            alignItems: "center",
        },
        primary: {
            border: "1px solid var(--themePrimary)",
            color: "var(--neutralWhite)",
            backgroundColor: "var(--themePrimary)",
            "&:hover": {
                backgroundColor: "var(--themeDarkAlt)",
                border: "1px solid var(--themeDarkAlt)",
                color: "var(--neutralWhite)",
            },
            "&:active": {
                backgroundColor: "var(--themeDark)",
                color: "var(--neutralWhite)",
                border: "1px solid var(--themeDark)",
            },
            "& $spin": {
                "--glSpinThemePrimary": "var(--neutralLighter)",
                "--glSpinThemeLight": "transparent",
            },
        },
        primaryLoading: {
            backgroundColor: "var(--themeDarkAlt)",
            border: "1px solid var(--themeDarkAlt)",
            color: "var(--neutralWhite)",
            "&:hover": {
                backgroundColor: "var(--themeDarkAlt)",
                border: "1px solid var(--themeDarkAlt)",
                color: "var(--neutralWhite)",
            },
            "&:active": {
                backgroundColor: "var(--themeDarkAlt)",
                border: "1px solid var(--themeDarkAlt)",
                color: "var(--neutralWhite)",
            },
        },
        disabled: {
            border: "1px solid var(--neutralLighter)",
            backgroundColor: "var(--neutralLighter)",
            color: "var(--neutralTertiary)",
            // cursor: "not-allowed",
            "&:hover": {
                border: "1px solid var(--neutralLighter)",
                backgroundColor: "var(--neutralLighter)",
                color: "var(--neutralTertiary)",
            },
            "&:active": {
                border: "1px solid var(--neutralLighter)",
                backgroundColor: "var(--neutralLighter)",
                color: "var(--neutralTertiary)",
            },
        },
        // variant
        compound: {
            height: "auto",
            maxWidth: "17.5em",
            padding: "1em 0.75em",
            minHeight: "4.5em",
        },
        commandBar: {
            border: "none",
        },
        icon: {
            padding: "0 0.25em",
            minWidth: "2em",
            height: "2em",
            border: "1px solid transparent",
            "&:hover": {
                border: "1px solid transparent",
            },
            "&:active": {
                border: "1px solid transparent",
            },
        },
        action: {
            backgroundColor: "unset",
            border: "1px solid transparent",
            padding: "0 0.25em",
            height: "2.5em",
            minWidth: "unset",
            "&:hover": {
                backgroundColor: "unset",
                color: "var(--themePrimary)",
                border: "1px solid transparent",
            },
            "&:active": {
                backgroundColor: "unset",
                color: "var(--neutralPrimary)",
                border: "1px solid transparent",
            },
        },
        spin: {
            marginRight: "0.4em",
        },
    })
    .attach();

export interface FabricButtonProps {
    type?: "button" | "submit" | "reset";
    target?: string;
    color?: "default" | "primary";
    variant?: "compound" | "commandBar" | "icon" | "action";
    style?: React.CSSProperties;
    href?: string;
    className?: string;
    children?: number | string | React.ReactNode;

    lazingLoading?: number | boolean;
    loading?: boolean;
    disabled?: boolean;
    onClick?: any;
    onMouseDown?: any;
    onRef?: any;
    menuProps?: ContextualMenuProps;
}

export function FabricButton(props: FabricButtonProps) {
    let rootClsName = clsx(
        classes.root,
        props.color === "primary" ? classes.primary : null,
        props.variant === "commandBar" ? classes.commandBar : null,
        props.variant === "compound" ? classes.compound : null,
        props.variant === "icon" ? classes.icon : null,
        props.variant === "action" ? classes.action : null,
        props.loading ? (props.color === "primary" ? classes.primaryLoading : classes.defaultLoading) : null,
        props.disabled ? classes.disabled : null,
        props.className
    );

    let childProps;
    let isLink = props.href && !props.disabled && !props.loading;

    const [Ref, setRef] = React.useState(null);
    const [show, setShow] = React.useState(false);

    let getRef = (r) => {
        setRef(r);
        props.onRef && props.onRef(r);
    };
    if (isLink) {
        childProps = {
            style: props.style,
            className: rootClsName,
            to: props.href,
            target: props.target,
            onClick: handleClick,
            onMouseDown: props.onMouseDown,
            ref: getRef,
        };
    } else {
        childProps = {
            style: props.style,
            disabled: props.disabled || props.loading,
            className: rootClsName,
            type: props.type || "button",
            onClick: handleClick,
            onMouseDown: props.onMouseDown,
            ref: getRef,
        };
    }

    return (
        <React.Fragment>
            {React.createElement(
                isLink ? Link : "button",
                childProps,
                <div className={classes.content}>
                    {props.loading ? <Spinner className={classes.spin} lazy={props.lazingLoading} /> : null}
                    {props.children}
                </div>
            )}
            {props.menuProps ? (
                <Callout
                    directionalHint="bottomLeft"
                    isBeakHidden
                    hidden={!show}
                    target={Ref}
                    style={{ padding: 0, boxShadow: "none" }}
                    gapSpace={1}
                    onDismissEvent={(event, type, isTarget) => {
                        if (!isTarget) {
                            setShow(false);
                        }
                    }}
                >
                    <ContextualMenu
                        onMenuClick={(item, event) => {
                            setShow(false);
                            if (props.menuProps?.onMenuClick) {
                                props.menuProps?.onMenuClick(item, event);
                            }
                        }}
                        items={props.menuProps.items}
                    ></ContextualMenu>
                </Callout>
            ) : null}
        </React.Fragment>
    );

    function handleClick(event) {
        if (props.menuProps) {
            setShow(!show);
        }
        props.onClick && props.onClick(event);
    }
}
