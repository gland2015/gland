import React from "react";
import clsx from "clsx";
import { SketchPicker } from "react-color";
import { FabricButton } from "@gland/react/button";
import { Callout } from "@gland/react/popover";

import { icons } from "../../icons";
import { toolClasses as classes } from "../style";
import { BtnTip } from "./widget";
import { ToolAttr } from "../utils";

export function TextColor(props) {
    return (
        <ColorSelectBtn tip="字体颜色" type="text" attr={props.attr}>
            <icons.TextColor />
        </ColorSelectBtn>
    );
}

export function BackgroundColor(props) {
    return (
        <ColorSelectBtn tip="背景颜色" type="bg" attr={props.attr}>
            <icons.FillDrip />
        </ColorSelectBtn>
    );
}

function ColorSelectBtn(props: { tip?: string; attr?: ToolAttr; children?; type? }) {
    const [show, setShow] = React.useState(false);

    const [color, setColor] = React.useState(null);

    const btnAttr = React.useRef({} as { root; editState; hasBlur }).current;
    const toolAttr = props.attr;

    const autoColor = props.type === "bg" ? toolAttr.defaultBgColor : toolAttr.defaultTextColor;
    const curColor = color || autoColor || "currentcolor";
    const colorList = props.type === "bg" ? toolAttr.bgColors : toolAttr.textColors;

    return (
        <React.Fragment>
            <BtnTip tip={props.tip} disable={show}>
                <div className={clsx(classes.colorSelect, show ? classes.colorSelect_focus : null)} ref={(r) => (btnAttr.root = r)}>
                    <div
                        className={clsx(classes.btn, classes.cs_body)}
                        onClick={(e) => {
                            setShow(false);
                            toolAttr.event.emit(props.type === "bg" ? toolAttr.editEvent.bgColor : toolAttr.editEvent.color, color);
                        }}
                    >
                        <div>
                            {props.children}
                            <div className={classes.cs_body_bar} style={{ backgroundColor: curColor }}></div>
                        </div>
                    </div>
                    <div
                        className={clsx(classes.btn, classes.cs_down)}
                        onClick={() => {
                            if (show) {
                                setShow(false);
                            } else {
                                setShow(true);
                            }
                        }}
                    >
                        <icons.AngleDown />
                    </div>
                </div>
            </BtnTip>
            <Callout
                target={btnAttr.root}
                directionalHint="bottomLeft"
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
                <ColorPicker
                    autoColor={autoColor}
                    presetColors={colorList}
                    color={color}
                    onChange={(c) => {
                        setShow(false);
                        setColor(c);
                        toolAttr.event.emit(props.type === "bg" ? toolAttr.editEvent.bgColor : toolAttr.editEvent.color, c);
                    }}
                />
            </Callout>
        </React.Fragment>
    );
}

function ColorPicker(props) {
    const [state, setState] = React.useState({
        color: props.color || props.autoColor || "#0078d4",
        isAuto: !props.color,
    });

    return (
        <div>
            <SketchPicker
                presetColors={props.presetColors}
                color={state.color}
                className={classes.sketchPicker}
                onChange={(c) => {
                    setState({ color: c.hex, isAuto: false });
                }}
            />
            <div className={classes.pickerFooter}>
                <div
                    className={classes.pickerAuto}
                    style={state.isAuto ? { border: "1px solid #0078d4", backgroundColor: "rgb(237, 235, 233)" } : null}
                    onClick={() => {
                        setState(
                            Object.assign({}, state, {
                                isAuto: !state.isAuto,
                            })
                        );
                    }}
                >
                    <div className={classes.pickerAutoItem} style={{ backgroundColor: props.autoColor || null }}></div>
                    <div>自动</div>
                </div>
                <div>
                    <FabricButton
                        color="primary"
                        onClick={(e) => {
                            props.onChange && props.onChange(state.isAuto ? undefined : state.color);
                        }}
                    >
                        确定
                    </FabricButton>
                </div>
            </div>
        </div>
    );
}
