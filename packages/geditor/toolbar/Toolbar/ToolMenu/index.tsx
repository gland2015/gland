import React from "react";

import { toolClasses as classes } from "../style";
import { VerLine, BtnTip } from "./widget";
import { ToolAttr } from "../utils";

import { Bold } from "./Bold";
import { Italic } from "./Italic";
import { Underline } from "./Underline";
import { Strikethrough } from "./Strikethrough";
import { Eraser } from "./Eraser";
import { Link } from "./Link";
import { Formula } from "./Formula";
import { Code } from "./Code";
import { Image } from "./Image";
import { SmileWink } from "./SmileWink";
import { More } from "./More";
import { TextColor, BackgroundColor } from "./ColorSelect";
import { TextHeight } from "./TextHeight";
import { FontFamily } from "./FontFamily";
import { LineHeight } from "./LineHeight";
import { EffectFont } from "./EffectFont";
import { TextAlign } from "./TextAlign";
import { BlockType } from "./BlockType";
import { List } from "./List";
import { ListOl } from "./ListOl";

export const ToolMenu = React.memo<{ attr: ToolAttr }>(function (props) {
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
        <div className={classes.root} ref={(r) => (menuAttr.root = r)}>
            <BtnTip tip="粗体">
                <Bold attr={props.attr} />
            </BtnTip>
            <BtnTip tip="斜体">
                <Italic attr={props.attr} />
            </BtnTip>
            <BtnTip tip="下划线">
                <Underline attr={props.attr} />
            </BtnTip>
            <BtnTip tip="删除线">
                <Strikethrough attr={props.attr} />
            </BtnTip>
            <BtnTip tip="清除格式">
                <Eraser attr={props.attr} />
            </BtnTip>

            <TextColor attr={props.attr} />
            <BackgroundColor attr={props.attr} />
            <TextHeight attr={props.attr} />
            <FontFamily attr={props.attr} />
            <EffectFont attr={props.attr} />
            <VerLine attr={props.attr} />
            <BlockType attr={props.attr} />
            <VerLine attr={props.attr} />
            <BtnTip tip="无序列表">
                <List attr={props.attr} />
            </BtnTip>
            <BtnTip tip="有序列表">
                <ListOl attr={props.attr} />
            </BtnTip>
            <TextAlign attr={props.attr} />
            <LineHeight attr={props.attr} />
            <Link attr={props.attr} />
            <Code attr={props.attr} />
            <Formula attr={props.attr} />
            <Image attr={props.attr} />
            <SmileWink attr={props.attr} />
            <More attr={props.attr} />
        </div>
    );
});
