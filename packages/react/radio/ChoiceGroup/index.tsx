import React from "react";
import clsx from "clsx";
import { jss } from "../../common/jss";

const jssSheet = jss.createStyleSheet({
    root: {},
    radio_b_wrapper: {
        "&:not(:first-child)": {
            marginTop: 8,
        },
    },
    radio_ib_wrapper: {
        display: "inline-block",
        "&:not(:first-child)": {
            marginLeft: 10,
        },
    },
    radio: {
        display: "inline-block",
        cursor: "pointer",
        marginTop: "0px",
        position: "relative",
        verticalAlign: "top",
        minHeight: "20px",
        userSelect: "none",

        "&:before": {
            content: '""',
            display: "inline-block",
            backgroundColor: "rgb(255, 255, 255)",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "rgb(50, 49, 48)",
            width: "20px",
            height: "20px",
            fontWeight: "normal",
            position: "absolute",
            top: "0px",
            left: "0px",
            boxSizing: "border-box",
            transitionProperty: "border-color",
            transitionDuration: "200ms",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.23, 1)",
            borderRadius: "50%",
        },
        "&:after": {
            content: '""',
            width: "0px",
            height: "0px",
            borderRadius: "50%",
            position: "absolute",
            left: "10px",
            right: "0px",
            transitionProperty: "border-width",
            transitionDuration: "200ms",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.23, 1)",
            boxSizing: "border-box",
        },
    },
    radio_default: {
        "&:hover": {
            "&:before": {
                borderColor: "rgb(50, 49, 48)",
            },
            "&:after": {
                transitionProperty: "background-color",
                left: "5px",
                top: "5px",
                width: "10px",
                height: "10px",
                backgroundColor: "rgb(96, 94, 92)",
            },
        },
    },
    radio_selected: {
        "&:before": {
            borderColor: "rgb(0, 120, 212)",
        },
        "&:after": {
            width: "10px",
            height: "10px",
            left: "5px",
            borderWidth: "5px",
            borderStyle: "solid",
            borderColor: "rgb(0, 120, 212)",
            top: "5px",
        },
        "&:hover": {
            "&:before": {
                borderColor: "rgb(0, 90, 158)",
            },
            "&:after": {
                borderColor: "rgb(0, 90, 158)",
            },
        },
    },
    text: {
        display: "inline-block",
        paddingLeft: 26,
    },
});
const classes = jssSheet.classes;

interface ChoiceGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    options: Array<{ key: string | number; text: string | number | JSX.Element }>;
    selectedKey?: string | number;
    isRadioBlock?: boolean;
    onChange?: (item) => any;
}

export function ChoiceGroup(props: ChoiceGroupProps) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }

    const { options, selectedKey, className, onChange, ...rest } = props;

    const rcls = clsx(classes.root, className);

    return (
        <div className={rcls} {...rest}>
            {options.map(function (item) {
                const cls = clsx(
                    classes.radio,
                    (selectedKey || selectedKey === 0) && item.key === selectedKey ? classes.radio_selected : classes.radio_default
                );

                return (
                    <div key={item.key} className={props.isRadioBlock ? classes.radio_b_wrapper : classes.radio_ib_wrapper}>
                        <div
                            className={cls}
                            onClick={(event) => {
                                if (selectedKey !== item.key) {
                                    onChange && onChange(item);
                                }
                            }}
                        >
                            <span className={classes.text}>{item.text}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
