import React from "react";
import { OrderedSet } from "immutable";

// notice 目前是非文本光标位置不正常
export function Emoticon(props) {
    //console.log("Emoticon", props);
    const { data, offsetKey, children } = props;
    const ele = React.cloneElement(children[0], {
        custom: <img src={data.url} />
    });
     return ele
}
