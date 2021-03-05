import React from "react";
import clsx from "clsx";
import { jss } from "../../common/jss";
import { fluentIcon } from "../../common/asset";
import { FabricButton } from "../../button/FabricButton";

const jssSheet = jss.createStyleSheet({
    root: {
        fontSize: 13,
        fontWeight: 400,
        outline: "transparent",
        position: "relative",
        boxSizing: "content-box",
        flexShrink: 1,
        margin: 2,
        height: 26,
        lineHeight: "26px",
        cursor: "default",
        display: "flex",
        flexWrap: "nowrap",
        maxWidth: "300px",
        minWidth: "0px",
        borderRadius: "2px",
        color: "rgb(50, 49, 48)",
        background: "rgb(243, 242, 241)",
        userSelect: "none",
    },
    small: {
        height: 20,
        lineHeight: "20px",
        margin: "0 2px",
    },
    btn: {
        backgroundColor: "transparent",
        width: 20,
        fontSize: 12,
        height: "100%",
        "&:hover": {
            backgroundColor: "rgb(225, 223, 221)",
        },
        "&:active": {
            backgroundColor: "#edebe9",
        },
    },
    selected: {
        backgroundColor: "rgb(0, 120, 212)",
        color: "rgb(255,255,255)",
        "& $btn:hover": {
            backgroundColor: "rgb(0, 90, 158)",
        },
        "&:active": {
            backgroundColor: "rgb(0, 90, 158)",
        },
    },
    span: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        minWidth: "30px",
        margin: "0px 4px",
    },
});
const classes = jssSheet.classes;

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
    small?: boolean;
    selected?: boolean;
    closeable?: boolean;
    onRemoveItem?: (event) => void;
}

export function Tag(props: TagProps) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }

    const { selected, closeable, onRemoveItem, children, className, small, ...rest } = props;

    return (
        <div className={clsx(classes.root, small ? classes.small : null, selected ? classes.selected : null, className)} {...rest}>
            <span className={classes.span}>{children}</span>
            {closeable ? (
                <FabricButton
                    variant="icon"
                    className={classes.btn}
                    onClick={(event: Event) => {
                        event.stopPropagation();
                        onRemoveItem && onRemoveItem(event);
                    }}
                >
                    <fluentIcon.ClearIcon style={{ fill: selected ? "white" : "rgb(50, 49, 48)", width: 8, height: 8 }} />
                </FabricButton>
            ) : null}
        </div>
    );
}
