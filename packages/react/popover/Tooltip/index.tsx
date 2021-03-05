import React from "react";
import clsx from "clsx";
import { jss } from "../../common/jss";
import { Callout, CalloutProps } from "../Callout";

const jssSheet = jss.createStyleSheet({
    root: {
        display: "inline-block",
    },
});

const classes = jssSheet.classes;

export interface TooltipProps {
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode | string | number;
    directionalHint?:
        | "top"
        | "left"
        | "right"
        | "bottom"
        | "topLeft"
        | "topRight"
        | "bottomLeft"
        | "bottomRight"
        | "leftTop"
        | "leftBottom"
        | "rightTop"
        | "rightBottom";
    isOutHide?: boolean;
    delay?: number;
    disable?: boolean;
    noSlide?: boolean;
    noAutoAdjust?: boolean;
    beakWidth?: number;
    gapSpace?: number;
    isBeakHidden?: boolean;
    tip?: React.ReactNode | string | number;
    tipStyle?: React.CSSProperties;
    tipClassName?: string;
}

export function Tooltip(props: TooltipProps) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }

    const attr = React.useRef({} as { timer? }).current;
    const [Ref, setRef] = React.useState(null);
    const [hide, setHide] = React.useState(true);

    React.useEffect(() => {
        clearTimeout(attr.timer);
        setHide(true);
    }, [props.disable]);

    return (
        <React.Fragment>
            <div
                ref={setRef}
                style={props.style}
                className={clsx(classes.root, props.className)}
                onMouseEnter={
                    !props.disable
                        ? () => {
                              if (props.delay) {
                                  clearTimeout(attr.timer);
                                  attr.timer = setTimeout(() => {
                                      setHide(false);
                                  }, props.delay);
                              } else {
                                  setHide(false);
                              }
                          }
                        : null
                }
                onMouseLeave={
                    !props.disable
                        ? () => {
                              clearTimeout(attr.timer);
                              if (props.isOutHide) {
                                  setHide(true);
                              }
                          }
                        : null
                }
            >
                {props.children}
            </div>
            <Callout
                target={Ref}
                directionalHint={props.directionalHint}
                style={props.tipStyle}
                className={props.tipClassName}
                beakWidth={props.beakWidth}
                noAutoAdjust={props.noAutoAdjust}
                noSlide={props.noSlide}
                gapSpace={props.gapSpace}
                isBeakHidden={props.isBeakHidden}
                hidden={props.disable || hide}
                moveoutDismiss={props.isOutHide ? false : true}
                onDismissEvent={
                    props.isOutHide
                        ? null
                        : (event, type, isTarget) => {
                              if (type === "mousemove") {
                                  setHide(true);
                              }
                          }
                }
            >
                {props.tip}
            </Callout>
        </React.Fragment>
    );
}
