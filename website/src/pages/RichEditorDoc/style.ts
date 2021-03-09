import { jss } from "@gland/react/common/jss";

const { classes } = jss
    .createStyleSheet({
        root: {
            textAlign: "center",
        },
        content: {
            maxWidth: 1200,
            margin: "auto",
            textAlign: "left",
            paddingBottom: 400,
        },
        list: {
            color: "rgb(36,41,46)",
            "& li": {
                marginTop: ".25em",
            },
        },
        editorFooter: {
            minHeight: 50,
        },
        editorWrapper: {
            border: "1px solid #303132",
            margin: "10px 0",
        },
        nullLink: {
            userSelect: "all",
            margin: "0 5px",
        },
        buybeer: {
            "& img": {
                maxWidth: 300,
                margin: "0 20px",
            },
        },
    })
    .attach();

export { classes };
