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
    const lang = attr.lang;

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
            title={lang.other.tableEdit}
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
                                label={lang.other.rowNum}
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
                                label={lang.other.colNum}
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
                    <span className={classes.label}>{lang.base.width}</span>
                    <ChoiceGroup
                        selectedKey={state.data?.widthType}
                        options={[
                            { key: "auto", text: lang.base.auto },
                            { key: "px", text: lang.base.px },
                            { key: "rate", text: lang.base.rate },
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
                    <span className={classes.label}>{lang.base.align}: </span>
                    <ChoiceGroup
                        selectedKey={state.data?.align}
                        options={[
                            {
                                key: "center",
                                text: lang.base.centerAlign,
                            },
                            {
                                key: "left",
                                text: lang.base.leftAlign,
                            },
                            {
                                key: "right",
                                text: lang.base.rightAlign,
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
                    {lang.base.confirm}
                </FabricButton>
                <FabricButton
                    style={{ marginLeft: 20 }}
                    onClick={(e) => {
                        dispatch({ type: "CloseModal" });
                        attr.event.emit(attr.editEvent.focus);
                    }}
                >
                    {lang.base.cancel}
                </FabricButton>
            </div>
        </Modal>
    );
}
