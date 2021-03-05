import React from "react";
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
            key: payload.key,
            data: {
                title: payload.data?.title || "",
                description: payload.data?.description || "",
            },
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
            title: "",
            description: "",
        },
    };
}

export function CommentEditModal(props: { attr: ToolAttr }) {
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

        attr.event.on(attr.editEvent.openEditComment, OpenEdit);

        return () => {
            attr.event.off(attr.editEvent.openEditComment, OpenEdit);
        };
    }, []);

    return (
        <Modal
            title="编辑注释"
            isOpen={state.open}
            style={{ minWidth: 400 }}
            onDismiss={(event, from) => {
                dispatch({ type: "CloseModal" });
                attr.event.emit(attr.editEvent.focus);
            }}
        >
            <div style={{ minHeight: 50 }}>
                <TextInput
                    label="标题"
                    autoFocus
                    value={state.data.title}
                    onChange={(e) => {
                        dispatch({
                            type: "StateChange",
                            payload: {
                                data: {
                                    ...state.data,
                                    title: e.target.value,
                                },
                            },
                        });
                    }}
                />
            </div>
            <div>
                <TextInput
                    label="描述"
                    multiline
                    autoAdjustHeight
                    value={state.data.description}
                    onChange={(e) => {
                        dispatch({
                            type: "StateChange",
                            payload: {
                                data: {
                                    ...state.data,
                                    description: e.target.value,
                                },
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
                            attr.event.emit(attr.editEvent.editComment, {
                                key: state.key,
                                data: state.data,
                            });
                        } else {
                            attr.event.emit(attr.editEvent.addComment, state.data);
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
