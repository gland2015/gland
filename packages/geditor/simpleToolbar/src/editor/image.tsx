import React from "react";
import { OrderedSet } from "immutable";

// notice 目前是非文本光标位置不正常
export function Image(props) {
    //console.log("Emoticon", props);
    const { data, offsetKey, children, context } = props;
    const { isRemote } = data;
    const [state, setState] = React.useState();
    let url;
    if (isRemote) {
        url = context.editor.remoteDataProvider.getContentAsset(data, setState);
    } else {
        url = data.url;
    }
    const ele = React.cloneElement(children[0], {
        custom: typeof url === "string" ? <img src={url} /> : "loading"
    });

    return ele;
}
