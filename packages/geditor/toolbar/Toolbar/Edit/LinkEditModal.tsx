import React from "react";
import { Modal, FabricButton, TextInput } from "@/components/fluent";

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
            data: { url: payload.data?.url || "" },
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
        data: null,
    };
}

export function LinkEditModal(props: { attr: ToolAttr }) {
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

        attr.event.on(attr.editEvent.openEditLink, OpenEdit);

        return () => {
            attr.event.off(attr.editEvent.openEditLink, OpenEdit);
        };
    }, []);

    return (
        <Modal
            title="编辑链接"
            isOpen={state.open}
            style={{ minWidth: 500 }}
            onDismiss={(event, from) => {
                dispatch({ type: "CloseModal" });
                attr.event.emit(attr.editEvent.focus);
            }}
        >
            <div style={{ minHeight: 50 }}>
                <TextInput
                    label="链接地址"
                    autoFocus
                    value={state.data?.url || ""}
                    onChange={(e) => {
                        dispatch({
                            type: "StateChange",
                            payload: {
                                data: { url: e.target.value },
                            },
                        });
                    }}
                />
            </div>

            <div className={classes.modalFooter}>
                <FabricButton
                    color="primary"
                    onClick={() => {
                        dispatch({ type: "CloseModal" });

                        if (state.key) {
                            attr.event.emit(attr.editEvent.editLink, {
                                key: state.key,
                                data: state.data,
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
