import React from "react";
import clsx from "clsx";
import { icons } from "../../icons";
import { Callout } from "@gland/react/popover";
import { BtnTip } from "./widget";
import { toolClasses as classes } from "../style";
import { preventDefault } from "@gland/function/preventDefault";
import { ToolAttr } from "../utils";

export function EffectFont(props: { attr: ToolAttr }) {
    const [show, setShow] = React.useState(false);
    const attr = React.useRef({} as { root }).current;
    const tip = props.attr.lang.tip;

    return (
        <React.Fragment>
            <BtnTip tip={tip.fontEffect} disable={show}>
                <div
                    className={clsx(classes.btn, classes.dropBtn, show ? classes.btn_s : null)}
                    ref={(r) => (attr.root = r)}
                    onClick={() => {
                        setShow(!show);
                    }}
                >
                    <div className={classes.dropBtn_body}>
                        <icons.Font />
                    </div>
                    <div className={classes.dropBtn_down}>
                        <icons.AngleDown />
                    </div>
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
                <FontEffectSelect
                    lang={props.attr.lang}
                    getCurValue={() => {
                        let clsList = props.attr.currentState.inlineClassName;
                        let v = (clsList && clsList[0] && clsList[0].slice(1)) || null;
                        return v;
                    }}
                    onChange={(item) => {
                        props.attr.event.emit(props.attr.editEvent.fontEffect, "." + item.value);
                        setShow(false);
                    }}
                />
            </Callout>
        </React.Fragment>
    );
}

let effectList = [
    "none",
    "gl-ed-feffect-3d",
    "gl-ed-feffect-nyy",
    "gl-ed-feffect-lhd",
    "gl-ed-feffect-tb",
    "gl-ed-feffect-fd",
    "gl-ed-feffect-mb",
    "gl-ed-feffect-ck",
    "gl-ed-feffect-bs3d",
    "gl-ed-feffect-mh",
    "gl-ed-feffect-gsmh",
    "gl-ed-feffect-mbxt",
    "gl-ed-feffect-blx",
    "gl-ed-feffect-lg",
];

function FontEffectSelect(props) {
    const curValue = props.getCurValue();
    const lang = props.lang;

    return (
        <div className={classes.effectSelect}>
            {effectList.map(function (item, index) {
                const value = item === "none" ? null : item;

                return (
                    <div
                        key={index}
                        className={clsx(classes.effectSelectItem, value, curValue === value ? classes.btn_s : null)}
                        onClick={() => {
                            props.onChange && props.onChange(value);
                        }}
                    >
                        {lang.fontEffect[item]}
                    </div>
                );
            })}
        </div>
    );
}
