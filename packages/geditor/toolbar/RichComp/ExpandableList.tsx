import React from "react";
import clsx from "clsx";
import { TargetContext } from "@gland/geditor/core";
import { icons } from "../icons";
import { richClasses as classes } from "../style";

import { Collapse } from "@/components/common";

export function ExpandableList(props) {
    const target: any = React.useContext(TargetContext);
    let isSelected = false;

    if (!props.context.readOnly && target.key) {
        if (props.head.key === target.key) {
            isSelected = true;
        } else if (props.childs) {
            isSelected = getIsSelected(props.childs, target.key) === true ? true : false;
        }
    }

    return <Content props={props} targetKey={isSelected ? target.key : null} />;
}

function getIsSelected(childs, key) {
    for (let i = 0; i < childs.length; i++) {
        const item = childs[i];
        if (item.props.subwrapper) {
            const is = getIsSelected(item.props.childs, key);
            if (typeof is === "boolean") {
                return is;
            }
            continue;
        }

        if (item.key === key) {
            return item.props.subblock ? false : true;
        }
    }
}

const Content = React.memo(function (props: any) {
    const { context, data, head, childs } = props.props;
    const targetKey = props.targetKey;

    const [open, setOpen] = React.useState(data.open);

    React.useEffect(() => {
        if (open || context.readOnly) return;
        setOpen(true);
        data.open = true;
    }, [childs?.length]);

    React.useEffect(() => {
        if (open || context.readOnly) return;
        if (targetKey && targetKey !== head.key) {
            setOpen(true);
            data.open = true;
        }
    }, [targetKey]);

    return (
        <div className={clsx(classes.expandList, context.readOnly ? null : classes.expandList_e, targetKey ? classes.expandList_focus : null)}>
            <div
                className={classes.expandListHead}
                onClick={
                    context.readOnly
                        ? (e) => {
                              setOpen(!open);
                          }
                        : null
                }
            >
                <div
                    className={clsx(classes.expandListIcon, open ? null : classes.expandIcon_close)}
                    onMouseDown={handleMosuedown}
                    onClick={
                        context.readOnly
                            ? null
                            : () => {
                                  let newOpen = !open;
                                  data.open = newOpen;
                                  setOpen(newOpen);
                              }
                    }
                >
                    <icons.CaretDown />
                </div>
                <div className={classes.expandListTitle}>{head}</div>
            </div>
            <Collapse className={classes.expandContent} show={open}>
                {childs}
            </Collapse>
        </div>
    );
});

function handleMosuedown(event: React.MouseEvent) {
    event.preventDefault();
}
