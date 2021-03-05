import { jss } from "@gland/react/common/jss";
import clsx from "clsx";

export function attachStyle() {
    if (!toolJssSheet.attached) {
        toolJssSheet.attach();
    }
}

const toolJssSheet = jss.createStyleSheet({
    root: {
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        color: "#605e5c",
        fontSize: 16,
        height: 40,
        padding: 2,
        borderBottom: "1px solid #e1dfdd",
        userSelect: "none",
    },
    verLine: {
        width: 1,
        height: 20,
        margin: "0 5px",
        backgroundColor: "#c8c6c4",
        display: "inline-block",
    },
    tip: {
        color: "white",
        padding: "0 5px",
        backgroundColor: "#605e5c !important",
        borderRadius: "5px !important",
        fontSize: 14,
    },
    btn: {
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        lineHeight: 1,
        cursor: "pointer",
        fill: "currentcolor",

        position: "relative",
        "&:hover": {
            backgroundColor: "rgb(243, 242, 241)",
            color: "rgb(32, 31, 30)",
        },
        "&:active": {
            backgroundColor: "rgb(237, 235, 233)",
        },
    },
    btn_s: {
        backgroundColor: "rgb(243, 242, 241)",
    },
    btn_normal: {
        padding: "0 8px",
        margin: "2px 1px",
        borderRadius: 3,
        minWidth: 34,
        height: 34,
        "& svg": {
            width: 16,
            height: 16,
        },
    },
    iptLine: {
        display: "flex",
        alignItems: "center",
        minHeight: 50,
    },
    colorSelect: {
        borderRadius: 3,
        display: "inline-flex",
        justifyContent: "space-between",
        alignItems: "stretch",
        boxSizing: "border-box",
        minWidth: 50,
        height: 34,
        margin: "2px 1px",
        border: "1px solid transparent",
        "&:hover": {
            border: "1px solid #e1dfdd",
            "& $cs_body": {
                borderColor: "#e1dfdd",
            },
        },
    },
    colorSelect_focus: {
        border: "1px solid #e1dfdd",
        backgroundColor: "rgb(243, 242, 241)",
        "& $cs_body": {
            borderColor: "#e1dfdd",
        },
    },
    cs_body: {
        fontSize: 0,
        width: 32,
        borderRight: "1px solid transparent",
        "& svg": {
            width: 16,
            height: 16,
        },
    },
    cs_body_bar: {
        height: 3,
        marginTop: 1,
    },
    cs_down: {
        width: 16,
        "& svg": {
            width: 12,
            height: 12,
            fill: "#a19f9d",
        },
    },
    dropBtn: {
        minWidth: 40,
        borderRadius: 3,
        height: 34,
        margin: "2px 1px",
        "& svg": {
            width: 16,
            height: 16,
        },
    },
    dropBtn_body: {
        marginLeft: 3,
    },
    dropBtn_down: {
        width: 12,
        fontSize: 0,
        marginLeft: 2,
        "& svg": {
            width: 10,
            height: 10,
            fill: "#a19f9d",
        },
    },
    dropText: {
        borderRadius: 3,
        height: 34,
        margin: "2px 1px",
        padding: "0 5px",
    },
    dropText_body: {
        minWidth: 20,
        padding: "0 5px",
        textAlign: "left",
        fontSize: 14,
    },
    dropText_down: {
        width: 16,
        fontSize: 0,
        marginLeft: 2,
        "& svg": {
            width: 14,
            height: 14,
            fill: "#a19f9d",
        },
    },

    // color picker
    colorPicker: {},
    sketchPicker: {
        boxShadow: "none !important",
    },
    pickerFooter: {
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 10px 2px 10px",
        userSelect: "none",
    },
    pickerAuto: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #c8c6c4",
        padding: "3px 6px",
        cursor: "pointer",
        borderRadius: 2,
        "&:hover": {
            backgroundColor: "rgb(243, 242, 241)",
            color: "rgb(32, 31, 30)",
        },
        "&:active": {
            backgroundColor: "rgb(237, 235, 233)",
        },
    },
    pickerAutoItem: {
        display: "inline-block",
        width: 40,
        height: 16,
        marginRight: 10,
    },

    // menu
    menu: {
        fontSize: 14,
        backgroundColor: "rgb(255, 255, 255)",
        minWidth: 80,
        maxHeight: 245,
        listStyleType: "none",
        margin: 0,
        padding: 0,
        overflowY: "auto",
        overflowX: "hidden",
        userSelect: "none",
    },
    menuItem: {
        color: "rgb(50, 49, 48)",
        position: "relative",
        width: "100%",
        minHeight: 35,
        boxSizing: "border-box",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "left",
        textAlign: "left",
        padding: "5px 8px 5px 8px",

        "& svg": {
            width: "1.3em",
            height: "1.3em",
            margin: "0 4px",
            fill: "currentcolor",
        },
    },
    menu_cur: {
        color: "white !important",
        backgroundColor: "#71afe5",
        "&:hover": {
            backgroundColor: "#2b88d8",
        },
        "&:active": {
            backgroundColor: "#0078d4",
        },
    },

    // emoji
    emojiSelect: {
        maxWidth: 420,
    },
    emojiItem: {
        borderRadius: 5,
        width: 32,
        height: 32,
        "& img": {
            width: 24,
            height: 24,
        },
    },
    // font effect
    effectSelect: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        fontSize: 20,
    },
    effectSelectItem: {
        width: 100,
        height: 40,
        lineHeight: "40px",
        textAlign: "center",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        cursor: "pointer",
        fill: "currentcolor",
        position: "relative",
        "&:hover": {
            backgroundColor: "rgb(243, 242, 241)",
        },
        "&:active": {
            backgroundColor: "rgb(237, 235, 233)",
        },
    },
    // linkInput
    linkInput: {
        display: "flex",
        alignItems: "center",
        fontSize: 12,
    },
    linkIpt_ipt: {
        fontSize: 14,
        marginRight: 10,
        width: 210,
    },

    // code
    codeSelect: {
        display: "flex",
        alignItems: "center",
        marginBottom: 15,
    },
    modalFooter: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        textAlign: "right",
        paddingRight: 20,
        marginTop: 15,
    },

    // formula
    formulaIpt: {
        "& textarea": {
            minHeight: "70px !important",
        },
    },
    formulaRd: {
        textAlign: "center",
        maxWidth: 510,
        minHeight: 71,
        border: "1px dashed #d2d0ce",
        overflow: "hidden",
        marginTop: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    formulaType: {
        display: "flex",
        alignItems: "center",
        minHeight: 50,
    },
    imageType: {
        display: "flex",
        alignItems: "center",
        marginBottom: 15,
    },
    imageSel: {
        display: "flex",
        alignItems: "center",
    },
    imageName: {
        maxWidth: 200,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
    },

    // public
    label: {
        fontSize: 14,
        fontWeight: 600,
        color: "rgb(50, 49, 48)",
        marginRight: 5,
    },
    smallIpt: {
        width: 80,
        marginLeft: 20,
    },
    twoCol: {
        display: "flex",
        alignItems: "center",
        minHeight: 70,
    },
    twoColItem: {
        width: "50%",
    },
    twoColIpt: {
        width: 100,
    },
    nameshow: {
        maxWidth: 240,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
});

export const toolClasses = toolJssSheet.classes;
export const toolNormalBtn = clsx(toolClasses.btn, toolClasses.btn_normal);
