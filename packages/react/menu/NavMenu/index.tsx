import React from "react";
import { animated, useSpring } from "react-spring";
import clsx from "clsx";
import { EventEmitter } from "events";

import { fluentIcon } from "../../common/asset/icons";
import { DragWrapper, useDragState, DragArgs, FileDragProxy } from "../../common/DragWrapper";
import { Collapse } from "../../common/Collapse";

import { paddingInc, jssStyle, classes, rootKey, NavMenuProps, ListItem, TreeProps, TreeLeafProps, TreeGroupProps } from "./utils";
import { FileProxyComp } from "./widget";

const MenuContext = React.createContext(null);

export const NavMenu = React.memo(function (props: NavMenuProps) {
    if (!jssStyle.attached) {
        jssStyle.attach();
    }

    const {
        list,
        map,
        className,
        paddingLeft,
        selectedKey,
        isDisableDrag,
        stopDrag,
        handleDrop,
        handleSelect,
        isFreeDrop,
        handleContextMenu,
        ...rest
    } = props;

    const rcls = clsx(classes.root, className);

    const attr = React.useRef({} as { event: EventEmitter }).current;
    React.useMemo(() => {
        attr.event = new EventEmitter();
    }, []);

    return (
        <MenuContext.Provider
            value={{
                paddingLeft: paddingLeft || 0,
                selectedKey,
                map,
                isDisableDrag,
                handleSelect,
                handleContextMenu,
                isFreeDrop,
            }}
        >
            <DragWrapper
                {...rest}
                className={rcls}
                getDragState={getDragState}
                handleDrag={handleDrag}
                getIsDataVaild={getIsDataVaild}
                stopDrag={stopDrag}
            >
                <TreeRoot list={list} />
                <FileDragProxy event={attr.event} Comp={FileProxyComp} map={map} />
            </DragWrapper>
        </MenuContext.Provider>
    );

    function handleDrag(dragArgs: DragArgs) {
        attr.event.emit("dragevent", dragArgs);

        if (dragArgs.type === "end" && dragArgs.isDataVaild) {
            const dragKey = dragArgs.dragkey;

            if (isFreeDrop) {
                if (dragArgs.hoverkey && dragArgs.hoverkey !== rootKey) {
                    const pos = {
                        parentId: "",
                    } as any;

                    let str = getIsHover(dragArgs, dragArgs.hoverkey);

                    if (str === "3") {
                        pos.parentId = dragArgs.hoverkey;
                        pos["first"] = true;
                    } else {
                        if (str === "1") {
                            pos["left"] = map.getLftSibling(dragArgs.hoverkey);
                            pos["right"] = dragArgs.hoverkey;
                        } else {
                            pos["left"] = dragArgs.hoverkey;
                            pos["right"] = map.getRgtSibling(dragArgs.hoverkey);
                        }
                        pos.parentId = map.getParentId(dragArgs.hoverkey) || "";
                    }

                    if (pos.left === dragKey || pos.right === dragKey) return;
                    handleDrop && handleDrop(dragKey, pos);
                }
            } else {
                let tarDropKey = getTarDropKey(dragArgs.dragkey, dragArgs.hoverkey);
                if (tarDropKey) {
                    let parentId = "";
                    if (tarDropKey !== rootKey) {
                        parentId = tarDropKey;
                    }
                    handleDrop && handleDrop(dragKey, { parentId });
                }
            }
        }
    }

    function getIsHover(dragArgs: DragArgs, key) {
        let isHover;

        let y = dragArgs.offsetY;
        let h2 = dragArgs.height / 2;
        let h3 = dragArgs.height / 3;

        const data = map.get(key);
        const dragParentId = map.getParentId(dragArgs.dragkey);

        if (data.isGroupNode && dragParentId !== key) {
            if (y <= h3) {
                isHover = "1";
            } else if (y <= h3 * 2) {
                isHover = "3";
            } else {
                isHover = "2";
            }
        } else {
            if (y < h2) {
                isHover = "1";
            } else {
                isHover = "2";
            }
        }

        return isHover;
    }

    function getTarDropKey(dragkey, hoverkey) {
        const hData = map.get(hoverkey);
        const tarDropKey = hData?.isGroupNode ? hoverkey : map.getParentId(hoverkey) || rootKey;

        if (tarDropKey !== (map.getParentId(dragkey) || rootKey)) {
            return tarDropKey;
        }
    }

    function getDragState(dragArgs: DragArgs, key, lastState) {
        if (dragArgs.type === "end") return null;

        let isDrag = "0";
        let isHover = "0";

        if (isFreeDrop) {
            // 自由拖放
            if (rootKey === key) return null;

            if (dragArgs.dragkey === key) {
                isDrag = "1";
            } else if (dragArgs.isDataVaild && dragArgs.hoverkey === key) {
                isHover = getIsHover(dragArgs, key);
            }
        } else {
            // 文件夹施放
            if (rootKey === key) {
                isDrag = "1";
            }

            if (dragArgs.dragkey === key) {
                isDrag = "1";
            } else if (dragArgs.isDataVaild && dragArgs.hoverkey) {
                let tarDropKey = getTarDropKey(dragArgs.dragkey, dragArgs.hoverkey);
                if (tarDropKey === key) {
                    isHover = "1";
                }
            }
        }

        let r = isDrag + isHover;

        if (r === "00") r = null;
        return r;
    }

    function getIsDataVaild(dragArgs) {
        if (!dragArgs.hoverkey) return false;
        return !map.isDescendantOf(dragArgs.hoverkey, dragArgs.dragkey) && dragArgs.hoverkey !== dragArgs.dragkey;
    }
});

function TreeRoot(props) {
    let dragState = useDragState(rootKey);

    let cls = clsx(
        dragState && dragState[0] === "1" ? classes.clearTreeItemHover : null,
        dragState && dragState[1] === "1" ? classes.groupInHover : null
    );

    return (
        <div className={cls}>
            <Tree list={props.list} level={1} />
            <div className={classes.treeRoot} data-hoverkey={rootKey} />
        </div>
    );
}

function Tree(props: TreeProps) {
    return (
        <div>
            {props.list.map(function (item, index) {
                return item.isGroupNode ? (
                    <TreeGroupItem key={item.key} item={item} level={props.level} />
                ) : (
                    <TreeLeafItem key={item.key} item={item} level={props.level} />
                );
            })}
        </div>
    );
}

function TreeLeafItem(props: TreeLeafProps) {
    const key = props.item.key;

    const dragState = useDragState(key);

    const ctx = React.useContext(MenuContext);

    const inDrag = dragState && dragState[0] === "1";

    const rcls = clsx(classes.treeItem, ctx.selectedKey === key ? classes.selectedItem : null, inDrag ? classes.itemInDrag : null);

    return (
        <div
            className={classes.treeItemWrapper}
            data-dragkey={key}
            data-hoverkey={key}
            onClick={
                inDrag
                    ? null
                    : () => {
                          ctx.handleSelect && ctx.handleSelect(props.item);
                      }
            }
            onContextMenu={(event) => {
                ctx.handleContextMenu && ctx.handleContextMenu(event, props.item);
            }}
        >
            <div className={rcls} style={{ paddingLeft: ctx.paddingLeft + props.level * paddingInc + "em" }}>
                <div>{props.item.name}</div>
            </div>
            {ctx.isFreeDrop && dragState && dragState[1] !== "0" ? (
                <div className={classes.itemDropLine} style={dragState[1] === "1" ? { top: 0 } : { bottom: 0 }}></div>
            ) : null}
        </div>
    );
}

function TreeGroupItem(props: TreeGroupProps) {
    const [isOpen, setOpen] = React.useState(props.item.defaultOpen || false);
    const ctx = React.useContext(MenuContext);

    const key = props.item.key;

    const { transform } = useSpring({
        from: { transform: "translate3d(20px,0,0)" },
        to: { transform: `translate3d(${isOpen ? 0 : 20}px,0,0)` },
    }) as any;

    React.useEffect(() => {
        if (!isOpen && ctx.selectedKey && ctx.map) {
            if (ctx.map.isDescendantOf(ctx.selectedKey, key) || ctx.selectedKey === key) {
                setOpen(true);
            }
        }
    }, [ctx.selectedKey]);

    const dragState = useDragState(key);

    let cls = null;
    if (dragState) {
        if (dragState[0] === "1") {
            cls = classes.itemInDrag;
        } else if (dragState[1] === "1") {
            cls = classes.groupInHover;
        }
    }

    return (
        <div className={cls}>
            <div
                className={classes.treeItemWrapper}
                data-dragkey={key}
                data-hoverkey={key}
                onClick={() => {
                    setOpen(!isOpen);
                }}
                onContextMenu={(event) => {
                    ctx.handleContextMenu && ctx.handleContextMenu(event, props.item);
                }}
            >
                <div className={clsx(classes.treeItem)} style={{ paddingLeft: ctx.paddingLeft + (props.level - 1) * paddingInc + "em" }}>
                    <div className={classes.openIcon}>{isOpen ? <fluentIcon.ChevronUpIcon /> : <fluentIcon.ChevronDownIcon />}</div>
                    <div>{props.item.name}</div>
                </div>
                {ctx.isFreeDrop && dragState && (dragState[1] === "1" || dragState[1] === "2") ? (
                    <div className={classes.itemDropLine} style={dragState[1] === "1" ? { top: 0 } : { bottom: 0 }}></div>
                ) : null}
            </div>
            <Collapse className={classes.treeGroupChild} show={isOpen} fade={true}>
                <animated.div style={{ transform }}>
                    <Tree list={props.item.children} level={props.level + 1} />
                </animated.div>
            </Collapse>
        </div>
    );
}
