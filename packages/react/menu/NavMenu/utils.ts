import { jss } from "../../common/jss";
import { TreeNestMap } from "@gland/function/TreeNestMap";

export interface NavMenuProps extends React.HTMLAttributes<HTMLDivElement> {
    selectedKey?: string;
    list: Array<ListItem>;
    map: TreeNestMap;
    paddingLeft?: number;
    handleSelect?;
    isDisableDrag?: boolean;
    isFreeDrop?: boolean;
    stopDrag?: boolean;
    handleDrop?;
    handleContextMenu?;
}

export interface ListItem {
    name: string;
    key: string;
    isGroupNode?: boolean;
    defaultOpen?: boolean;
    children?: Array<ListItem>;
}

export interface TreeProps {
    list: Array<ListItem>;
    level: number;
}

export interface TreeLeafProps {
    item: ListItem;
    level: number;
}

export interface TreeGroupProps {
    item: ListItem;
    level: number;
}

export const jssStyle = jss.createStyleSheet({
    root: {
        minWidth: 208,
        boxSizing: "border-box",
        fontSize: 16,
        overflow: "hidden",
    },
    treeRoot: {
        paddingBottom: 20,
    },
    treeItemWrapper: {
        position: "relative",
    },
    treeItem: {
        display: "flex",
        alignItems: "center",
        paddingRight: 10,
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        userSelect: "none",
        borderRadius: 2,
        cursor: "pointer",
        boxSizing: "border-box",
        height: "var(--NavMenuItemHeight, 2.5em)",
        "&:hover": {
            backgroundColor: "rgb(243, 242, 241)",
            color: "rgb(0, 120, 212)",
        },
        "&:active": {
            backgroundColor: "rgb(237, 235, 233)",
            color: "rgb(0, 0, 0)",
        },
    },
    clearTreeItemHover: {
        "& $treeItem": {
            backgroundColor: "unset",
            color: "rgb(50, 49, 48)",
        },
    },
    itemInDrag: {
        opacity: 0.4,
        pointerEvents: "none",
        backgroundColor: "#f3f2f1",
        zIndex: 1000,
    },
    groupInHover: {
        backgroundColor: "rgb(243, 242, 241)",
    },
    itemDropLine: {
        position: "absolute",
        right: 0,
        left: 0,
        height: 2,
        backgroundColor: "#107c10",
        opacity: 1,
        pointerEvents: "none",
    },
    selectedItem: {
        backgroundColor: "rgb(237, 235, 233)",
        color: "rgb(0, 120, 212) !important",
        fontWeight: 600,
        "&:after": {
            borderRight: "2px solid rgb(0, 120, 212)",
            content: "' '",
            position: "absolute",
            pointerEvents: "none",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        },
    },
    openIcon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "1.857em",
        "& svg": {
            width: "0.857em",
            height: "0.857em",
        },
    },
    treeGroupChild: {
        overflow: "hidden",
    },
});

export const classes = jssStyle.classes;

export const paddingInc = 1.857;

export const rootKey = `$drag#root$(${Math.random()})$drag#root$`;
