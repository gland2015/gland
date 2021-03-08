import React from "react";
import clsx from "clsx";
import { jss } from "../../common/jss";
import { fluentIcon } from "../../common/asset";

const { classes } = jss
    .createStyleSheet({
        root: {
            "--themePrimary": "var(--glSrhThemePrimary, #0078d4)",
            "--neutralPrimary": "var(--glSrhNeutralPrimary, #323130)",
            "--neutralSecondary": "var(--glSrhNeutralSecondary, #605e5c)",
            "--neutralWhite": "var(--glSrhNeutralWhite, #ffffff)",
            "--neutralLighter": "var(--glSrhNeutralLighter, #f3f2f1)",
            display: "flex",
            alignItems: "stretch",
            border: "1px solid var(--neutralSecondary)",
            boxShadow: "none",
            margin: 0,
            width: "100%",
            padding: "0 0 0 0.2em",
            boxSizing: "border-box",
            borderRadius: 2,
            background: "var(--neutralWhite)",
            cursor: "text",
            flexDirection: "row",
            position: "relative",
            transition: "padding,width 0.167s ease 0s",
            "& input": {
                margin: 0,
                boxShadow: "none",
                height: "2em",
                border: "none",
                outline: 0,
                flexShrink: 1,
                fontSize: "0.875em",
                borderRadius: 0,
                padding: 0,
                background: "none transparent",
                boxSizing: "border-box",
                width: "100%",
                color: "var(--neutralPrimary)",
            },
            "& .prefix,.suffix": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "1.8em",
                flexShrink: 0,
                "& .content": {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                },
            },
            "& .prefix": {
                transition: "width 0.167s ease 0s",
                "& .content": {
                    width: "1em",
                    height: "1em",
                },
                "& svg": {
                    width: "1em",
                    height: "1em",
                    fill: "currentcolor",
                },
            },
            "& .suffix": {
                cursor: "pointer",
                "& .content": {
                    width: "0.7em",
                    height: "0.7em",
                },
            },
            "& .suffix:hover": {
                backgroundColor: "var(--neutralLighter)",
                "& svg": {
                    fill: "var(--themePrimary)",
                },
            },
        },
        focus: {
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
        underlined: {
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            "&:after": {
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
            },
        },
        focus_hideSrh: {
            padding: "0 0 0 0.5em",
            "& .prefix": {
                width: 0,
            },
        },
        focus_grow: {
            width: "150%",
        },
        noHideSrh: {
            "& .prefix": {
                cursor: "pointer",
            },
            "& .prefix:hover": {
                backgroundColor: "var(--neutralLighter)",
                "& svg": {
                    fill: "var(--themePrimary)",
                },
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
    } else if (action?.type === "value") {
        newState = Object.assign({}, state, {
            value: action.payload,
        });
    }
    return newState;
}

function intier(props) {
    return {
        focused: false,
        value: props.value || "",
    };
}

export interface SearchBoxProps {
    name?: string;
    type?: string;
    value?: any;
    style?: React.CSSProperties;
    onChange?: any;
    onSearch?: any;
    disabled?: boolean;

    focusHideSrh?: boolean;
    focusGrow?: boolean;
    className?: string;
    underlined?: boolean;

    placeholder?: string;
    autoComplete?: "off" | "on";
}

export function SearchBox(props: SearchBoxProps) {
    const [state, dispatch] = React.useReducer(reducer, props, intier);

    let isContral = props.value !== null && props.value !== undefined;
    let hasValue = Boolean(isContral ? (props.value + "").length : state.value.length);
    let rValue = isContral ? props.value : state.value;

    const attr = React.useRef({
        input: null,
    }).current;

    const rootClsName = clsx(
        classes.root,
        state.focused ? [classes.focus, props.focusHideSrh ? classes.focus_hideSrh : null, props.focusGrow ? classes.focus_grow : null] : null,
        props.focusHideSrh ? null : classes.noHideSrh,
        props.underlined ? classes.underlined : null,
        props.className
    );

    return (
        <div className={rootClsName} style={props.style}>
            <div className="prefix" onClick={props.focusHideSrh ? null : handleSrhClick}>
                <div className="content">
                    <fluentIcon.SearchIcon />
                </div>
            </div>
            <input
                ref={(r) => (attr.input = r)}
                type={props.type}
                value={rValue}
                onChange={handleChange}
                onFocus={handleOnFoucs}
                onBlur={handleOnBlur}
                onKeyDown={handleKeyDown}
                placeholder={props.placeholder}
                autoComplete={props.autoComplete}
            />
            {hasValue ? (
                <div className="suffix" onClick={handleClear}>
                    <div className="content">
                        <fluentIcon.ClearIcon />
                    </div>
                </div>
            ) : null}
        </div>
    );

    function handleSrhClick() {
        props.onSearch && props.onSearch(rValue);
    }

    function handleKeyDown(event) {
        if (event.keyCode === 13) {
            props.onSearch && props.onSearch(rValue);
        }
    }

    function handleClear() {
        props.onChange &&
            props.onChange({
                target: {
                    value: "",
                },
            });
        if (!isContral) {
            dispatch({ type: "value", payload: "" });
        }
    }

    function handleChange(event) {
        props.onChange && props.onChange(event);
        if (!isContral) {
            dispatch({ type: "value", payload: event.target.value });
        }
    }

    function handleOnFoucs(event) {
        dispatch({ type: "focused", payload: true });
    }

    function handleOnBlur(event) {
        dispatch({ type: "focused", payload: false });
    }
}
