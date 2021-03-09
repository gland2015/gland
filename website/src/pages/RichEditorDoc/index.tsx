import React from "react";
import { SyntaxHighlighter, syntaxStyles } from "@gland/react/common/SyntaxHighlighter";
import { Divider } from "@gland/react/divider";
import { FabricLink } from "@gland/react/link";
import { Editor, Toolbar, config, lang_zh, lang_en, DefaultRemoteDataProvider } from "@gland/geditor";

import { classes } from "./style";

const editCls = {
    rootCls: null,
    wrapperCls: null,
    toolCls: null,
    footerCls: classes.editorFooter,
};

const isZh = Boolean(navigator.language.match(/zh/));

export function RichEditorDoc(props) {
    const attr = React.useMemo(() => {
        return { editor: null };
    }, []);

    const [lang, setLang] = React.useState(isZh ? "zh" : "en");
    const editorLang = lang === "zh" ? lang_zh : lang_en;

    return (
        <div className={classes.root}>
            <div className={classes.content} key={lang}>
                <h1>GEditor</h1>
                <h2>
                    A rich text editor with rich functions, It's based on{" "}
                    <a target="__blank" href="https://draftjs.org/">
                        draft-js
                    </a>
                </h2>
                <p>
                    <a target="__blank" href="https://github.com/gland2015/gland">
                        Github Address: https://github.com/gland2015/gland
                    </a>
                </p>
                <h2>Features</h2>
                <ul className={classes.list}>
                    <li>Text block: div, h1,h2,h3,h4,blockquote</li>
                    <li>Non text block: Image, Video, Code, Fomula, File, Audio, Iframe, HorizontalRule</li>
                    <li>Inline Image, Inline Fomula</li>
                    <li>Link edit and remove</li>
                    <li>ExpandableList, Table, ListOl, ListUl</li>
                    <li>Emoticon, Comment</li>
                    <li>Float Image, Table, Video, Audio</li>
                    <li>Multi-language support</li>
                    <li>The above can be used without configuration</li>
                    <li>... More features under development</li>
                </ul>
                <h2 style={{ marginTop: 50 }}>Quick Start</h2>
                <div>
                    <span>Editor Language:</span>
                    <select
                        value={lang}
                        onChange={(e) => {
                            setLang(e.target.value);
                        }}
                    >
                        <option value="zh">简体中文</option>
                        <option value="en">English</option>
                    </select>
                    <button style={{ marginLeft: 30 }} onClick={handleLog}>
                        Log Data
                    </button>
                </div>
                <div className={classes.editorWrapper}>
                    <Editor
                        ref={(r) => (attr.editor = r)}
                        config={config}
                        editCls={editCls}
                        lang={editorLang}
                        Toolbar={Toolbar}
                        readOnly={false}
                        RemoteDataProvider={DefaultRemoteDataProvider}
                        value={null}
                        data={null}
                        onChange={handleChange}
                    />
                </div>
                <h3>First</h3>
                <SyntaxHighlighter
                    style={syntaxStyles.materialDark}
                    language="bash"
                    children={`npm install @gland/react @gland/function @gland/draft-ts @gland/geditor`}
                />
                <h3>next</h3>
                <SyntaxHighlighter style={syntaxStyles.materialDark} language="jsx" children={startCode} />
                <Divider />
                <h4>Normal,we need save file at remote server,so you should achieve own RemoteDataProvider, it's like this</h4>
                <SyntaxHighlighter style={syntaxStyles.materialDark} language="jsx" children={remoteCode} />
                <h4>Custom Config</h4>
                <SyntaxHighlighter style={syntaxStyles.materialDark} language="jsx" children={configCode} />
                <h4>
                    More See{" "}
                    <a target="__blank" href="https://github.com/gland2015/gland">
                        Github
                    </a>
                </h4>
                <div>
                    If you has any problem,please issue at{" "}
                    <a target="__blank" href="https://github.com/gland2015/gland/issues">
                        https://github.com/gland2015/gland/issues
                    </a>
                </div>
                <div>
                    If you have more ideas, please contact <FabricLink className={classes.nullLink}>1147940842@qq.com</FabricLink>
                </div>
                <div>
                    If you think the project is OK,Please don't be stingy{" "}
                    <a target="__blank" href="https://github.com/gland2015/gland">
                        star
                    </a>
                    , <b>your star is my motivation</b>
                </div>
                <h1>Buy me a beer</h1>
                <Divider />
                <div>
                    If you want to thank this editor for saving time for your project, or simply like this editor, you can scan the code and
                    appreciate a few dollars to invite me for a beer!
                </div>
                <div className={classes.buybeer}>
                    <p>
                        BTC:<FabricLink className={classes.nullLink}>3BQqKXaR9sMqgP4Qb1MQ894574h89iAv9z</FabricLink>
                    </p>
                    <div>
                        <img src="https://mydevjs.oss-cn-beijing.aliyuncs.com/images/alipay.jpg" />
                        <img src="https://mydevjs.oss-cn-beijing.aliyuncs.com/images/wechat.png" />
                    </div>
                </div>
            </div>
        </div>
    );

    function handleChange() {
        console.log("content change");
    }

    function handleLog() {
        console.log("editor data", attr.editor.getStore());
    }
}

const startCode = `import { Editor, Toolbar, config, lang_zh, lang_en, DefaultRemoteDataProvider } from "@gland/geditor";
const editCls = {
    rootCls: null,
    wrapperCls: null,
    toolCls: null,
    footerCls: null,
};

function Demo() {
    const attr = React.useMemo(() => {
        return { editor: null };
    }, []);

    return (
        <Editor
            ref={(r) => (attr.editor = r)}
            config={config}
            editCls={editCls}
            lang={lang_en}
            Toolbar={Toolbar}
            readOnly={false}
            RemoteDataProvider={DefaultRemoteDataProvider}
            value={null}
            data={null}
            onChange={handleChange}
        />
    )

    function handleChange() {
        console.log("content change");
    }
    function handleLog() {
        // Get Editor Save Data
        console.log("editor data", attr.editor.getStore());
    }
}`;

const remoteCode = `import { blobToDataURL } from "@gland/function/dataTransform";

class RemoteDataProvider extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    render() {
        return null;
    }
    addContentAsset = async (file, from) => {
        // this is Editor Props - data
        let data = this.props.context.data;
        // this is file base64 code, don't like this in production
        const url = await blobToDataURL(file);
        return {
            mediaId: "",
            URL: url,
            isRemote: false,
        };
    };

    // if is remote,it will get url at run time
    getContentAsset = async (data, setState) => {
        return data.url;
    };
}`;

const configCode = `import {
    Emoticon,
    Link,
    Code,
    Formula,
    InlineFormula,
    HorizontalRule,
    Image,
    InlineImage,
    Video,
    Audio,
    File,
    ListOl,
    ListUl,
    ExpandableList,
    Table,
    Comment,
    Iframe,
} from "@gland/geditor/toolbar/RichComp";
import { richClasses as classes } from "@gland/geditor/toolbar/style";
import { menus } from "@gland/geditor/toolbar//Toolbar/ToolMenu/menus";
import { lang_zh } from "@gland/geditor/toolbar//lang/zh";

export const config = {
    classNames: {
        root: classes.root,
        div: classes.div,
        h1: classes.h1,
        h2: classes.h2,
        h3: classes.h3,
        h4: classes.h4,
        blockquote: classes.blockquote,
    },
    noFollowBlocks: ["h1", "h2", "h3", "h4", "h5", "h6", "blockquote"],
    entitys: {
        Emoticon,
        Link,
        InlineFormula,
        InlineImage,
        Comment,
    },
    nonTexts: { Code, Formula, HorizontalRule, Image, Video, Audio, File, Iframe },
    wrappers: {
        ListOl,
        ListUl,
    },
    subBlocks: {
        ExpandableList,
        Table,
    },
    defaultLang: lang_zh,
    toolCfg: {
        menus,
        defaultBgColor: "#ffffff",
        defaultTextColor: "#222",
        textColors: [
            "#2E2E2E",
            "#888",
            "#222",
            "#404145",
            "#f0e68c",
            "#87ceeb",
            "#FAFAFA",
            "#cd5c5c",
            "#0078d4",
            "#00bcf2",
            "#107c10",
            "#bad80a",
            "#5c005c",
            "#ff8c00",
            "#e3008c",
            "#d13438",
        ],
        bgColors: [
            "#deecf9",
            "#f3f2f1",
            "#e1dfdd",
            "#a19f9d",
            "#404145",
            "#0078d4",
            "#e3008c",
            "#b4a0ff",
            "#00bcf2",
            "#107c10",
            "#bad80a",
            "#00B294",
            "#407afc",
            "#fff100",
            "#ea4300",
            "#d83b01",
        ],
    },
};`;
