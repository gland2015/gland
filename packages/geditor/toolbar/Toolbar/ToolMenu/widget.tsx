import React from "react";
import clsx from "clsx";
import { Tooltip, Callout } from "@gland/react/popover";
import { preventDefault } from "@gland/function/preventDefault";

import { icons } from "../../icons";
import { toolClasses as classes, toolNormalBtn } from "../style";

export function VerLine(props) {
    return <div className={classes.verLine} />;
}

export function BtnTip(props) {
    return (
        <Tooltip
            className={props.className}
            tip={props.tip}
            isOutHide
            disable={props.disable}
            delay={200}
            gapSpace={5}
            directionalHint="bottom"
            tipClassName={classes.tip}
            noSlide
        >
            {props.children}
        </Tooltip>
    );
}

export function DropButton(props: { tip; children; list: Array<{ value; label }>; getCurValue; onSelect; mode?: "narrower" | "wider"; style? }) {
    const [show, setShow] = React.useState(false);
    const attr = React.useRef({} as { root }).current;
    const curValue = props.getCurValue && props.getCurValue();

    let btn = null;
    if (props.mode === "wider") {
        btn = (
            <div
                className={clsx(classes.btn, classes.dropText, show ? classes.btn_s : null)}
                ref={(r) => (attr.root = r)}
                onClick={() => {
                    setShow(!show);
                }}
            >
                <div className={classes.dropText_body}>{props.children}</div>
                <div className={classes.dropText_down}>
                    <icons.AngleDown />
                </div>
            </div>
        );
    } else if (props.mode === "narrower") {
        btn = (
            <div
                className={clsx(toolNormalBtn, show ? classes.btn_s : null)}
                ref={(r) => (attr.root = r)}
                onClick={() => {
                    setShow(!show);
                }}
            >
                {props.children}
            </div>
        );
    } else {
        btn = (
            <div
                className={clsx(classes.btn, classes.dropBtn, show ? classes.btn_s : null)}
                ref={(r) => (attr.root = r)}
                onClick={() => {
                    setShow(!show);
                }}
            >
                <div className={classes.dropBtn_body}>{props.children}</div>
                <div className={classes.dropBtn_down}>
                    <icons.AngleDown />
                </div>
            </div>
        );
    }

    return (
        <React.Fragment>
            <BtnTip tip={props.tip} disable={show}>
                {btn}
            </BtnTip>
            <Callout
                target={attr.root}
                style={{ padding: 0 }}
                directionalHint="bottomLeft"
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
                <ul className={clsx(classes.menu, "smallScroll")} style={props.style}>
                    {props.list.map(function (item, index) {
                        return (
                            <li
                                key={index}
                                className={clsx(classes.btn, classes.menuItem, curValue === item.value ? classes.menu_cur : null)}
                                onClick={(e) => {
                                    props.onSelect && props.onSelect(item);
                                    setShow(false);
                                }}
                            >
                                {item.label}
                            </li>
                        );
                    })}
                </ul>
            </Callout>
        </React.Fragment>
    );
}
