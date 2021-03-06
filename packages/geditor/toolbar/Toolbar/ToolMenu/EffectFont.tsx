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

    return (
        <React.Fragment>
            <BtnTip tip={"特效字体"} disable={show}>
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
    {
        label: "无",
        value: null,
    },
    {
        label: "3D",
        value: "gl-ed-feffect-3d",
    },
    {
        label: "内阴影",
        value: "gl-ed-feffect-nyy",
    },
    {
        label: "霓虹灯",
        value: "gl-ed-feffect-lhd",
    },
    {
        label: "凸版",
        value: "gl-ed-feffect-tb",
    },
    {
        label: "浮雕",
        value: "gl-ed-feffect-fd",
    },
    {
        label: "描边",
        value: "gl-ed-feffect-mb",
    },
    {
        label: "抽空",
        value: "gl-ed-feffect-ck",
    },
    {
        label: "补色3D",
        value: "gl-ed-feffect-bs3d",
    },
    {
        label: "模糊",
        value: "gl-ed-feffect-mh",
    },
    {
        label: "高斯模糊",
        value: "gl-ed-feffect-gsmh",
    },
    {
        label: "描边线条",
        value: "gl-ed-feffect-mbxt",
    },
    {
        label: "波浪线",
        value: "gl-ed-feffect-blx",
    },
    {
        label: "流光",
        value: "gl-ed-feffect-lg",
    },
];

function FontEffectSelect(props) {
    const curValue = props.getCurValue();

    return (
        <div className={classes.effectSelect}>
            {effectList.map(function (item, index) {
                return (
                    <div
                        key={index}
                        className={clsx(classes.effectSelectItem, item.value, curValue === item.value ? classes.btn_s : null)}
                        onClick={() => {
                            props.onChange && props.onChange(item);
                        }}
                    >
                        {item.label}
                    </div>
                );
            })}
        </div>
    );
}
