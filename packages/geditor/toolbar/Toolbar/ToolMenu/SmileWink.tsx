import React from "react";
import clsx from "clsx";
import { Callout } from "@gland/react/popover";

import { icons } from "../../icons";
import { toolClasses as classes, toolNormalBtn } from "../style";
import { preventDefault } from "@gland/function/preventDefault";
import { BtnTip } from "./widget";
import { emojiList, emojiMap } from "../../emoji";
import { ToolAttr } from "../utils";

export function SmileWink(props: { attr: ToolAttr }) {
    const [show, setShow] = React.useState(false);
    const attr = React.useRef({} as { root }).current;
    const lang = props.attr.lang;

    return (
        <React.Fragment>
            <BtnTip tip={lang.tip.smileWink} disable={show}>
                <div
                    className={clsx(toolNormalBtn, show ? classes.btn_s : null)}
                    ref={(r) => (attr.root = r)}
                    onClick={() => {
                        setShow(!show);
                    }}
                >
                    <icons.SmileWink />
                </div>
            </BtnTip>
            <Callout
                target={attr.root}
                directionalHint="bottom"
                gapSpace={0}
                beakWidth={8}
                hidden={!show}
                onDismissEvent={(event, type, isTarget) => {
                    if (type === "click" && !isTarget) {
                        setShow(false);
                    }
                }}
                onMouseDown={preventDefault}
            >
                <EmojiSelect
                    lang={lang}
                    onSelect={(title) => {
                        const attr = props.attr;
                        attr.event.emit(attr.editEvent.emoticon, title);
                        setShow(false);
                    }}
                />
            </Callout>
        </React.Fragment>
    );
}

const EmojiSelect = React.memo(function (props: { onSelect; lang }) {
    return (
        <div className={classes.emojiSelect}>
            {emojiList.map(function (title) {
                return (
                    <span
                        key={title}
                        title={`[${props.lang.emojiMap[title]}]`}
                        className={clsx(classes.btn, classes.emojiItem)}
                        onClick={(e) => {
                            props.onSelect(title);
                        }}
                    >
                        <img src={emojiMap[title]} />
                    </span>
                );
            })}
        </div>
    );
});
