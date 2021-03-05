import React from "react";
import { richClasses as classes } from "../style";

export function ListUl(props) {
    const { childs, depth, diff } = props;
    return (
        <ul className={classes.listul} data-depth={depth}>
            <div style={diff ? { marginLeft: diff * 25 } : null}>
                {childs.map(function (item) {
                    return (
                        <li key={item.key} className={classes.listul_item} data-subwrapper={item?.props?.subwrapper ? "true" : null}>
                            {item}
                        </li>
                    );
                })}
            </div>
        </ul>
    );
}
