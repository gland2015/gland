import React from "react";
import ReactDOM from "react-dom";
import { EventEmitter } from "events";
import clsx from "clsx";
import { jss } from "../jss";

const jssStyle = jss.createStyleSheet({
    root: {
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        padding: 4,
        backgroundColor: "#c7e0f4",
        borderRadius: 5,
        maxWidth: 400,
        overflow: "hidden",
        textOverflow: "ellipsis",
        zIndex: 1000,
    },
    icon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "1.5em",
        height: "1.5em",
        marginRight: 7,
    },
});

const classes = jssStyle.classes;

interface FileDragProxyProps {
    event: EventEmitter;
    Comp: any;
    map: any;
    className?: string;
    style?: React.CSSProperties;
}

export function FileDragProxy(props: FileDragProxyProps) {
    if (!jssStyle.attached) {
        jssStyle.attach();
    }

    const [show, setShow] = React.useState(false);
    const attr = React.useRef({} as any).current;
    attr.show = show;
    attr.map = props.map;

    React.useEffect(() => {
        const event = props.event;

        function handleDragEvent(args) {
            if (!attr.show) {
                attr.left = args.curPageX;
                attr.top = args.curPageY;
                attr.data = attr.map.get(args.dragkey);
                setShow(true);
            } else if (attr.root) {
                const root: HTMLDivElement = attr.root;
                root.style.left = args.curPageX + "px";
                root.style.top = args.curPageY + 5 + "px";
            }

            if (args.type === "end") {
                setShow(false);
            }
        }

        event.on("dragevent", handleDragEvent);

        return () => {
            event.off("dragevent", handleDragEvent);
        };
    }, []);

    if (!show) return null;

    return ReactDOM.createPortal(
        <div
            ref={(r) => (attr.root = r)}
            style={{ ...(props.style || {}), left: attr.left, top: attr.top }}
            className={clsx(classes.root, props.className)}
        >
            <props.Comp data={attr.data} iconCls={classes.icon} />
        </div>,
        document.body
    );
}
