import React from "react";
import { SnackbarProvider, useSnackbar, OptionsObject } from "notistack";

import { jss } from "../../common/jss";
import { fluentIcon } from "../../common/asset";
import { FabricButton } from "../../button/FabricButton";

interface SnackMessageProps {
    type: "success" | "error" | "info" | "warn";
    title: string | any;
    body?: string | number | JSX.Element;
    id?: any;
}

const jssSheet = jss.createStyleSheet({
    root: {
        minWidth: 320,
        maxWidth: 400,
        fontSize: 16,
        padding: "12px",
        boxShadow: "0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08), 0 9px 28px 8px rgba(0,0,0,.05)",
        background: "white",
        borderRadius: 2,
    },
    head: {
        lineHeight: 1,
        display: "flex",
        justifyContent: "space-between",
    },
    headContent: {
        display: "flex",
        alignItems: "center",
        flexGrow: 1,
    },
    typeIcon: {
        marginRight: 10,
        "& svg": {
            width: 30,
            height: 30,
        },
    },
    closeIcon: {
        flexShrink: 0,
    },
    body: {
        marginLeft: 40,
        marginTop: 5,
        fontSize: 14,
        color: "#323130",
    },
});

const { classes } = jssSheet;

export const SnackMessage = React.forwardRef<any, SnackMessageProps>((props: SnackMessageProps, ref) => {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }
    const { title = null, body = null, type = "info" } = props;

    const { closeSnackbar } = useSnackbar();

    const handleDismiss = () => {
        closeSnackbar(props.id);
    };

    return (
        <div ref={ref} className={classes.root}>
            <div className={classes.head}>
                <div className={classes.headContent}>
                    <div className={classes.typeIcon}>{getIcon(type, "info")}</div>
                    <div className="label" style={{ fontSize: "16px" }}>
                        {title}
                    </div>
                </div>
                <div className={classes.closeIcon}>
                    <FabricButton variant="icon" onClick={handleDismiss}>
                        <fluentIcon.ClearIcon />
                    </FabricButton>
                </div>
            </div>
            {body ? <div className={classes.body}>{body}</div> : null}
        </div>
    );
});

function getIcon(type, defaultType?) {
    const tempType = type || defaultType;

    switch (tempType) {
        case "warn":
            return <fluentIcon.WarningIcon style={{ fill: "#ff8c00" }} />;
        case "info":
            return <fluentIcon.InfoIcon style={{ fill: "#005a9e" }} />;
        case "error":
            return <fluentIcon.ErrorBadgeIcon style={{ fill: "#d13438" }} />;
        case "success":
            return <fluentIcon.Success style={{ fill: "#107c10" }} />;
    }

    return type;
}
