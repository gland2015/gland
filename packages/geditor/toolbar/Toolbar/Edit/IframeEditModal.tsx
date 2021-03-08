import React from "react";
import { FabricButton } from "@gland/react/button";
import { Modal } from "@gland/react/modal";
import { TextInput } from "@gland/react/input";
import { ChoiceGroup } from "@gland/react/radio";
import { ToolAttr } from "../utils";
import { toolClasses as classes } from "../style";
import { CodeMirror } from "@gland/react/common/CodeMirror";

function reducer(state, action) {
    let newState = state;
    let type = action?.type;
    let payload = action?.payload;

    if (type === "OpenModal") {
        let catalog = payload.data?.catalog || lastCatalog;
        return Object.assign({}, state, {
            open: true,
            loading: false,
            key: payload.key,
            data: {
                catalog,
                align: payload.data?.align || "center",
                value: payload.data?.value || "",
                width: payload.data?.width || 640,
                height: payload.data?.height || 360,
            },
            href: payload.key && catalog === "0" ? payload.data?.value || "" : "",
            html: payload.key && catalog === "1" ? payload.data?.value || getDefaultHtml() : getDefaultHtml(),
        });
    } else if (type === "StateChange") {
        return Object.assign({}, state, payload);
    } else if (type == "CloseModal") {
        return Object.assign({}, state, {
            open: false,
            loading: false,
        });
    }

    return newState;
}

function initer(props) {
    return {
        open: false,
        loading: false,
        key: "",
        data: {
            catalog: "0",
            align: "center",
            value: "",
            width: 640,
            height: 360,
        },
        href: "",
        html: "",
    };
}

let lastCatalog = "0";

const codeOptions = {
    mode: "htmlmixed",
    theme: "material",
    lineNumbers: true,
};

export function IframeEditModal(props: { attr: ToolAttr }) {
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

        attr.event.on(attr.editEvent.openEditIframe, OpenEdit);

        return () => {
            attr.event.off(attr.editEvent.openEditIframe, OpenEdit);
        };
    }, []);

    const modalAttr = React.useRef({} as { input }).current;

    return (
        <Modal
            title={lang.other.iframeEdit}
            isOpen={state.open}
            style={{ minWidth: 780 }}
            animation="slideDown"
            onDismiss={(event, from) => {
                if (state.loading) return;
                dispatch({ type: "CloseModal" });
                attr.event.emit(attr.editEvent.focus);
            }}
        >
            <div>
                <div className={classes.iptLine}>
                    <span className={classes.label}>{lang.other.iframeFrom}</span>
                    <ChoiceGroup
                        options={[
                            { key: "0", text: lang.base.link },
                            { key: "1", text: lang.base.editCode },
                        ]}
                        selectedKey={state.data.catalog}
                        onChange={(item) => {
                            dispatch({
                                type: "StateChange",
                                payload: {
                                    data: {
                                        ...state.data,
                                        catalog: item.key,
                                    },
                                },
                            });
                            lastCatalog = item.key;
                        }}
                    />
                </div>
                <div className={classes.iptLine}>
                    {state.data.catalog === "0" ? (
                        <TextInput
                            label={lang.other.linkAddress}
                            value={state.href}
                            underlined
                            style={{ width: "100%", fontSize: 16 }}
                            onChange={(e) => {
                                dispatch({
                                    type: "StateChange",
                                    payload: {
                                        href: e.target.value,
                                    },
                                });
                            }}
                        />
                    ) : (
                        <div style={{ width: 730 }}>
                            <CodeMirror
                                autoCursor
                                value={state.html}
                                options={codeOptions}
                                onBeforeChange={(editor, data, value) => {
                                    dispatch({
                                        type: "StateChange",
                                        payload: {
                                            html: value,
                                        },
                                    });
                                }}
                            />
                        </div>
                    )}
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
                <div className={classes.twoCol}>
                    <div className={classes.twoColItem}>
                        <TextInput
                            label={lang.base.width}
                            type="number"
                            value={state.data?.width || ""}
                            className={classes.twoColIpt}
                            onChange={(e) => {
                                dispatch({
                                    type: "StateChange",
                                    payload: {
                                        data: Object.assign({}, state.data, { width: e.target.value }),
                                    },
                                });
                            }}
                        />
                    </div>
                    <div className={classes.twoColItem}>
                        <TextInput
                            label={lang.base.height}
                            type="number"
                            value={state.data?.height || ""}
                            className={classes.twoColIpt}
                            onChange={(e) => {
                                dispatch({
                                    type: "StateChange",
                                    payload: {
                                        data: Object.assign({}, state.data, { height: e.target.value }),
                                    },
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className={classes.modalFooter}>
                <FabricButton
                    color="primary"
                    loading={state.loading}
                    onClick={() => {
                        dispatch({ type: "CloseModal" });

                        let key = state.key;
                        let data = Object.assign({}, state.data);

                        if (data.catalog === "0") {
                            data.value = state.href;
                        } else {
                            data.value = state.html;
                        }

                        data.width = parseInt(data.width) || 640;
                        data.height = parseInt(data.height) || 360;

                        if (key) {
                            attr.event.emit(attr.editEvent.editIframe, {
                                key,
                                data,
                            });
                        } else {
                            attr.event.emit(attr.editEvent.addIframe, data);
                        }
                    }}
                >
                    {lang.base.confirm}
                </FabricButton>
                <FabricButton
                    style={{ marginLeft: 20 }}
                    onClick={(e) => {
                        if (state.loading) return;

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

function getDefaultHtml() {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8' />
    <style>
        canvas {
            user-select: none;
        }

        html,
        body {
            padding: 0;
            margin: 0;
            height: 100%;
            width: 100%;
        }
    </style>
</head>
<body>

    <script>
       
    </script>
</body>
</html>
`;
}
