import React from "react";
import clsx from "clsx";

import { jss } from "../../common/jss";
import { Empty } from "../../common/Empty";
import { Tag } from "../../tag";
import { Divider } from "../../divider";
import { Callout } from "../../popover";
import { Spinner } from "../../spin/Spinner";

const jssSheet = jss.createStyleSheet({
    root: {
        display: "flex",
        position: "relative",
        flexWrap: "nowrap",
        alignItems: "center",
        boxSizing: "border-box",
        border: "1px solid rgb(96, 94, 92)",
        borderRadius: 2,
        minWidth: 150,
    },
    rootBorderless: {
        border: "none",
    },
    rootFocus: {
        "&:after": {
            pointerEvents: "none",
            content: "''",
            position: "absolute",
            top: -1,
            bottom: -1,
            right: -1,
            left: -1,
            border: "2px solid rgb(0, 120, 212)",
            borderRadius: 2,
        },
    },
    tagArea: {
        display: "flex",
        position: "relative",
        flexWrap: "nowrap",
        alignItems: "center",
        overflow: "hidden",
    },
    input: {
        fontSize: 14,
        fontWeight: 400,
        height: "100%",
        border: "none",
        flexGrow: 1,
        outline: "none",
        padding: "0px 6px",
        alignSelf: "flex-end",
        borderRadius: 2,
        backgroundColor: "transparent",
        color: "rgb(50, 49, 48)",
        minWidth: 70,
    },
    menu: {
        fontSize: 14,
        fontWeight: 400,
        backgroundColor: "rgb(255, 255, 255)",
        minWidth: 180,
        listStyleType: "none",
        margin: 0,
        padding: 0,
        boxShadow: "rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px",
        maxHeight: 500,
        overflow: "auto",
    },
    menuItem: {
        fontSize: 14,
        fontWeight: 400,
        color: "rgb(50, 49, 48)",
        position: "relative",
        boxSizing: "border-box",
        width: "100%",
        height: "2.57em",
        lineHeight: "2.57em",
        display: "block",
        cursor: "pointer",
        padding: "0px 8px 0px 8px",
        textAlign: "left",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        "&:hover": {
            backgroundColor: "rgb(243, 242, 241)",
            color: "rgb(32, 31, 30)",
        },
        "&:active": {
            backgroundColor: "rgb(237, 235, 233)",
        },
    },
    menuCurItem: {
        backgroundColor: "rgb(243, 242, 241)",
        "&:hover": {
            backgroundColor: "rgb(237, 235, 233)",
            color: "rgb(32, 31, 30)",
        },
        "&:active": {
            backgroundColor: "rgb(237, 235, 233)",
        },
    },
    menuTitle: {
        padding: "0px 12px",
        fontSize: 12,
        color: "rgb(0, 120, 212)",
        lineHeight: "40px",
        borderBottom: "1px solid rgb(237, 235, 233)",
    },
    menuEmpty: {
        textAlign: "center",
        color: "rgb(96, 94, 92)",
        fontSize: 12,
        lineHeight: "30px",
    },
});

const classes = jssSheet.classes;

export interface TagPickerProps extends React.HTMLAttributes<HTMLOListElement> {
    loading?: boolean;
    smallTag?: boolean;
    borderless?: boolean;
    menuTitle?: string;
    menuEmpty?: string;
    keys?: Array<string | number>;
    onKeysChange?: (keys: Array<string | number>) => any;
    list: Array<{ key: string | number; label: string; value?: string }>;
    itemLimit?: number;
    placeholder?: string;
    handleEntry?: (keys: Array<string | number>) => any;
}

interface State {
    isShowCallout?: boolean;
    isFocus?: boolean;
    keys?: Array<string | number>;
    text?: string;
    curKey?: string | number;
}

function initer(props) {
    return {
        isShowCallout: false,
        isFocus: false,
        text: "",
        keys: [],
    };
}

function reducer(state, action): State {
    let newState = state;

    if (action) {
        const { type, payload } = action;
        if (type === "lossfoucs") {
            newState = Object.assign({}, state, {
                isShowCallout: false,
                isFocus: false,
            });
        } else if (type === "inputFocus") {
            newState = Object.assign({}, state, {
                isShowCallout: true,
                isFocus: true,
            });
        } else if (type === "inputBlur") {
            newState = Object.assign({}, state, {
                isShowCallout: false,
            });
        } else if (type === "textChange") {
            newState = Object.assign({}, state, {
                text: payload,
            });
        } else if (type === "keysChange") {
            newState = Object.assign({}, state, {
                keys: payload,
            });
        } else if (type === "overLimit") {
            newState = Object.assign({}, state, {
                isShowCallout: false,
            });
        }
    }

    return newState;
}

export function TagPicker(props: TagPickerProps) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }
    const RootRef = React.useRef<HTMLDivElement>(null);
    const MenuRef = React.useRef<HTMLDivElement>(null);

    const [inputEle, setInputEle] = React.useState(null);

    const attr = React.useRef({
        state: null as State,
    }).current;

    let { style, className, list, itemLimit, keys, menuTitle, menuEmpty, borderless, smallTag, placeholder, handleEntry, loading } = props;

    const [state, dispatch] = React.useReducer(reducer, props, initer);

    keys = keys || state.keys;

    const data = React.useMemo(() => {
        let l1 = [];
        let l2 = [];

        let map = new Map();

        (list || []).forEach(function (item) {
            if (keys.indexOf(item.key) !== -1) {
                map.set(item.key, item);
            } else {
                l2.push(item);
            }
        });

        l1 = keys.map((k) => map.get(k));

        return { l1, l2 };
    }, [keys, list]);

    const menuList = React.useMemo(() => {
        if (!state.text) return data.l2;
        let reg = new RegExp(state.text, "i");
        return data.l2.filter(function (item) {
            if (item.label && (item.label + "").match(reg)) {
                return true;
            }
        });
    }, [data, state.text]);

    attr.state = state;

    React.useEffect(() => {
        function handleMouseDown(event) {
            if (!attr.state.isFocus) return;
            let target = event.target;

            let include = false;

            if (RootRef.current && RootRef.current.contains(target)) {
                include = true;
            } else if (MenuRef.current && MenuRef.current.contains(target)) {
                include = true;
            }

            if (!include) {
                dispatch({ type: "lossfoucs" });
            }
        }

        document.addEventListener("mousedown", handleMouseDown);

        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
        };
    }, []);

    let overLimit = itemLimit ? keys.length >= itemLimit : false;

    React.useLayoutEffect(() => {
        if (overLimit && state.isShowCallout) {
            dispatch({ type: "overLimit" });
        }
    }, [overLimit]);

    const rCls = clsx(classes.root, state.isFocus && !borderless ? classes.rootFocus : null, borderless ? classes.rootBorderless : null, className);

    return (
        <React.Fragment>
            <div ref={RootRef} className={rCls} style={style}>
                <div className={classes.tagArea}>
                    {data.l1.map(function (item) {
                        return (
                            <Tag
                                key={item.key}
                                closeable
                                small={smallTag}
                                style={{ maxWidth: 120 }}
                                onRemoveItem={() => {
                                    let newKeys = keys.filter((o) => o !== item.key);

                                    if (props.keys) {
                                        props.onKeysChange(newKeys);
                                    } else {
                                        dispatch({
                                            type: "keysChange",
                                            payload: newKeys,
                                        });
                                    }
                                }}
                            >
                                {item.label}
                            </Tag>
                        );
                    })}
                </div>
                {overLimit ? (
                    <div className={classes.input}></div>
                ) : (
                    <input
                        placeholder={placeholder}
                        ref={setInputEle}
                        className={classes.input}
                        value={state.text}
                        onChange={(event) => {
                            dispatch({ type: "textChange", payload: event.target.value });
                        }}
                        onFocus={() => {
                            dispatch({ type: "inputFocus" });
                        }}
                        onBlur={() => {
                            dispatch({ type: "inputBlur" });
                        }}
                        onKeyDown={(event) => {
                            if (event.keyCode === 13) {
                                handleEntry && handleEntry(keys);
                            }
                        }}
                    />
                )}
            </div>
            <Callout
                innerRef={MenuRef}
                directionalHint="bottomLeft"
                isBeakHidden
                hidden={overLimit ? true : !state.isShowCallout}
                target={inputEle}
                style={{ padding: 0, boxShadow: "none" }}
                gapSpace={1}
                noAutoAdjust
                onMouseDown={(event: Event) => {
                    event.preventDefault();
                }}
            >
                <ul className={`smallScroll ${classes.menu}`}>
                    {menuTitle ? (
                        <React.Fragment>
                            <li className={classes.menuTitle}>{menuTitle}</li>
                            <li>
                                <Divider />
                            </li>
                        </React.Fragment>
                    ) : null}
                    {loading ? (
                        <Spinner style={{ minHeight: 100 }} />
                    ) : (
                        <React.Fragment>
                            {menuList.map(function (item) {
                                let clsName = clsx(classes.menuItem, item.key === state.curKey ? classes.menuCurItem : null);

                                return (
                                    <li
                                        key={item.key}
                                        className={clsName}
                                        onClick={() => {
                                            let newKeys = keys.concat(item.key);
                                            if (props.keys) {
                                                props.onKeysChange(newKeys);
                                            } else {
                                                dispatch({
                                                    type: "keysChange",
                                                    payload: newKeys,
                                                });
                                            }
                                        }}
                                    >
                                        {item.label}
                                    </li>
                                );
                            })}
                            {menuList.length ? null : menuEmpty || <Empty />}
                        </React.Fragment>
                    )}
                </ul>
            </Callout>
        </React.Fragment>
    );
}

Empty;
