import React from "react";
import clsx from "clsx";

import { toolClasses as classes } from "../style";
import { ToolAttr } from "../utils";

export const ToolMenu = React.memo<{ attr: ToolAttr; className: string; menus: Array<any> }>(function (props) {
    const menuAttr = React.useRef({} as { root: HTMLDivElement }).current;

    React.useEffect(() => {
        const toolAttr = props.attr;

        function handleMousedown(e) {
            e.preventDefault();
            toolAttr.editorCtx.editor.focus();
        }

        menuAttr.root.addEventListener("mousedown", handleMousedown);

        return () => {
            if (menuAttr.root) {
                menuAttr.root.removeEventListener("mousedown", handleMousedown);
            }
        };
    }, []);

    return (
        <div className={clsx(classes.root, props.className)} ref={(r) => (menuAttr.root = r)}>
            {props.menus.map(function (Comp, index) {
                return <Comp attr={props.attr} key={index} />;
            })}
        </div>
    );
});
