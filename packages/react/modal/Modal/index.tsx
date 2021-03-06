import React from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";
import { preventDefault } from "@gland/function/preventDefault";

import { jss } from "../../common/jss";
import { fluentIcon } from "../../common/asset";
import { AnimateDiv } from "../../common/Animation";
import { FabricButton } from "../../button/FabricButton";

const transition = `opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)`;

const jssSheet = jss
    .createStyleSheet({
        root: {
            "--neutralPrimary": "var(--glModalNeutralPrimary, #323130)", // rgb(50,49,48)
            "--neutralSecondary": "var(--glModalNeutralSecondary, #605e5c)", // rgb(96,94,92)
            fontSize: 14,
            fontWeight: 400,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            position: "fixed",
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            top: 0,
            left: 0,
            fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
            zIndex: 1,
        },
        wrapper: {
            boxShadow: "rgba(0, 0, 0, 0.22) 0px 25.6px 57.6px 0px, rgba(0, 0, 0, 0.18) 0px 4.8px 14.4px 0px",
            borderRadius: 2,
            backgroundColor: "rgb(255, 255, 255)",
            boxSizing: "border-box",
            position: "relative",
            textAlign: "left",
            outline: "transparent solid 3px",
            // maxHeight: "calc(100% - 32px)",
            // maxWidth: "calc(100% - 32px)",
            minHeight: 176,
            minWidth: 288,
            overflowY: "auto",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            top: "-10%",
        },
        content: {
            color: "var(--neutralSecondary)",
            flexGrow: 1,
        },
        footer: {
            marginTop: 10,
        },
        title: {
            fontSize: 20,
            fontWeight: 600,
            color: "var(--neutralPrimary)",
            margin: 0,
            minHeight: 20,
            paddingBottom: 16,
            lineHeight: "normal",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "90%",
        },
        closeIcon: {
            display: "flex",
            flexFlow: "row nowrap",
            position: "absolute",
            top: 0,
            right: 0,
            padding: "15px 15px 0px 0px",
        },
        enter: {
            opacity: 0,
            "& $wrapper": {
                opacity: 0,
                transform: `scale(0.8)`,
            },
        },
        enterActive: {
            opacity: 1,
            transition,
            "& $wrapper": {
                opacity: 1,
                transform: "none",
                transition,
            },
        },
        appear: {
            opacity: 0,
            "& $wrapper": {
                opacity: 0,
                transform: `scale(0.8)`,
            },
        },
        appearActive: {
            opacity: 1,
            transition,
            "& $wrapper": {
                opacity: 1,
                transform: "none",
                transition,
            },
        },
        exit: {
            opacity: 1,
            "& $wrapper": {
                opacity: 1,
            },
        },
        exitActive: {
            opacity: 0,
            transition,
            "& $wrapper": {
                opacity: 0,
                transform: "scale(0.8)",
                transition,
            },
        },
    })
    .attach();

const classes = jssSheet.classes;

const slideDownSheet = jss.createStyleSheet({
    enter: {
        [`& .${classes.wrapper}`]: {
            transform: `translateY(-40px)`,
        },
    },
    enterActive: {
        transition,
        [`& .${classes.wrapper}`]: {
            transform: "none",
            transition,
        },
    },
    appear: {
        [`& .${classes.wrapper}`]: {
            transform: `translateY(-40px)`,
        },
    },
    appearActive: {
        transition,
        [`& .${classes.wrapper}`]: {
            transform: `none`,
            transition,
        },
    },
    exit: {
        opacity: 1,
        [`& .${classes.wrapper}`]: {
            opacity: 1,
        },
    },
    exitActive: {
        opacity: 0,
        transition,
        [`& .${classes.wrapper}`]: {
            opacity: 0,
            transform: "scale(0.8)",
            transition,
        },
    },
});

export interface ModalProps {
    style?: React.CSSProperties;
    className?: string;
    children?: any;

    isOpen?: boolean;
    title?: string | number | React.ReactNode;
    footer?: string | number | React.ReactNode;
    noShowClose?: boolean;
    noMaskClose?: boolean;
    animation?: "slideDown" | "default";
    onDismiss?: (event: Event, from: "icon" | "layer") => any;
    onDismissCompleted?: () => any;
}

interface ModalObj {
    (props: ModalProps): JSX.Element;
}

export const Modal: ModalObj & ModalStaticFunctions = function (props: ModalProps) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }
    if (!slideDownSheet.attached) {
        slideDownSheet.attach();
    }

    const attr = React.useRef({
        root: null,
        openTime: 0,
    }).current;

    React.useMemo(() => {
        if (props.isOpen) {
            attr.openTime = Date.now();
        }
    }, [props.isOpen]);

    return (
        <AnimateDiv
            in={props.isOpen}
            className={classes.root}
            classNames={props.animation === "slideDown" ? slideDownSheet.classes : classes}
            timeout={300}
            appear
            unmountOnExit
            onExited={props.onDismissCompleted}
            divProps={{
                ref: (r) => (attr.root = r),
                onClick(event) {
                    if (props.noMaskClose) return;
                    if (event.target === attr.root) {
                        if (Date.now() - attr.openTime < 500) {
                            return;
                        }
                        props.onDismiss && props.onDismiss(event, "layer");
                    }
                },
            }}
        >
            <div className={clsx(classes.wrapper, props.className)} style={props.style}>
                {props.title ? <div className={classes.title}>{props.title}</div> : null}
                {props.noShowClose ? null : (
                    <div className={classes.closeIcon}>
                        <FabricButton
                            variant="icon"
                            style={{ width: "2em" }}
                            onClick={(event) => {
                                props.onDismiss && props.onDismiss(event, "icon");
                            }}
                            onMouseDown={preventDefault}
                        >
                            <fluentIcon.ClearIcon />
                        </FabricButton>
                    </div>
                )}
                <div className={classes.content}>{props.children}</div>
                {props.footer ? <div className={classes.footer}>{props.footer}</div> : null}
            </div>
        </AnimateDiv>
    );
} as any;

interface Config {
    style?: React.CSSProperties;
    className?: string;

    title?: string;
    icon?: "confirm" | "warn" | "info" | "error" | "success" | JSX.Element;
    description?: string;

    noShowOk?: boolean;
    noShowCancel?: boolean;
    noMaskClose?: boolean;
    animation?: "slideDown" | "default";
    footer?: any;
    okText?: string;
    cancelText?: string;

    onCancel?(type: "dismiss" | "cancel", type1?: any): boolean | any;
    onOk?(): boolean | any;
}

interface ModalStaticFunctions {
    confirm(config: Config): { close(type): any };
    warn(config: Config): { close(type): any };
    info(config: Config): { close(type: any) };
    error(config: Config): { close(type: any) };
    success(config: Config): { close(type: any) };
}

Modal["confirm"] = function (config) {
    return showInOtherTree({
        ...config,
        icon: getIcon(config.icon, "confirm"),
        noMaskClose: config.noMaskClose === undefined ? false : config.noMaskClose,
    });
};

Modal["warn"] = function (config) {
    return showInOtherTree({
        ...config,
        icon: getIcon(config.icon, "warn"),
        noMaskClose: config.noMaskClose === undefined ? false : config.noMaskClose,
    });
};

Modal["info"] = function (config) {
    return showInOtherTree({
        ...config,
        icon: getIcon(config.icon, "info"),
        noMaskClose: config.noMaskClose === undefined ? true : config.noMaskClose,
    });
};

Modal["error"] = function (config) {
    return showInOtherTree({
        ...config,
        icon: getIcon(config.icon, "error"),
        noMaskClose: config.noMaskClose === undefined ? false : config.noMaskClose,
    });
};

Modal["success"] = function (config) {
    return showInOtherTree({
        ...config,
        icon: getIcon(config.icon, "success"),
        noMaskClose: config.noMaskClose === undefined ? true : config.noMaskClose,
    });
};

function getIcon(type, defaultType?) {
    const tempType = type || defaultType;

    switch (tempType) {
        case "confirm":
            return <fluentIcon.InfoIcon style={{ width: 30, height: 30, fill: "#ea4300" }} />;
        case "warn":
            return <fluentIcon.WarningIcon style={{ width: 30, height: 30, fill: "#ff8c00" }} />;
        case "info":
            return <fluentIcon.InfoIcon style={{ width: 30, height: 30, fill: "#005a9e" }} />;
        case "error":
            return <fluentIcon.ErrorBadgeIcon style={{ width: 30, height: 30, fill: "#d13438" }} />;
        case "success":
            return <fluentIcon.Success style={{ width: 30, height: 30, fill: "#107c10" }} />;
    }

    return type;
}

function showInOtherTree(config: Config) {
    const div = document.createElement("div");
    document.body.appendChild(div);

    let close;

    function Comp() {
        const [isOpen, setIsOpen] = React.useState(true);

        close = function () {
            setIsOpen(false);
        };

        return (
            <Modal
                style={config.style}
                className={config.className}
                noMaskClose={config.noMaskClose}
                animation={config.animation}
                isOpen={isOpen}
                title={
                    <div style={{ display: "flex" }}>
                        {config.icon ? <div style={{ marginRight: 10 }}>{config.icon}</div> : null}
                        <div>{config.title}</div>
                    </div>
                }
                onDismiss={(event, type) => {
                    if (config.onCancel && config.onCancel("dismiss") === false) {
                        return;
                    }
                    close();
                }}
                onDismissCompleted={destroy}
                footer={
                    config.footer ? (
                        config.footer
                    ) : config.footer === null ? null : (
                        <div style={{ textAlign: "right" }}>
                            {config.noShowOk ? null : (
                                <FabricButton
                                    onMouseDown={preventDefault}
                                    color="primary"
                                    onClick={() => {
                                        if (config.onOk && config.onOk() === false) {
                                            return;
                                        }
                                        close();
                                    }}
                                >
                                    {config.okText || "确定"}
                                </FabricButton>
                            )}
                            {config.noShowCancel ? null : (
                                <FabricButton
                                    onMouseDown={preventDefault}
                                    style={{ marginLeft: 20 }}
                                    onClick={() => {
                                        if (config.onCancel && config.onCancel("cancel") === false) {
                                            return;
                                        }
                                        close();
                                    }}
                                >
                                    {config.cancelText || "取消"}
                                </FabricButton>
                            )}
                        </div>
                    )
                }
            >
                <div style={{ marginLeft: config.icon ? 40 : null }}>{config.description}</div>
            </Modal>
        );
    }

    render();

    return {
        close() {
            close();
        },
    };

    function render() {
        setTimeout(() => {
            ReactDOM.render(<Comp />, div);
        });
    }

    function destroy() {
        ReactDOM.unmountComponentAtNode(div);
        div.parentNode.removeChild(div);
    }
}
