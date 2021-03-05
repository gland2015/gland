import React from "react";
import { richClasses as classes } from "../style";

export function ListOl(props) {
    const { childs, depth, diff } = props;
    return (
        <ol className={classes.listol} data-depth={depth}>
            <div style={diff ? { marginLeft: diff * 25 } : null}>
                {childs.map(function (item) {
                    return (
                        <li key={item.key} className={classes.listol_item} data-subwrapper={item?.props?.subwrapper ? "true" : null}>
                            {item}
                        </li>
                    );
                })}
            </div>
        </ol>
    );
}
