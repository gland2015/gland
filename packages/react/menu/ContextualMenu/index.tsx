import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";

import { jss } from "../../common/jss";
import { Empty } from "../../common/Empty";
import { Divider } from "../../divider";

const jssSheet = jss.createStyleSheet({
    root: {
        fontSize: 14,
        fontWeight: 400,
        backgroundColor: "rgb(255, 255, 255)",
        minWidth: 180,
        listStyleType: "none",
        margin: 0,
        padding: 0,
        boxShadow: "rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px",
        overflowY: "auto",
        overflowX: "hidden",
        "&::-webkit-scrollbar": {
            width: 6,
            height: 6,
        },
        "&::-webkit-scrollbar-thumb": {
            background: "#ccc",
            borderRadius: 3,
        },
        "&::-webkit-scrollbar-track": {
            background: "#f0f0e1",
            borderRadius: 3,
        },
    },
    li: {
        fontSize: 14,
        fontWeight: 400,
        color: "rgb(50, 49, 48)",
        position: "relative",
        boxSizing: "border-box",
        "&>a,button": {
            outline: "transparent",
            position: "relative",
            fontSize: 14,
            fontWeight: 400,
            color: "rgb(50, 49, 48)",
            backgroundColor: "transparent",
            border: "none",
            width: "100%",
            height: "2.57em",
            lineHeight: "2.57em",
            cursor: "pointer",
            padding: "0px 8px 0px 4px",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
        },
    },
    icon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& svg": {
            width: "1.3em",
            height: "1.3em",
            margin: "0 4px",
            fill: "currentcolor",
        },
    },
    text: {
        marginLeft: 4,
    },
    li_normal: {
        "&:hover": {
            backgroundColor: "rgb(243, 242, 241)",
            color: "rgb(32, 31, 30)",
        },
        "&:active": {
            backgroundColor: "rgb(237, 235, 233)",
        },
    },
    li_disabled: {
        "&>a,button": {
            color: "rgb(161, 159, 157)",
            cursor: "default",
        },
    },
});
const classes = jssSheet.classes;

export interface ContextualMenuProps extends React.HTMLAttributes<HTMLUListElement> {
    onMenuClick?: (item, event) => any;
    items: Array<{
        key: string | number;
        icon?: JSX.Element;
        text?: any;
        type?: "text" | "divider";
        href?: string;
        hrefTarget?: string;
        disabled?: boolean;
    }>;
}

export function ContextualMenu(props: ContextualMenuProps) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }

    const { items, onMenuClick, className, ...rest } = props;

    if (!props.items) return null;

    return (
        <ul className={clsx(classes.root, className)} {...rest}>
            {items.map(function (o) {
                if (o.type === "divider") {
                    return (
                        <li key={o.key} className={classes.li}>
                            <Divider />
                        </li>
                    );
                }

                const handleClick = (event) => {
                    onMenuClick && onMenuClick(o, event);
                };

                const content = (
                    <>
                        {o.icon ? <div className={classes.icon}>{o.icon}</div> : null} <div className={classes.text}>{o.text}</div>
                    </>
                );

                return (
                    <li key={o.key} className={clsx(classes.li, o.disabled ? classes.li_disabled : classes.li_normal)}>
                        {o.href && !o.disabled ? (
                            o.hrefTarget === "__blank" ? (
                                <a href={o.href} target={o.hrefTarget} onClick={handleClick}>
                                    {content}
                                </a>
                            ) : (
                                <Link to={o.href} target={o.hrefTarget} onClick={handleClick}>
                                    {content}
                                </Link>
                            )
                        ) : (
                            <button onClick={handleClick} disabled={o.disabled}>
                                {content}
                            </button>
                        )}
                    </li>
                );
            })}
            {items.length === 0 ? <Empty /> : null}
        </ul>
    );
}
