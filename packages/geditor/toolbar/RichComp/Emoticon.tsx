import React from "react";
import { emojiMap, zhLabelMap } from "../emoji";
import { richClasses as classes } from "../style";

export function Emoticon(props) {
    const { data, children } = props;
    const ele = React.cloneElement(children[0], {
        custom: <img src={emojiMap[data.title]} title={zhLabelMap[data.title]} className={classes.emoticon} />,
    });
    return ele;
}
