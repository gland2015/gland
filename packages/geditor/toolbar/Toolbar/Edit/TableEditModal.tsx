import React from "react";
import { FabricButton } from "@gland/react/button";
import { Modal } from "@gland/react/modal";
import { TextInput } from "@gland/react/input";
import { ChoiceGroup } from "@gland/react/radio";
import { ToolAttr } from "../utils";
import { toolClasses as classes } from "../style";

function reducer(state, action) {
    let newState = state;
    let type = action?.type;
    let payload = action?.payload;

    if (type === "OpenModal") {
        return Object.assign({}, state, {
            open: true,
            key: payload.key,
            data: payload.data,
        });
    } else if (type === "StateChange") {
        return Object.assign({}, state, payload);
    } else if (type == "CloseModal") {
        return Object.assign({}, state, {
            open: false,
        });
    }

    return newState;
}

function initer(props) {
    return {
        open: false,
        key: "",
        data: {
            column: 4,
            row: 4,
            widthType: "auto",
            width: 500,
            align: "center",
        },
    };
}

export function TableEditModal(props: { attr: ToolAttr }) {
    const [state, dispatch] = React.useReducer(reducer, props, initer);

    const attr = props.attr;

    React.useEffect(() => {
        const attr = props.attr;

        function OpenEdit(options) {
            dispatch({
                type: "OpenModal",
                payload: options,
            });
        }

        attr.event.on(attr.editEvent.openEditTable, OpenEdit);

        return () => {
            attr.event.off(attr.editEvent.openEditTable, OpenEdit);
        };
    }, []);

    return (
        <Modal
            title="编辑表格"
            isOpen={state.open}
            style={{ minWidth: 500 }}
            onDismiss={(event, from) => {
                dispatch({ type: "CloseModal" });
                attr.event.emit(attr.editEvent.focus);
            }}
        >
            <div>
                {state.key ? null : (
                    <div className={classes.twoCol}>
                        <div className={classes.twoColItem}>
                            <TextInput
                                label="行数"
                                type="number"
                                value={state.data?.row || ""}
                                className={classes.twoColIpt}
                                onChange={(e) => {
                                    dispatch({
                                        type: "StateChange",
                                        payload: {
                                            data: Object.assign({}, state.data, { row: e.target.value }),
                                        },
                                    });
                                }}
                            />
                        </div>
                        <div className={classes.twoColItem}>
                            <TextInput
                                label="列数"
                                type="number"
                                value={state.data?.column || ""}
                                className={classes.twoColIpt}
                                onChange={(e) => {
                                    dispatch({
                                        type: "StateChange",
                                        payload: {
                                            data: Object.assign({}, state.data, { column: e.target.value }),
                                        },
                                    });
                                }}
                            />
                        </div>
                    </div>
                )}
                <div className={classes.iptLine}>
                    <span className={classes.label}>宽度：</span>
                    <ChoiceGroup
                        selectedKey={state.data?.widthType}
                        options={[
                            { key: "auto", text: "自动" },
                            { key: "px", text: "像素" },
                            { key: "rate", text: "百分比" },
                        ]}
                        onChange={(item) => {
                            let width = 500;
                            if (item.key === "rate") {
                                width = 50;
                            }

                            dispatch({
                                type: "StateChange",
                                payload: {
                                    data: Object.assign({}, state.data, { widthType: item.key, width }),
                                },
                            });
                        }}
                    />
                    {state.data?.widthType === "px" || state.data?.widthType === "rate" ? (
                        <TextInput
                            label=""
                            type="number"
                            value={state.data?.width || ""}
                            className={classes.smallIpt}
                            onChange={(e) => {
                                dispatch({
                                    type: "StateChange",
                                    payload: {
                                        data: Object.assign({}, state.data, { width: e.target.value }),
                                    },
                                });
                            }}
                        />
                    ) : null}
                </div>
                <div className={classes.iptLine}>
                    <span className={classes.label}>对齐：</span>
                    <ChoiceGroup
                        selectedKey={state.data?.align}
                        options={[
                            {
                                key: "center",
                                text: "居中",
                            },
                            {
                                key: "left",
                                text: "左对齐",
                            },
                            {
                                key: "right",
                                text: "右对齐",
                            },
                        ]}
                        onChange={(item) => {
                            dispatch({
                                type: "StateChange",
                                payload: {
                                    data: Object.assign({}, state.data, { align: item.key }),
                                },
                            });
                        }}
                    />
                </div>
            </div>
            <div className={classes.modalFooter}>
                <FabricButton
                    color="primary"
                    onClick={() => {
                        dispatch({ type: "CloseModal" });
                        let { row, column, widthType, width, align } = state.data;

                        if (widthType === "px") {
                            width = parseInt(width);
                            if (isNaN(width) || width < 50) {
                                width = 500;
                            }
                        } else if (widthType === "rate") {
                            width = parseInt(width);
                            if (isNaN(width) || width < 5) {
                                width = 50;
                            }
                            if (width > 95) {
                                width = 95;
                            }
                        } else {
                            width = 500;
                        }

                        if (state.key) {
                            attr.event.emit(attr.editEvent.editTableAttr, {
                                key: state.key,
                                data: {
                                    row,
                                    column,
                                    widthType,
                                    width,
                                    align,
                                },
                            });
                        } else {
                            row = parseInt(row);
                            if (isNaN(row) || row < 1) {
                                row = 4;
                            }
                            if (row > 20) {
                                row = 20;
                            }

                            column = parseInt(column);
                            if (isNaN(column) || column < 1) {
                                column = 4;
                            }
                            if (column > 10) {
                                column = 10;
                            }

                            attr.event.emit(attr.editEvent.addTable, {
                                row,
                                column,
                                widthType,
                                width,
                                align,
                            });
                        }
                    }}
                >
                    确定
                </FabricButton>
                <FabricButton
                    style={{ marginLeft: 20 }}
                    onClick={(e) => {
                        dispatch({ type: "CloseModal" });
                        attr.event.emit(attr.editEvent.focus);
                    }}
                >
                    取消
                </FabricButton>
            </div>
        </Modal>
    );
}
