import React from "react";
import clsx from "clsx";

import { ContextualMenu, ContextWrapper } from "@gland/react/menu";
import { TargetContext } from "../../core";
import { richClasses as classes } from "../style";
import { editEvent } from "../editEvent";

export function Table(props) {
    const column = props.data.column;

    const rows = [];
    const keyMap = {
        [props.head.key]: true,
    };
    let cols = [];
    for (let i = 0; i < props.childs.length; i++) {
        const item = props.childs[i];
        keyMap[item.key] = true;
        cols.push(item);
        if (cols.length >= column) {
            rows.push(cols);
            cols = [];
        }
    }
    if (cols.length) {
        rows.push(cols);
    }

    return <TableWithTargetKey rows={rows} keyMap={keyMap} props={props} />;
}

function TableWithTargetKey(props) {
    const { rows, keyMap } = props;
    let target: any = React.useContext(TargetContext);

    const isSelected = !props.props.context.readOnly && Boolean(keyMap[target.key]);

    let targetKey = isSelected ? target.key : null;

    return <TableRender targetKey={targetKey} rows={rows} props={props.props} />;
}

const TableRender = React.memo(function (props: any) {
    const { rows, targetKey } = props;
    let { data, context, head } = props.props;
    const { widthType, width, align } = data;
    const { readOnly } = context;
    const blockKey = head.key;

    let w = null;
    if (width) {
        if (widthType === "rate") {
            w = width + "%";
        } else if (widthType === "px") {
            w = width + "px";
        }
    }

    const attr = React.useMemo(
        () => ({
            right: null,
        }),
        []
    );

    return (
        <div
            className={clsx("smallScroll", classes.tableRoot, readOnly ? null : classes.tableRoot_e)}
            style={
                align === "left" || align === "right"
                    ? {
                          float: align,
                      }
                    : null
            }
        >
            <div className={clsx(classes.tableContent, targetKey ? classes.tableContent_focus : null)} style={w ? { width: w } : null}>
                {rows.map(function (row, i) {
                    return (
                        <div key={row[0].key} className={classes.tableRow}>
                            {row.map(function (item, j) {
                                return (
                                    <div
                                        key={item.key}
                                        className={clsx(classes.tableCol, targetKey === item.key ? classes.tableCol_fcous : null)}
                                        onContextMenu={
                                            readOnly
                                                ? null
                                                : (event) => {
                                                      event.preventDefault();
                                                      attr.right.show({
                                                          top: event.clientY,
                                                          left: event.clientX,
                                                          point: [i, j],
                                                      });
                                                  }
                                        }
                                    >
                                        {item}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            {readOnly ? null : <RightContext ref={(r) => (attr.right = r)} event={context.event} rows={rows} blockKey={blockKey} tableData={data} />}
        </div>
    );
});

export const RightContext = React.forwardRef(function (props: any, ref) {
    let [opt, setOpt] = React.useState(null);
    let [show, setShow] = React.useState(false);

    const { event, rows, blockKey, tableData } = props;

    React.useImperativeHandle(ref, () => ({
        show(opt) {
            setOpt(opt);
            setShow(true);
        },
    }));

    const items = React.useMemo(() => {
        if (!opt) return [];

        const { point } = opt;

        let disRow = false;
        let disCol = false;

        if (rows.length >= 20) {
            disRow = true;
        }

        if (rows[0].length >= 10) {
            disCol = true;
        }

        let data = {
            point,
        };

        return [
            {
                key: "col-left",
                text: "左增列",
                data,
                disabled: disCol,
            },
            {
                key: "col-right",
                text: "右增列",
                data,
                disabled: disCol,
            },
            {
                key: "row-up",
                text: "上增行",
                data,
                disabled: disRow,
            },
            {
                key: "row-down",
                text: "下增行",
                data,
                disabled: disRow,
            },
            {
                key: "d1",
                type: "divider" as any,
            },
            {
                key: "col-del",
                text: "删除列",
                data,
            },
            {
                key: "row-del",
                text: "删除行",
                data,
            },
            {
                key: "d2",
                type: "divider",
            },
            {
                key: "table-attr",
                text: "表格属性",
                data,
            },
        ];
    }, [opt]);

    return (
        <ContextWrapper
            show={show}
            left={opt?.left}
            top={opt?.top}
            onClose={() => {
                setShow(false);
            }}
        >
            <ContextualMenu
                style={{ minWidth: 100 }}
                items={items}
                onMenuClick={(item) => {
                    setShow(false);

                    const type = item.key;
                    const data = item.data;

                    let numTypes = ["col-left", "col-right", "row-up", "row-down", "col-del", "row-del"];

                    if (numTypes.indexOf(type) !== -1) {
                        event.emit(editEvent.editTableNum, {
                            key: blockKey,
                            type,
                            point: data.point,
                            rows,
                        });
                    } else if (type === "table-attr") {
                        event.emit(editEvent.openEditTable, {
                            key: blockKey,
                            data: tableData,
                        });
                    }
                }}
            />
        </ContextWrapper>
    );
});
