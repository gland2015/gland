import React from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

import { Modal, FabricButton, TextInput, ChoiceGroup } from "@/components/fluent";

import { ToolAttr } from "../utils";
import { toolClasses as classes } from "../style";

function reducer(state, action) {
    let newState = state;
    let type = action?.type;
    let payload = action?.payload;

    if (type === "OpenModal") {
        return Object.assign({}, state, {
            open: true,
            type: payload.key ? payload.type : "block",
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
        type: "block",
        key: "",
        data: null,
    };
}

export function FormulaEditModal(props: { attr: ToolAttr }) {
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

        attr.event.on(attr.editEvent.openEditFormula, OpenEdit);

        return () => {
            attr.event.off(attr.editEvent.openEditFormula, OpenEdit);
        };
    }, []);

    return (
        <Modal
            title="编辑公式"
            isOpen={state.open}
            style={{ minWidth: 550 }}
            onDismiss={(event, from) => {
                dispatch({ type: "CloseModal" });
                attr.event.emit(attr.editEvent.focus);
            }}
        >
            <div className={classes.formulaIpt}>
                <TextInput
                    label="katex代码"
                    multiline
                    autoAdjustHeight
                    autoFocus
                    value={state.data?.value || ""}
                    onChange={(e) => {
                        dispatch({
                            type: "StateChange",
                            payload: {
                                data: { value: e.target.value },
                            },
                        });
                    }}
                />
            </div>
            <div className={classes.formulaRd}>{state.data?.value ? <BlockMath math={state.data?.value} /> : null}</div>
            {state.key ? null : (
                <div className={classes.formulaType}>
                    <span className={classes.label}>类型：</span>
                    <ChoiceGroup
                        selectedKey={state.type}
                        options={[
                            { key: "block", text: "块级" },
                            { key: "inline", text: "内联" },
                        ]}
                        onChange={(item) => {
                            dispatch({
                                type: "StateChange",
                                payload: {
                                    type: item.key,
                                },
                            });
                        }}
                    />
                </div>
            )}
            <div className={classes.modalFooter}>
                <FabricButton
                    color="primary"
                    onClick={() => {
                        dispatch({ type: "CloseModal" });

                        if (state.type === "inline") {
                            if (state.key) {
                                attr.event.emit(attr.editEvent.editInlineFormula, {
                                    key: state.key,
                                    data: state.data,
                                });
                            } else {
                                attr.event.emit(attr.editEvent.addInlineFormula, state.data);
                            }
                        } else {
                            if (state.key) {
                                attr.event.emit(attr.editEvent.editFormula, {
                                    key: state.key,
                                    data: state.data,
                                });
                            } else {
                                attr.event.emit(attr.editEvent.addFormula, state.data);
                            }
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
