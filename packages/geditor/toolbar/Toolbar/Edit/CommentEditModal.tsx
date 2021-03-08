import React from "react";
import { FabricButton } from "@gland/react/button";
import { Modal } from "@gland/react/modal";
import { TextInput } from "@gland/react/input";
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
    const lang = attr.lang;

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
            title={lang.other.commentEdit}
            isOpen={state.open}
            style={{ minWidth: 400 }}
            onDismiss={(event, from) => {
                dispatch({ type: "CloseModal" });
                attr.event.emit(attr.editEvent.focus);
            }}
        >
            <div style={{ minHeight: 50 }}>
                <TextInput
                    label={lang.base.title}
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
                    label={lang.base.description}
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
