import React from "react";
import clsx from "clsx";

import { jss } from "../../common/jss";
import { Callout } from "../../popover";
import { fluentIcon } from "../../common/asset/icons";

const jssSheet = jss.createStyleSheet({
    root: {
        boxShadow: "none",
        margin: "0px",
        boxSizing: "border-box",
        WebkitFontSmoothing: "antialiased",
        fontSize: "14px",
        fontWeight: "400",
        color: "rgb(50, 49, 48)",
        border: "1px solid rgb(96, 94, 92)",
        borderRadius: "2px",
        position: "relative",
        outline: "0px",
        userSelect: "none",
        textAlign: "center",
        height: "2.286em",
        display: "inline-block",
        "&:active": {
            borderColor: "#004578",
        },
        "&:hover": {
            borderColor: "#0078d4",
        },
    },
    curLabel: {
        boxShadow: "none",
        margin: "0px",
        padding: "0px 28px 0px 8px",
        boxSizing: "border-box",
        borderRadius: "2px",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
    },
    icon: {
        position: "absolute",
        top: "1px",
        right: "8px",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        "& svg": {
            width: 12,
            height: 12,
        },
    },
    menu: {
        fontSize: 14,
        fontWeight: 400,
        backgroundColor: "rgb(255, 255, 255)",
        minWidth: 50,
        listStyleType: "none",
        margin: 0,
        padding: 0,
        boxShadow: "rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px",
        overflow: "auto",
        "&>li": {
            fontSize: 14,
            fontWeight: 400,
            color: "rgb(50, 49, 48)",
            position: "relative",
            boxSizing: "border-box",
            width: "100%",
            minHeight: 36,
            padding: "0px 8px",
            display: "flex",
            alignItems: "center",
            overflowWrap: "break-word",
            userSelect: "none",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "rgb(243, 242, 241)",
                color: "rgb(32, 31, 30)",
            },
        },
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
    menuCurItem: {
        backgroundColor: "rgb(243, 242, 241)",
    },
});

const classes = jssSheet.classes;

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: number;
    menuStyle?: React.CSSProperties;
    selecedKey?: string | number;
    placeholder?: string;
    list?: Array<{ key: string | number; label: any; value?: any }>;
    onChange?: (item: any) => any;
}

export function Dropdown(props: DropdownProps) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }

    const [rootEle, setRootEle] = React.useState(null);
    const [hide, setHide] = React.useState(true);

    const { selecedKey, list, onChange, placeholder, className, onClick, menuStyle, style, width = 200, ...rest } = props;

    const rcls = clsx(classes.root, className);

    let curItem = React.useMemo(() => {
        let cur;
        list.every(function (item) {
            if (item.key === selecedKey) {
                cur = item;
                return false;
            }
            return true;
        });
        return cur;
    }, [selecedKey, list]);

    return (
        <React.Fragment>
            <div
                ref={setRootEle}
                className={rcls}
                onClick={(event) => {
                    setHide(!hide);
                    onClick && onClick(event);
                }}
                style={{ ...(style || {}), minWidth: width }}
                {...rest}
            >
                <div className={classes.curLabel}>{curItem ? curItem.label : placeholder}</div>
                <div className={classes.icon}>
                    <fluentIcon.ChevronDownIcon />
                </div>
            </div>
            <Callout
                directionalHint="bottomLeft"
                isBeakHidden
                hidden={hide}
                target={rootEle}
                style={{ padding: 0, boxShadow: "none", minWidth: width || 150 }}
                gapSpace={1}
                noAutoAdjust
                onDismissEvent={(event, type, isTarget) => {
                    if (!isTarget) {
                        setHide(true);
                    }
                }}
            >
                <ul className={classes.menu} style={menuStyle}>
                    {list.map(function (item) {
                        return (
                            <li
                                key={item.key}
                                onClick={() => {
                                    setHide(true);
                                    if (item.key !== selecedKey) {
                                        onChange && onChange(item);
                                    }
                                }}
                                className={item.key === selecedKey ? classes.menuCurItem : null}
                            >
                                {item.label}
                            </li>
                        );
                    })}
                </ul>
            </Callout>
        </React.Fragment>
    );
}
