import { jss } from "@gland/react/common/jss";

const richJssSheet = jss.createStyleSheet({
    // basic
    root: {
        fontSize: 16,
        "& $h1,$h2,$h3,$h4": {
            margin: "0.3em 0",
        },
        "& .public-DraftEditor-content": {
            padding: 10,
        },
    },
    div: {
        color: "#222",
        wordBreak: "break-word",
    },
    h1: {
        color: "#2E2E2E",
        wordBreak: "break-word",
        fontSize: "1.75em",
    },
    h2: {
        color: "#2E2E2E",
        wordBreak: "break-word",
        fontSize: "1.5em",
    },
    h3: {
        color: "#2E2E2E",
        wordBreak: "break-word",
        fontSize: "1.17em",
    },
    h4: {
        color: "#2E2E2E",
        wordBreak: "break-word",
        fontSize: "1em",
    },
    blockquote: {
        display: "block",
        padding: "16px 16px 16px 16px",
        margin: "10px",
        borderLeft: "8px solid #dddfe4",
        background: "#eef0f4",
        overflow: "auto",
        overflowScrolling: "touch",
        wordWrap: "normal",
        wordBreak: "break-word",
    },
    listol: {
        margin: "0 0 0 25px",
        padding: 0,
    },
    listol_item: {
        margin: "4px 0",
        "&[data-subwrapper=true]": {
            listStyle: "none",
        },
    },
    listul: {
        margin: "0 0 0 25px",
        padding: 0,
    },
    listul_item: {
        margin: "4px 0",
        "&[data-subwrapper=true]": {
            listStyle: "none",
        },
    },

    // entity
    emoticon: {
        maxWidth: "1.3em",
        maxHeight: "1.3em",
        verticalAlign: "text-bottom",
        padding: "0 1px",
    },
    link: {
        color: "#0078d4",
        outline: "none",
        borderBottom: "1px solid transparent",
        userSelect: "text",
        font: "inherit",
        "&:hover": {
            color: "#004578",
            textDecoration: "underline",
        },
    },
    linkBar: {
        display: "flex",
        alignItems: "center",
        fontSize: 14,
        color: "#3b3a39",
    },
    linkBarA: {
        maxWidth: 180,
        minWidth: 100,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        color: "inherit !important",
    },
    linBtn: {
        marginLeft: 6,
        padding: "3px 5px",
        cursor: "pointer",
        borderRadius: 2,
        "& svg": {
            width: 14,
            height: 14,
            fill: "currentcolor",
        },
        "&:hover": {
            backgroundColor: "rgb(243, 242, 241)",
        },
        "&:active": {
            backgroundColor: "rgb(237, 235, 233)",
        },
    },

    // nonText block
    nonTextBlock: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        borderRadius: 3,
        border: "1px solid transparent",
        margin: "7px 20px",
        padding: "8px 8px",
        minHeight: 20,
        minWidth: 20,
        position: "relative",
        maxWidth: "100%",
        maxHeight: 800,
        overflow: "auto",
    },
    notSelect: {
        pointerEvents: "none",
        userSelect: "none",
    },
    blockTitle: {
        textAlign: "center",
        padding: "5px 10px",
        wordBreak: "break-word",
        maxHeight: 100,
        overflow: "auto",
        margin: "auto",
        color: "#323130",
    },
    iframeEle: {
        minWidth: 150,
        minHeight: 150,
        maxWidth: "100%",
        maxHeight: 700,
        overflow: "auto",
        border: "none",
        margin: 0,
        padding: 0,
    },
    code: {
        maxHeight: "unset",
    },
    codeContent: {
        position: "relative",
        overflow: "auto",
        width: "100%",
        "&>pre": {
            margin: "0 !important",
        },
    },
    inlineFormula: {
        position: "relative",
        minHeight: "1em",
        minWidth: "1.3em",
        display: "inline-block",
        textAlign: "center",
        padding: "0 2px",
    },

    horizontalRule: {
        minHeight: 0,
    },
    horizontalLine: {
        display: "block",
        height: 1,
        backgroundColor: "rgb(237, 235, 233)",
        position: "relative",
        width: "100%",
    },
    imageContent: {
        maxWidth: "100%",
        maxHeight: 700,
    },
    inlineImage: {
        position: "relative",
        minHeight: "1em",
        minWidth: "1.3em",
        display: "inline-block",
        textAlign: "center",
        padding: "0 2px",
        "& img": {
            maxWidth: 200,
            maxHeight: 200,
        },
    },
    audioContent: {
        minWidth: 100,
    },
    fileContent: {
        display: "flex",
        backgroundColor: "#f3f2f1",
        borderRadius: 3,
        textAlign: "left",
        padding: 10,
        "&:active": {
            backgroundColor: "#edebe9",
        },
    },
    fileIcon: {
        padding: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& svg": {
            width: 30,
            height: 30,
            fill: "#303132",
        },
    },
    fileBody: {
        width: 245,
    },
    fileTitle: {
        height: 38,
        width: "100%",
        overflow: "hidden",
        wordBreak: "break-word",
        fontSize: 14,
        color: "#3b3a39",
    },
    fileFooter: {
        fontSize: 12,
        color: "#a19f9d",
        lineHeight: "20px",
        height: "20px",
        width: "100%",
        overflow: "hidden",
        wordBreak: "break-word",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
    },
    comment: {
        padding: "0 3px",
        display: "inline-block",
        cursor: "pointer",
        borderRadius: 2,
        "& svg": {
            width: "1em",
            height: "1em",
            fill: "currentcolor",
            verticalAlign: "text-bottom",
        },
    },
    comment_edit: {
        "&:hover": {
            backgroundColor: "rgb(243, 242, 241)",
        },
        "&:active": {
            backgroundColor: "rgb(237, 235, 233)",
        },
    },
    commentCt: {
        maxWidth: 220,
        maxHeight: 265,
        minWidth: 20,
        minHeight: 20,
        overflow: "auto",
        wordBreak: "break-word",
        padding: 3,
        "& .title": {
            fontSize: 16,
            fontWeight: "bold",
            color: "#323130",
            paddingBottom: 5,
        },
        "& .des": {
            fontSize: 14,
            color: "#605e5c",
        },
    },
    expandList: {
        borderRadius: 2,
        margin: 3,
        padding: 3,
    },
    expandList_e: {
        "&:hover": {
            outline: "2px solid rgb(255,200,61)",
        },
    },
    expandList_focus: {
        outline: "2px solid rgb(255,200,61)",
    },
    expandListHead: {
        display: "flex",
        alignItems: "center",
    },
    expandListNotE: {
        cursor: "pointer",
    },
    expandListIcon: {
        marginRight: 5,
        borderRadius: 3,
        userSelect: "none",
        width: 20,
        height: 20,
        "& svg": {
            width: "100%",
            height: "100%",
            fill: "currentcolor",
            transition: "transform 0.3s",
        },
        "&:hover": {
            backgroundColor: "rgb(243, 242, 241)",
            color: "rgb(32, 31, 30)",
            cursor: "pointer",
        },
        "&:active": {
            backgroundColor: "rgb(237, 235, 233)",
        },
    },
    expandIcon_close: {
        "& svg": {
            transform: "rotate(-90deg)",
        },
    },
    expandListTitle: {
        flexGrow: 1,
    },
    expandContent: {
        paddingLeft: 25,
    },
    tableRoot: {
        padding: "5px 10px",
        margin: "7px 20px",
        maxWidth: "100%",
        maxHeight: 400,
        overflow: "auto",
        textAlign: "center",
    },
    tableRoot_e: {
        "& $tableContent": {
            "&:hover": {
                outline: "3px solid rgb(255,200,61)",
            },
        },
    },
    tableContent: {
        display: "table",
        border: "1px double #b3b3b3",
        borderSpacing: 0,
        borderCollapse: "collapse",
        margin: "auto",
        borderRadius: 3,
        maxWidth: "100%",
        textAlign: "left",
    },
    tableContent_focus: {
        outline: "3px solid rgb(255,200,61)",
    },
    tableRow: {
        borderCollapse: "collapse",
        borderSpacing: 0,
        display: "table-row",
    },
    tableCol: {
        display: "table-cell",
        minWidth: 35,
        padding: 6,
        border: "1px solid #bfbfbf",
        borderCollapse: "collapse",
        borderRadius: 2,
    },
    tableCol_fcous: {
        backgroundColor: "rgba(158,207,250, 0.3)",
        borderStyle: "none",
        boxShadow: "2px 2px 3px rgba(0,0,0,0.1) inset",
        outline: "1px solid rgb(31,137,229)",
        outlineOffset: -1,
    },
    blockEditContainer: {
        cursor: "pointer",
        position: "relative",
        "&:hover $blockEditIcon": {
            display: "inline-block",
        },
    },
    blockEditIcon: {
        borderRadius: 2,
        position: "absolute",
        top: 2,
        right: 2,
        padding: "4px 6px",
        display: "none",
        "& svg": {
            fill: "#0078d4",
            width: 16,
            height: 16,
            borderRadius: 2,
        },
        "&:hover": {
            backgroundColor: "rgba(50,51,52,0.1)",
        },
        "&:active": {
            backgroundColor: "rgba(50,51,52,0.15)",
        },
    },

    inlineMask: {
        borderRadius: 2,
        position: "absolute",
        top: -1,
        bottom: -1,
        left: -1,
        right: -1,
        backgroundColor: "rgba(50,51,52,0.1)",
        display: "none",
        alignItems: "center",
        justifyContent: "center",
        "& svg": {
            fill: "#0078d4",
            width: 12,
            height: 12,
            padding: 2,
            borderRadius: 2,
        },
        "&:active": {
            backgroundColor: "rgba(50,51,52,0.15)",
        },
    },
    inlineMaskContainer: {
        cursor: "pointer",
        position: "relative",
        "&:hover $inlineMask": {
            display: "flex",
        },
    },
    inEditor: {
        cursor: "pointer",
    },
    inFocus: {
        border: "1px solid #0078d4",
        "& $blockEditIcon": {
            display: "inline-block",
        },
    },
});
export const richClasses = richJssSheet.classes;

const fontEffectSheet = jss.createStyleSheet({
    "@global": {
        ".gl-ed-feffect-3d": {
            color: "#fff",
            textShadow:
                "0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,0.1), 0 0 5px rgba(0,0,0,0.1),0 1px 3px rgba(0,0,0,0.3),0 3px 5px rgba(0,0,0,0.2),0 5px 10px rgba(0,0,0,0.25)",
        },
        ".gl-ed-feffect-nyy": {
            color: "#f00",
            textShadow: "1px 1px 0px #212121",
        },
        ".gl-ed-feffect-lhd": {
            color: "#fff",
            textShadow:
                "0 0 5px #CCCCCC, 0 0 10px #CCCCCC, 0 0 15px #CCCCCC, 0 0 20px #095816, 0 0 25px #095816, 0 0 30px #095816, 0 0 50px #095816,  0 0 80px #095816, 0 0 100px #095816, 0 0 150px #095816",
        },
        ".gl-ed-feffect-tb": { color: "#222", textShadow: "0px 2px 3px #555" },
        ".gl-ed-feffect-fd": { color: "#FFFFFF", textShadow: "-1px -1px #fff, 1px 1px #333" },
        ".gl-ed-feffect-mb": { color: "#c00", WebkitTextStroke: "1px #000" },
        ".gl-ed-feffect-ck": {
            WebkitTextStroke: "1px #000",
            WebkitTextFillColor: "transparent",
        },
        ".gl-ed-feffect-bs3d": {
            color: "rgba(255, 100, 140,0.5)",
            textShadow: "3px 3px 0 rgba(80,255,0,0.8)",
        },
        ".gl-ed-feffect-mh": { color: "transparent", textShadow: "0 0 4px #f36" },
        ".gl-ed-feffect-gsmh": {
            filter: "blur(1px)",
        },
        ".gl-ed-feffect-mbxt": {
            backgroundColor: "#333",
            backgroundImage: "linear-gradient(45deg,transparent 45%,hsla(48,20%,90%,1) 45%,hsla(48,20%,90%,1) 55%,transparent 0)",
            backgroundSize: ".05em .05em",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            WebkitTextStroke: "2px #111",
        },
        "@keyframes glEdFEffectWaveMove": {
            "0%": {
                backgroundPositionX: "0%",
            },
            "100%": {
                backgroundPositionX: "50%",
            },
        },
        ".gl-ed-feffect-blx": {
            width: "fit-content",
            background:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 4'%3E%3Cpath fill='none' stroke='%23ff3300' d='M0 3.5c5 0 5-3 10-3s5 3 10 3 5-3 10-3 5 3 10 3'/%3E%3C/svg%3E\")\r\n          repeat-x 0 100%",
            animation: "glEdFEffectWaveMove 2s infinite linear",
            backgroundSize: "20px auto",
        },
        "@keyframes glEdFeffectLg": {
            "0%": { backgroundPosition: "0 0" },
            "100%": { backgroundPosition: "-100% 0" },
        },
        ".gl-ed-feffect-lg": {
            backgroundImage:
                "-webkit-linear-gradient(left, #3498db, #f47920 10%, #d71345 20%, #f7acbc 30%,\r\n#ffd400 40%, #3498db 50%, #f47920 60%, #d71345 70%, #f7acbc 80%, #ffd400 90%, #3498db)",
            color: "transparent",
            WebkitTextFillColor: "transparent",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            backgroundSize: "200% 100%",
            animation: "glEdFeffectLg 4s infinite linear",
        },
    },
});

function attachStyle() {
    if (!richJssSheet.attached) {
        richJssSheet.attach();
        fontEffectSheet.attach();
    }
}

attachStyle();
