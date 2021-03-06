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
    const lang = attr.lang;

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
            title={lang.other.linkEdit}
            isOpen={state.open}
            style={{ minWidth: 500 }}
            onDismiss={(event, from) => {
                dispatch({ type: "CloseModal" });
                attr.event.emit(attr.editEvent.focus);
            }}
        >
            <div style={{ minHeight: 50 }}>
                <TextInput
                    label={lang.other.linkAddress}
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
