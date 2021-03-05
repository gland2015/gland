import React from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";

import { jss } from "../../common/jss";
import { createFadeMoveIn, AnimateDiv } from "../../common/Animation";

const fadeMoveIn = createFadeMoveIn({ timeout: 300, translateY: 5 });

interface ContextWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    show: boolean;
    left: number | string;
    top: number | string;
    onClose?: any;
}

const jssSheet = jss.createStyleSheet({
    root: {
        position: "absolute",
        zIndex: 1,
    },
});

export const classes = jssSheet.classes;

export function ContextWrapper(props: ContextWrapperProps) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }
    const { show, left, top, onClose, children, className, style, ...rest } = props;

    const attr = React.useRef({}).current as any;
    attr.onClose = onClose;

    React.useEffect(() => {
        if (show) {
            function handleClick(event) {
                let target = event.target;

                if (!attr.current) return;
                if (attr.current.contains(target)) return;

                attr.onClose && attr.onClose(event);
            }

            document.addEventListener("click", handleClick);

            return () => {
                document.removeEventListener("click", handleClick);
            };
        }
    }, [show]);

    return ReactDOM.createPortal(
        <AnimateDiv
            {...fadeMoveIn}
            in={show}
            className={clsx(classes.root, className)}
            style={{ ...(style || {}), top, left }}
            divProps={{
                ...rest,
                ref: (r) => (attr.current = r),
            }}
        >
            {children}
        </AnimateDiv>,
        document.body
    );
}
