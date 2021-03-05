import React from "react";
import { animated, useSpring, config } from "react-spring";
import clsx from "clsx";

import { jss } from "../jss";
import { useRefBound } from "../hooks/useRefBound";

const jssStyle = jss.createStyleSheet({
    root: {
        overflow: "hidden",
        willChange: "height, opacity",
    },
    content: {},
});

const classes = jssStyle.classes;

export interface CollapseProps extends React.HTMLAttributes<HTMLDivElement> {
    show?: boolean;
    children?: any;
    fade?: boolean;
}

export function Collapse(props: CollapseProps) {
    if (!jssStyle.attached) {
        jssStyle.attach();
    }

    const { children, show, style, className, fade, ...rest } = props;

    const attr = React.useRef({ time: 0, in: false, isFirst: true, isAutoHeight: false }).current;
    const ref = React.useRef(null);

    const bound = useRefBound(ref, () => {
        return show ? !attr.isAutoHeight : false;
    });

    React.useMemo(() => {
        attr.in = false;
    }, [bound]);

    React.useMemo(() => {
        if (attr.time >= 1) {
            attr.isFirst = false;
        } else {
            attr.time++;
        }

        if (attr.isFirst) {
            attr.in = false;
        } else {
            attr.in = true;
        }
    }, [show]);

    const { height, opacity } = useSpring({
        from: { height: 0, opacity: 0 },
        to: { height: show ? bound?.height || 0 : 0, opacity: show ? 1 : 0 },
        immediate: attr.isFirst,
        onRest() {
            attr.in = false;
        },
    });

    if (show && (attr.isFirst || !attr.in)) {
        attr.isAutoHeight = true;
    } else {
        attr.isAutoHeight = false;
    }

    const animatedStyle = { ...((style as any) || {}), height: attr.isAutoHeight ? "auto" : height };

    if (props.fade) {
        animatedStyle.opacity = opacity;
    }

    return (
        <animated.div style={animatedStyle} className={clsx(classes.root, className)} {...rest}>
            <div ref={ref} className={classes.content}>
                {children}
            </div>
        </animated.div>
    );
}
