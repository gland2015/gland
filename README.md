# GEditor-EN

> Thanks to **Google Translate**

#### A web rich text editor based on draft-js, suitable for React framework, compatible with mainstream modern browsers.

#### [Use Document](http://mydevjs.com/) [Online Demo](http://mydevjs.com/)

## Please understand before using

GEditor is an editor based on draft-js. Draft-js does not directly use HTML as the component state. It implements an EditorState type, which is essentially a JS object. In the traditional rich text editor, The piece of HTML content corresponding to EditorState is a block; this can be verified by looking at editorState.toRAW ().

The advantage of using EditorState instead of HTML strings is that a set of EditorState can be used on multiple ends, and the content produced by the editor is no longer limited to being displayed on the web platform (of course, each platform also needs to implement the corresponding EditorState to View conversion function) At the same time, it is more suitable for the component state of React.

However, in the above implementation, the biggest problem is that it cannot perfectly convert external HTML into EditorState, because its supported styles, tags, tag attributes, and so on are extremely limited, and there is no way to convert all the features in HTML to the state in EditorState. , When using third-party or historical HTML strings to initialize the editor content, and when pasting external HTML content, only a small number of styles and tag attributes supported by the editor can be retained, most of the content will be filtered or Ignore it.

Based on the above shortcomings, if your project strongly depends on the original HTML tags and attributes, etc., this editor is not recommended.

## Features

-   Text block: div, h1,h2,h3,h4,blockquote
-   Non text block: Image, Video, Code, Fomula, File, Audio, Iframe, HorizontalRule
-   Inline Image, Inline Fomula
-   Link edit and remove
-   ExpandableList, Table, ListOl, ListUl
-   Emoticon, Comment
-   Float Image, Table, Video, Audio
-   Multi-language support
-   The above can be used without configuration
-   ... More features under development

## installation

```bash
npm install @gland/react @gland/function @gland/draft-ts @gland/geditor
```

## use

The editor supports **value** properties, which are similar to the native input components in React. In general, you can use this editor in the form of a typical **controlled component**:

```jsx
import { Editor, Toolbar, config, lang_zh, lang_en, DefaultRemoteDataProvider } from "@gland/geditor";
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
    );

    function handleChange() {
        console.log("content change");
    }
    function handleLog() {
        // Get Editor Save Data
        console.log("editor data", attr.editor.getStore());
    }
}

import { blobToDataURL } from "@gland/function/dataTransform";

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
}
```

#### For more introduction, please see [Detailed Document](http://mydevjs.com/)

-   If you think the project is OK,Please star, your star is my motivation
-   If you has any problem,Please issue
-   If you have more ideas,Please Contact 1147940842@qq.com

## Buy me a beer

If you want to thank this editor for saving time for your project, or simply like this editor, you can scan the code and appreciate a few dollars to invite me for a beer!
BTC:&emsp; 3BQqKXaR9sMqgP4Qb1MQ894574h89iAv9z

<img src="https://mydevjs.oss-cn-beijing.aliyuncs.com/images/alipay.jpg" width="200" />&emsp;&emsp;<img src="https://mydevjs.oss-cn-beijing.aliyuncs.com/images/wechat.png" width="200" />
