import React from "react";

import { icons } from "../../icons";
import { toolNormalBtn, toolClasses as classes } from "../style";
import { ToolAttr } from "../utils";
import { BtnTip } from "./widget";
import { FabricButton } from "@gland/react/button";
import { Callout } from "@gland/react/popover";
import { TextInput } from "@gland/react/input";

export function Link(props: { attr: ToolAttr }) {
    const [show, setShow] = React.useState(false);
    const btnAttr = React.useRef({} as { root }).current;
    const lang = props.attr.lang;

    return (
        <React.Fragment>
            <BtnTip tip={lang.tip.link} disable={show}>
                <div
                    className={toolNormalBtn}
                    ref={(r) => (btnAttr.root = r)}
                    onClick={() => {
                        if (props.attr.editorCtx.target?.isCollapsed) {
                            return;
                        }
                        setShow(!show);
                    }}
                >
                    <icons.Link />
                </div>
            </BtnTip>
            <Callout
                target={btnAttr.root}
                directionalHint="bottom"
                gapSpace={0}
                beakWidth={8}
                hidden={!show}
                onDismissEvent={(event, type, isTarget) => {
                    if (type === "click" && !isTarget) {
                        setShow(false);
                    }
                }}
                onMouseDown={(e) => {
                    const target: HTMLInputElement = e.target;
                    if (target.tagName !== "INPUT") {
                        e.preventDefault();
                    }
                }}
            >
                <LinkInput
                    lang={lang}
                    onConfirm={(href) => {
                        const attr = props.attr;
                        setTimeout(() => {
                            if (href) {
                                attr.event.emit(attr.editEvent.addLink, href);
                            }
                            setShow(false);
                        });
                    }}
                />
            </Callout>
        </React.Fragment>
    );
}

function LinkInput(props) {
    const [text, setText] = React.useState("");

    return (
        <div className={classes.linkInput}>
            <TextInput
                className={classes.linkIpt_ipt}
                underlined
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                }}
                autoFocus
                forceAutoFocus
                onEntry={() => {
                    props.onConfirm && props.onConfirm(text);
                }}
            />
            <FabricButton
                color="primary"
                onClick={(e) => {
                    props.onConfirm && props.onConfirm(text);
                }}
            >
                {props.lang.base.confirm}
            </FabricButton>
        </div>
    );
}
