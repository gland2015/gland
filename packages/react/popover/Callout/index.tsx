import React from "react";
import { createPortal } from "react-dom";
import { isPointInRect } from "@gland/function/position";
import { centerValue } from "@gland/function/handleNumber";

import clsx from "clsx";
import { jss } from "../../common/jss";

import { useSpring, animated } from "react-spring";

const jssSheet = jss.createStyleSheet({
    root: {
        // "--neutralLight": "var(--glCalloutNeutralLight, #edebe9)", // rgb(237,235,233)
        "--neutralWhite": "var(--glCalloutNeutralWhite, #ffffff)", // rgb(255,255,255)
        visibility: "hidden",
        minWidth: 16,
        minHeight: 16,
        maxWidth: 500,
        maxHeight: 500,
        padding: 5,
        position: "absolute",
        boxSizing: "border-box",
        borderRadius: 2,
        boxShadow: "rgba(0, 0, 0, 0.133) 0px 6.4px 14.4px 0px, rgba(0, 0, 0, 0.11) 0px 1.2px 3.6px 0px",
        outline: "transparent",
        zIndex: 1,
        backgroundColor: "var(--neutralWhite)",
        fontSize: 14,
        top: -1000,
        left: -1000,
    },
    beak: {
        position: "absolute",
        backgroundColor: "inherit",
        boxShadow: "inherit",
        border: "inherit",
        boxSizing: "border-box",
        transform: "rotate(45deg)",
        height: 16,
        width: 16,
        zIndex: 2,
    },
    beakCurtain: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "inherit",
        zIndex: 3,
        borderRadius: "inherit",
    },
    content: {
        position: "relative",
        zIndex: 4,
    },
});

const classes = jssSheet.classes;

export interface CalloutProps {
    style?: React.CSSProperties;
    className?: string;
    children?: any;
    innerRef?: React.MutableRefObject<any>;
    target?: HTMLElement;
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
    hidden?: boolean;
    noAutoAdjust?: boolean;
    noSlide?: boolean;
    beakWidth?: number;
    gapSpace?: number;
    isBeakHidden?: boolean;
    moveoutDismiss?: boolean;
    onDismissEvent?: (event: Event, type: "mousemove" | "click", isTarget?: boolean) => any;
    onMouseDown?;
}

export function Callout(props: CalloutProps) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }

    const [hide, setHide] = React.useState(props.hidden);

    React.useEffect(() => {
        if (!props.hidden && hide) {
            setHide(false);
        }
    }, [props.hidden]);

    if (!props.target) return null;
    if (hide) return null;

    return (
        <CalloutWithTar
            props={props}
            hideItem={() => {
                setHide(true);
            }}
        />
    );
}

function initier(props) {
    return {
        wrapperStyle: props.style,
        beakStyle: null,
    };
}

function reducer(state, action) {
    let newState = state;

    const payload = action?.payload;
    const props = action?.props;
    if (action?.type === "show") {
        return {
            beakStyle: payload.beak,
            wrapperStyle: {
                ...(props.style || {}),
                ...payload.wrapper,
                visibility: "visible",
            },
        };
    }

    return newState;
}

function CalloutWithTar(p) {
    const props: CalloutProps = p.props;
    const attr = React.useRef({
        wrapperEle: null as HTMLDivElement,
        inAnimate: false,
        animate: null,
        curTarget: null,
        tarPos: null,
        wrapPos: null,
        props: null,
        updateSign: null,
    }).current;

    attr.props = props;

    const [state, dispatch] = React.useReducer(reducer, props, initier);

    const [springStyle, setSpring] = useSpring(() => ({ to: {} } as any));

    React.useEffect(() => {
        attr.curTarget = props.target;

        let isCurrent = true;

        if (!props.hidden) {
            const { posArray } = updatePosition();
            attr.animate = getAnimate(posArray[0]);

            setSpring({
                to: attr.animate.entry.to,
                from: attr.inAnimate ? null : attr.animate.entry.from,
                config: attr.animate.entry.config,
                onRest() {
                    if (isCurrent) {
                        attr.inAnimate = false;
                    }
                },
            });
        } else {
            if (!attr.animate) return;
            setSpring({
                to: attr.animate.exit.to,
                from: attr.inAnimate ? null : attr.animate.exit.from,
                config: attr.animate.exit.config,
                onRest() {
                    if (isCurrent) {
                        attr.inAnimate = false;
                        p.hideItem();
                    }
                },
            });
        }

        attr.inAnimate = true;

        return () => {
            isCurrent = false;
        };
    }, [props.hidden]);

    React.useEffect(() => {
        let rect = props.target.getBoundingClientRect();
        let updateSign =
            rect.top +
            document.scrollingElement.scrollTop +
            "" +
            (rect.left + document.scrollingElement.scrollLeft) +
            "" +
            rect.width +
            "" +
            rect.height;

        if (attr.updateSign !== updateSign) {
            attr.updateSign = updateSign;
            attr.curTarget = attr.props.target;
            updatePosition();
        }
    });

    React.useEffect(() => {
        const document = attr.props.target.ownerDocument;

        function handleClick(event) {
            let target = event.target;
            if (attr.wrapperEle && !attr.wrapperEle.contains(target)) {
                attr.props.onDismissEvent && attr.props.onDismissEvent(event, "click", attr.props.target && attr.props.target.contains(target));
            }
        }

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
            p.hideItem();
        };
    }, []);

    React.useEffect(() => {
        const moveoutDismiss = attr.props.moveoutDismiss;
        if (moveoutDismiss) {
            const document = props.target.ownerDocument;

            document.addEventListener("mousemove", handleMove);

            return () => document.removeEventListener("mousemove", handleMove);

            function handleMove(event) {
                if (attr.props.hidden) return;

                const point = { x: event.pageX, y: event.pageY };

                const inWrap = isPointInRect(point, attr.wrapPos);
                const inTar = isPointInRect(point, attr.tarPos);

                if (!inWrap && !inTar) {
                    attr.props.onDismissEvent && attr.props.onDismissEvent(event, "mousemove");
                }
            }
        }
    }, [props.moveoutDismiss]);

    const divStyle = { ...(state.wrapperStyle || {}) };

    if (springStyle.xy) {
        if (!props.noSlide) {
            divStyle["transform"] = springStyle.xy.to(function (x, y) {
                return `translate(${x}px,${y}px)`;
            });
        }

        divStyle["opacity"] = springStyle.opacity;
    }

    return createPortal(
        <animated.div
            ref={(r) => {
                if (typeof props.innerRef === "function") {
                    (props as any).innerRef(r);
                } else if (typeof props.innerRef === "object") {
                    props.innerRef.current = r;
                }
                attr.wrapperEle = r;
            }}
            className={clsx(classes.root, props.className)}
            style={divStyle}
            onMouseDown={props.onMouseDown}
        >
            {props.isBeakHidden ? null : <div className={classes.beak} style={state.beakStyle}></div>}
            {props.isBeakHidden ? null : <div className={classes.beakCurtain}></div>}
            <div className={classes.content}>{props.children}</div>
        </animated.div>,
        document.body
    );

    function updatePosition() {
        let posStyle = getPosStyle(props.target, attr.wrapperEle, props as any);
        attr.wrapPos = posStyle.wrapPos;
        attr.tarPos = posStyle.tarPos;

        dispatch({ type: "show", payload: posStyle, props });

        return posStyle;
    }
}

function getPosStyle(targetEle: HTMLElement, wrapperEle: HTMLElement, { directionalHint, gapSpace, noAutoAdjust, beakWidth, isBeakHidden }) {
    if (!targetEle || !wrapperEle) {
        return null;
    }

    const tarRect = targetEle.getBoundingClientRect();

    const wrapWidth = wrapperEle.offsetWidth;
    const wrapHeight = wrapperEle.offsetHeight;

    if (isBeakHidden) {
        beakWidth = 0;
    } else {
        beakWidth = beakWidth || 16;
        beakWidth = beakWidth > wrapWidth / 2 - 6 ? wrapWidth / 2 - 6 : beakWidth;
        beakWidth = beakWidth < 2 ? 2 : beakWidth;
    }

    gapSpace = typeof gapSpace === "number" ? gapSpace : 0;
    directionalHint = directionalHint || "top";
    const scrollTop = document.scrollingElement.scrollTop;
    const scrollLeft = document.scrollingElement.scrollLeft;
    const beakHeight = beakWidth * 0.707107;

    let posArray = [];
    let m = directionalHint.match(/[A-Z][a-z]+$/);
    posArray[0] = directionalHint.match(/^[a-z]+/)[0];
    posArray[1] = m ? m[0].toLowerCase() : "center";

    let wrapBound = computeWrapBound(posArray);

    if (!noAutoAdjust) {
        let needNewBound;
        const isSideVisibe = (side) => {
            const value = wrapBound[side];
            if (side === "left" || side === "top") {
                return value >= 0;
            }
            if (side === "right") {
                return value <= document.documentElement.clientWidth;
            }
            if (side === "bottom") {
                return value <= document.documentElement.clientHeight;
            }
        };
        let newPosArray = posArray.map(function (str, index) {
            let bStr = getBackDir(str);
            if (index === 0) {
                if (!isSideVisibe(str)) {
                    needNewBound = true;
                    return bStr;
                }
            } else {
                if (!isSideVisibe(bStr)) {
                    needNewBound = true;
                    return bStr;
                }
            }

            return str;
        });

        if (needNewBound) {
            posArray = newPosArray;
            wrapBound = computeWrapBound(posArray);
        }
    }

    const beakPos = computeBeakPos(posArray);

    const wrapLeft = scrollLeft + wrapBound.left;
    const wrapTop = scrollTop + wrapBound.top;

    const tarLeft = scrollLeft + tarRect.left;
    const tarTop = scrollTop + tarRect.top;
    const wrapPos = { left: wrapLeft, top: wrapTop, right: wrapLeft + wrapWidth, bottom: wrapTop + wrapHeight };
    const tarPos = { left: tarLeft, top: tarTop, right: tarLeft + tarRect.width, bottom: tarTop + tarRect.height };
    // 延长
    const wrapAddL = beakHeight + gapSpace + 5;
    switch (posArray[0]) {
        case "top":
            wrapPos.bottom += wrapAddL;
            break;
        case "bottom":
            wrapPos.top -= wrapAddL;
            break;
        case "left":
            wrapPos.right += wrapAddL;
            break;
        case "right":
            wrapPos.left -= wrapAddL;
            break;
    }

    return {
        wrapper: { left: wrapLeft, top: wrapTop },
        beak: { ...beakPos, width: beakWidth, height: beakWidth },
        posArray,
        wrapPos,
        tarPos,
    };

    function computeBeakPos(posArr) {
        const pos = {} as any;

        const outWidth = (-1 * beakWidth) / 2;

        if (posArr[0] === "top") {
            pos.bottom = outWidth;
        } else if (posArr[0] === "bottom") {
            pos.top = outWidth;
        } else if (posArr[0] === "left") {
            pos.right = outWidth;
        } else {
            pos.left = outWidth;
        }

        const minOffset = 3 + beakWidth * 0.207107;
        if (posArr[1] === "left") {
            const maxOffset = wrapWidth / 2 - beakWidth / 2;
            const offset = tarRect.width / 2 - beakWidth / 2;
            pos.left = centerValue(minOffset, maxOffset, offset);
        } else if (posArr[1] === "right") {
            const maxOffset = wrapWidth / 2 - beakWidth / 2;
            const offset = tarRect.width / 2 - beakWidth / 2;
            pos.right = centerValue(minOffset, maxOffset, offset);
        } else if (posArr[1] === "top") {
            const maxOffset = wrapHeight / 2 - beakWidth / 2;
            const offset = tarRect.height / 2 - beakWidth / 2;
            pos.top = centerValue(minOffset, maxOffset, offset);
        } else if (posArr[1] === "bottom") {
            const maxOffset = wrapHeight / 2 - beakWidth / 2;
            const offset = tarRect.height / 2 - beakWidth / 2;
            pos.bottom = centerValue(minOffset, maxOffset, offset);
        } else {
            if (posArray[0] === "top" || posArray[0] === "bottom") {
                pos.left = wrapWidth / 2 - beakWidth / 2;
            } else {
                pos.top = wrapHeight / 2 - beakWidth / 2;
            }
        }

        return pos;
    }

    function computeWrapBound(posArr) {
        const theBound = {} as any;

        // handle pos1
        if (posArr[0] === "top") {
            theBound.top = tarRect.top - gapSpace - (beakHeight + wrapHeight);
            theBound.bottom = tarRect.top - gapSpace;
        } else if (posArr[0] === "bottom") {
            theBound.top = tarRect.bottom + gapSpace + beakHeight;
            theBound.bottom = theBound.top + wrapHeight;
        } else if (posArr[0] === "left") {
            theBound.left = tarRect.left - gapSpace - (beakHeight + wrapWidth);
            theBound.right = tarRect.left - gapSpace;
        } else {
            theBound.left = tarRect.right + gapSpace + beakHeight;
            theBound.right = theBound.left + wrapWidth;
        }

        // handle pos 2
        if (posArr[1] === "left") {
            theBound.left = tarRect.left;
            theBound.right = tarRect.left + wrapWidth;
        } else if (posArr[1] === "right") {
            theBound.left = tarRect.right - wrapWidth;
            theBound.right = tarRect.right;
        } else if (posArr[1] === "top") {
            theBound.top = tarRect.top;
            theBound.bottom = tarRect.top + wrapHeight;
        } else if (posArr[1] === "bottom") {
            theBound.top = tarRect.bottom - wrapHeight;
            theBound.bottom = tarRect.bottom;
        } else {
            if (posArr[0] === "top" || posArr[0] === "bottom") {
                theBound.left = tarRect.left + tarRect.width / 2 - wrapWidth / 2;
                theBound.right = theBound.left + wrapWidth;
            } else {
                theBound.top = tarRect.top + tarRect.height / 2 - wrapHeight / 2;
                theBound.bottom = theBound.top + wrapHeight;
            }
        }

        return theBound;
    }
}

function getBackDir(dir) {
    switch (dir) {
        case "left":
            return "right";
        case "right":
            return "left";
        case "top":
            return "bottom";
        case "bottom":
            return "top";
    }
}

function getAnimate(dir) {
    let offset = 7;
    let fromXy = [0, offset];
    switch (dir) {
        case "top":
            fromXy = [0, offset];
            break;
        case "bottom":
            fromXy = [0, -offset];
            break;
        case "left":
            fromXy = [offset, 0];
            break;
        case "right":
            fromXy = [-offset, 0];
            break;
    }

    return {
        entry: {
            to: { opacity: 1, xy: [0, 0] },
            from: { opacity: 0, xy: fromXy },
            config: { mass: 1, tension: 285, friction: 26 },
        },
        exit: {
            from: { opacity: 1, xy: [0, 0] },
            to: { opacity: 0, xy: [0, 0] },
            config: { mass: 1, tension: 485, friction: 26 },
        },
    };
}
