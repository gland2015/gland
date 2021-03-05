import React from "react";
import { EventEmitter } from "events";

export * from "./FileDragProxy";

export interface DragWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    dragkey?: string;
    hoverkey?: string;
    stopDrag?: boolean;
    handleDrag?: (args: DragArgs) => any;
    getDragState?: (args: DragArgs, key, lastState) => any;
    getIsDataVaild?: (dragArgs: DragArgs) => boolean;
}

export interface DragArgs {
    type: "start" | "drag" | "end";
    wrapperElement: HTMLDivElement;
    initPageX: number;
    initPageY: number;
    curPageX: number;
    curPageY: number;
    dragkey: string;
    dragElement: HTMLDivElement;
    event: MouseEvent;

    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    offsetArea: 1 | 2 | 3 | 4;

    hoverkey: string;
    hoverElement: HTMLDivElement;

    isDataVaild: boolean;
    lastVaildData: any;
}

const DragWrapperContext = React.createContext(null as { event: EventEmitter; getDragState });

export function DragWrapper(props: DragWrapperProps) {
    const { dragkey, hoverkey, stopDrag, handleDrag, getDragState, getIsDataVaild, children, ...rest } = props;

    const attr = React.useRef({
        props,
        root: null as HTMLDivElement,
        contextValue: null,
    }).current;
    attr.props = props;

    React.useMemo(() => {
        attr.contextValue = {
            event: new EventEmitter(),
        };
        attr.contextValue.event.setMaxListeners(600);
    }, []);
    attr.contextValue.getDragState = getDragState;

    React.useEffect(() => {
        let isDown = false;
        let isDrag = false;
        let dragData = null;

        let initPageX = null,
            initPageY = null;

        let lastVaildData = null;

        function handleMouseDown(event: MouseEvent) {
            if (event.button !== 0) return;
            if (attr.props.stopDrag) return;

            let data = findDragElement(event.target);
            if (!data) return;

            dragData = data;
            isDown = true;
            initPageX = event.pageX;
            initPageY = event.pageY;

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        function handleMouseMove(event: MouseEvent) {
            if (event.buttons !== 1) {
                if (isDrag) {
                    removeEvent(event, true);
                }
                return;
            }
            if (!isDown) return;

            let isStart = false;

            if (!isDrag) {
                const offset = Math.abs(event.pageX - initPageX) + Math.abs(event.pageY - initPageY);
                if (offset < 5) {
                    return;
                }
                isDrag = true;
                isStart = true;
            }

            const dragArgs = getDragArgs(event, isStart ? "start" : "drag");
            // console.log('dragArgs', dragArgs)
            const isDataVaild = isStart ? true : getDataVaild(dragArgs);
            if (isDataVaild) {
                lastVaildData = dragArgs;
            }
            let theData = { ...dragArgs, isDataVaild, lastVaildData };

            attr.props.handleDrag && attr.props.handleDrag(theData);
            attr.contextValue.event.emit("drag", theData);
        }

        function handleMouseUp(event: MouseEvent) {
            setTimeout(() => {
                removeEvent(event);
            }, 0);
        }

        attr.root.addEventListener("mousedown", handleMouseDown);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            attr.root && attr.root.removeEventListener("mousedown", handleMouseDown);
        };

        function removeEvent(event: MouseEvent, isError?) {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);

            if (isDrag) {
                let dragArgs = getDragArgs(event, "end");

                const isDataVaild = isError ? false : getDataVaild(dragArgs);
                if (isDataVaild) {
                    lastVaildData = dragArgs;
                }

                let theData = { ...dragArgs, isDataVaild, lastVaildData };

                attr.props.handleDrag && attr.props.handleDrag(theData);
                attr.contextValue.event.emit("drag", theData);
            }

            isDown = false;
            isDrag = false;
            dragData = null;

            initPageX = null;
            initPageY = null;

            lastVaildData = null;
        }

        function getDataVaild(dragArgs) {
            let isDataVaild = false;

            if (attr.props.getIsDataVaild) {
                isDataVaild = attr.props.getIsDataVaild(dragArgs);
            } else if (hoverkey) {
                isDataVaild = true;
            }

            return isDataVaild;
        }

        function getDragArgs(event: MouseEvent, type) {
            let data = findHoverElement(event.target);
            let hoverkey = data?.key || null;
            let hoverElement = data?.element || null;

            return {
                type,
                event,
                dragkey: dragData.key,
                dragElement: dragData.element,
                hoverkey,
                hoverElement,
                wrapperElement: attr.root,

                initPageX,
                initPageY,
                curPageX: event.pageX,
                curPageY: event.pageY,

                ...getMouseOffset(hoverkey && (event.target as any), event.x, event.y),
            };
        }

        function getMouseOffset(target: HTMLDivElement, x, y) {
            if (!target) return {} as any;
            let rect = target.getBoundingClientRect();
            let offsetArea = 1;

            const width = rect.width;
            const height = rect.height;
            const offsetX = x - rect.x;
            const offsetY = y - rect.y;

            if (offsetX > width / 2) {
                offsetArea = 2;
            }

            if (offsetY > height / 2) {
                offsetArea += 2;
            }

            return {
                width,
                height,
                offsetX,
                offsetY,
                offsetArea,
            };
        }

        function findDragElement(target) {
            return findElement(target, attr.props.dragkey || "dragkey");
        }

        function findHoverElement(target) {
            return findElement(target, attr.props.hoverkey || "hoverkey");
        }

        function findElement(target, keyName) {
            let element = target;
            let key;
            while (element) {
                if (element === attr.root || element === document.documentElement) break;

                key = element.dataset[keyName];
                if (key) break;
                element = element.parentElement;
            }

            if (key) {
                return {
                    key,
                    element,
                };
            }

            return null;
        }
    }, []);

    return (
        <DragWrapperContext.Provider value={attr.contextValue}>
            <div ref={(r) => (attr.root = r)} {...rest}>
                {children}
            </div>
        </DragWrapperContext.Provider>
    );
}

export function useDragState(key) {
    const context = React.useContext(DragWrapperContext);
    const [state, setState] = React.useState(null);

    React.useEffect(() => {
        if (!context) return;

        let lastState;

        function handleDrag(data) {
            let dragState = context.getDragState && context.getDragState(data, key, lastState);
            lastState = dragState;
            setState(dragState || null);
        }

        context.event.on("drag", handleDrag);

        return () => {
            context.event.off("drag", handleDrag);
        };
    }, [key]);

    return state;
}
