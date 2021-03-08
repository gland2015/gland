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
        editorFooter: {
            minHeight: 50,
        },
        editorWrapper: {
            border: "1px solid #303132",
            margin: "10px 0",
        },
    })
    .attach();

export { classes };
