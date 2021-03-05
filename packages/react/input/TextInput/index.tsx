import React from "react";
import clsx from "clsx";
import { jss } from "../../common/jss";

import { fluentIcon } from "../../common/asset";
import { FixedIcon } from "./fixIcon";

export * from "./fixIcon";

const { classes } = jss
    .createStyleSheet({
        root: {
            "--themePrimary": "var(--glInputThemePrimary, #0078d4)",
            "--neutralPrimary": "var(--glInputNeutralPrimary, #323130)",
            "--neutralSecondary": "var(--glInputNeutralSecondary, #605e5c)",
            "--neutralLighter": "var(--glInputNeutralLighter, #f3f2f1)",
            "--neutralWhite": "var(--glInputNeutralWhite, #ffffff)",
            "--neutralTertiary": "var(--glInputNeutralTertiary, #a19f9d)",
            "--accentRedDark": "var(--glInputAccentRedDark, #a4262c)",
            "& .inputWrapper": {
                display: "flex",
                alignItems: "stretch",
                border: "1px solid var(--neutralSecondary)",
                boxShadow: "none",
                margin: 0,
                padding: 0,
                boxSizing: "border-box",
                borderRadius: 2,
                background: "var(--neutralWhite)",
                cursor: "text",
                flexDirection: "row",
                position: "relative",
                "& input,textarea": {
                    margin: 0,
                    boxShadow: "none",
                    height: "2em",
                    border: "none",
                    outline: 0,
                    fontSize: "0.875em",
                    borderRadius: 0,
                    background: "none transparent",
                    padding: "0 0.5em",
                    boxSizing: "border-box",
                    width: "100%",
                    color: "var(--neutralPrimary)",
                },
                "& textarea": {
                    height: "auto",
                    padding: "0.375em 0.5em",
                    minHeight: "4.2857em",
                },
            },
            "& .inputLabel": {
                fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                fontWeight: 600,
                color: "var(--neutralPrimary)",
                boxSizing: "border-box",
                boxShadow: "none",
                fontSize: "0.875em",
                margin: 0,
                display: "block",
                padding: "0.3125em 0px",
                overflowWrap: "break-word",
                whiteSpace: "nowrap",
            },
            "& .inputErrorMessage": {
                color: "var(--accentRedDark)",
            },
        },
        focus: {
            "& .inputWrapper": {
                border: "1px solid var(--themePrimary)",
                "&:after": {
                    content: "' '",
                    pointerEvents: "none",
                    position: "absolute",
                    left: -1,
                    top: -1,
                    bottom: -1,
                    right: -1,
                    border: "2px solid var(--themePrimary)",
                    borderRadius: 2,
                },
            },
        },
        underlined: {
            "& .inputWrapper": {
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                "&:after": {
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                },
            },
            "& .inputLabel": {
                paddingLeft: "0.5em",
            },
        },
        borderless: {
            "& .inputWrapper": {
                border: "none",
                "&:after": {
                    border: "none",
                },
            },
        },
        disabled: {
            "& .inputWrapper": {
                border: "none var(--neutralLighter)",
                background: "none var(--neutralLighter)",
                "& input": {
                    color: "var(--neutralTertiary)",
                },
            },
        },
        errorMessage: {
            "--themePrimary": "var(--accentRedDark)",
            "--neutralSecondary": "var(--accentRedDark)",
            "& .inputErrorMessage": {
                fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                paddingTop: 5,
                fontSize: "0.75em",
                color: "var(--accentRedDark)",
            },
        },
        redEleFix: {
            pointerEvents: "unset",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "var(--neutralLighter)",
            },
            "& svg": {
                fill: "var(--themePrimary)",
            },
        },
        noResize: {
            "& textarea": {
                resize: "none",
            },
        },
    })
    .attach();

function reducer(state, action) {
    let newState = state;
    if (action?.type === "focused") {
        newState = Object.assign({}, state, {
            focused: action.payload,
        });
    } else if (action?.type === "showPwd") {
        newState = Object.assign({}, state, {
            showPwd: action.payload,
        });
    }
    return newState;
}

function intier(props) {
    return {
        focused: false,
        showPwd: false,
    };
}

export interface TextInputProps {
    name?: string;
    type?: string;
    value?: any;
    style?: React.CSSProperties;
    onChange?: any;
    onBlur?: any;
    onFocus?: any;
    disabled?: boolean;
    autoFocus?: boolean;
    forceAutoFocus?: boolean;
    className?: string;
    underlined?: boolean;
    borderless?: boolean;

    label?: string | number | React.ReactNode;
    errorMessage?: string | number | React.ReactNode;
    onEntry?;

    Prefix?: React.ComponentType<any>;
    Suffix?: React.ComponentType<any>;

    multiline?: boolean;
    canRevealPassword?: boolean;
    defaultValue?: any;
    readOnly?: boolean;
    placeholder?: string;
    autoAdjustHeight?: boolean;
    resizable?: boolean;
    autoComplete?: "off" | "on";
    // [key: string]: any;
}

export function TextInput(props: TextInputProps) {
    const [state, dispatch] = React.useReducer(reducer, props, intier);

    const attr = React.useRef({
        input: null,
        lastClick: null,
    }).current;

    const rootName = clsx(
        classes.root,
        state.focused ? classes.focus : null,
        props.underlined ? classes.underlined : null,
        props.borderless ? classes.borderless : null,
        props.disabled ? classes.disabled : null,
        props.resizable === false ? classes.noResize : null,
        props.className,
        props.errorMessage ? classes.errorMessage : null
    );

    React.useEffect(() => {
        if (props.forceAutoFocus) {
            setTimeout(() => {
                attr.input.focus();
            }, 0);
        }
    }, []);

    return (
        <div className={rootName} style={props.style}>
            {props.label && !props.underlined ? (
                <div className="inputLabel" onClick={handleLabelClick}>
                    {props.label}
                </div>
            ) : null}
            <div className="inputWrapper">
                {props.label && props.underlined ? (
                    <div className="inputLabel" onClick={handleLabelClick}>
                        {props.label}
                    </div>
                ) : null}
                {props.Prefix ? <props.Prefix input={attr.input} focused={state.focused} value={props.value} /> : null}
                {props.multiline ? (
                    <textarea
                        autoFocus={props.autoFocus}
                        ref={(r) => {
                            attr.input = r;

                            if (r && props.autoAdjustHeight) {
                                let h = r.scrollHeight + "px";
                                if (r.style.height !== h) {
                                    r.style.height = h;
                                }
                            }
                        }}
                        name={props.name}
                        onFocus={handleOnFoucs}
                        onBlur={handleOnBlur}
                        placeholder={props.placeholder}
                        autoComplete={props.autoComplete || "off"}
                        value={props.value}
                        onChange={(event) => {
                            props.onChange && props.onChange(event);
                            if (props.autoAdjustHeight) {
                                attr.input.style.height = "";
                                attr.input.style.height = attr.input.scrollHeight + "px";
                            }
                        }}
                        onKeyDown={handleKeyDown}
                        defaultValue={props.defaultValue}
                        readOnly={props.readOnly}
                        disabled={props.disabled}
                    ></textarea>
                ) : (
                    <input
                        autoFocus={props.autoFocus}
                        ref={(r) => (attr.input = r)}
                        name={props.name}
                        onFocus={handleOnFoucs}
                        onBlur={handleOnBlur}
                        type={props.type === "password" && state.showPwd ? "text" : props.type}
                        placeholder={props.placeholder}
                        autoComplete={props.autoComplete || "off"}
                        value={props.value}
                        onChange={props.onChange}
                        defaultValue={props.defaultValue}
                        readOnly={props.readOnly}
                        onKeyDown={handleKeyDown}
                        disabled={props.disabled}
                    />
                )}

                {props.canRevealPassword && props.type === "password"
                    ? React.createElement(
                          FixedIcon(state.showPwd ? <fluentIcon.HideIcon /> : <fluentIcon.RedEyeIcon />, {
                              onMouseDown(event: Event) {
                                  event.stopPropagation();
                                  event.preventDefault();
                                  dispatch({ type: "showPwd", payload: !state.showPwd });
                              },
                              className: classes.redEleFix,
                          })
                      )
                    : null}
                {props.Suffix ? <props.Suffix input={attr.input} focused={state.focused} value={props.value} /> : null}
            </div>
            {props.errorMessage ? <div className="inputErrorMessage">{props.errorMessage}</div> : null}
        </div>
    );

    function handleOnFoucs(event) {
        dispatch({ type: "focused", payload: true });
        props.onFocus && props.onFocus(event);
    }

    function handleOnBlur(event) {
        dispatch({ type: "focused", payload: false });
        props.onBlur && props.onBlur(event);
    }

    function handleKeyDown(event) {
        if (event.keyCode === 13) {
            props.onEntry && props.onEntry(event.target.value, event);
        }
    }

    function handleLabelClick(event) {
        let t = Date.now();
        let lastClick = attr.lastClick;

        if (!lastClick || t - lastClick > 400) {
            attr.input.focus();
        }
        attr.lastClick = t;
    }
}
