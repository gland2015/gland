import React from "react";
import { emojiMap } from "../emoji";
import { richClasses as classes } from "../style";

export function Emoticon(props) {
    const { data, children, context } = props;
    const lang = context.lang;

    const ele = React.cloneElement(children[0], {
        custom: <img src={emojiMap[data.title]} title={lang.emojiMap[data.title]} className={classes.emoticon} />,
    });
    return ele;
}
