import React from "react";
import { Modal } from "@gland/react/modal";
import { FabricButton } from "@gland/react/button";
import { TextInput } from "@gland/react/input";
import { ChoiceGroup } from "@gland/react/radio";
import { ToolAttr } from "../utils";
import { toolClasses as classes } from "../style";

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
                mediaId: payload.data?.mediaId || "",
                URL: payload.data?.URL || "",
                isRemote: payload.data?.isRemote || false,
                catalog,
                title: payload.data?.title || "",
                align: payload.data?.align || "center",
            },
            filename: "",
            href: payload.key && payload.data?.catalog === "0" ? payload.data?.URL || "" : "",
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
            mediaId: "",
            URL: "",
            isRemote: false,
            title: "",
            align: "center",
        },
        filename: "",
        href: "",
    };
}

let lastCatalog = "0";

export function AudioEditModal(props: { attr: ToolAttr }) {
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
        attr.event.on(attr.editEvent.openEditAudio, OpenEdit);
        return () => {
            attr.event.off(attr.editEvent.openEditAudio, OpenEdit);
        };
    }, []);

    const modalAttr = React.useRef({} as { input }).current;

    return (
        <Modal
            title={lang.other.audioEdit}
            isOpen={state.open}
            style={{ minWidth: 500 }}
            onDismiss={(event, from) => {
                if (state.loading) return;
                dispatch({ type: "CloseModal" });
                attr.event.emit(attr.editEvent.focus);
            }}
        >
            <div>
                <div className={classes.iptLine}>
                    <span className={classes.label}>{lang.other.audioFrom}：</span>
                    <ChoiceGroup
                        options={[
                            { key: "0", text: lang.base.link },
                            { key: "1", text: lang.base.upload },
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
                                    filename: "",
                                },
                            });
                            lastCatalog = item.key;
                        }}
                    />
                </div>
                <div className={classes.iptLine}>
                    {state.data.catalog === "0" ? (
                        <TextInput
                            label={lang.other.audioAddress}
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
                        <div className={classes.iptLine}>
                            <div className={classes.iptLine}>
                                <span className={classes.label}>{lang.other.audioNew}: </span> {state.filename || lang.base.unselected}
                            </div>
                            <FabricButton
                                color={"primary"}
                                style={{ fontSize: 12, marginLeft: 15 }}
                                onClick={(e) => {
                                    modalAttr.input.click();
                                }}
                            >
                                {lang.base.selectFile}
                            </FabricButton>
                            <input
                                ref={(r) => (modalAttr.input = r)}
                                style={{ display: "none" }}
                                type="file"
                                accept="audio/*"
                                onChange={(e) => {
                                    let filename = e.target.files[0].name;
                                    dispatch({ type: "StateChange", payload: { filename } });
                                }}
                            />
                        </div>
                    )}
                </div>
                <div className={classes.iptLine}>
                    <TextInput
                        label={lang.base.title}
                        value={state.data.title}
                        underlined
                        placeholder={lang.base.optional}
                        style={{ width: "100%", fontSize: 16 }}
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
                    loading={state.loading}
                    onClick={() => {
                        if (state.loading) return;

                        let key = state.key;
                        let data = Object.assign({}, state.data);

                        if (data.catalog === "0") {
                            data.URL = state.href;
                            delete data.mediaId;
                            delete data.isRemote;
                            writeData();
                        } else {
                            let file = modalAttr.input.files;
                            file = file && file[0];

                            if (!file) {
                                writeData();
                            } else {
                                const remote = props.attr.editorCtx.editor?.remote;
                                if (!remote) {
                                    throw new Error("No RemoteDataProvider");
                                }
                                if (!remote.addContentAsset) {
                                    throw new Error("No RemoteDataProvider.addContentAsset");
                                }

                                dispatch({
                                    type: "StateChange",
                                    payload: {
                                        loading: true,
                                    },
                                });

                                remote
                                    .addContentAsset(file, "Audio")
                                    .then((res) => {
                                        data.mediaId = res.mediaId;
                                        data.URL = res.URL;
                                        if (res.isRemote) {
                                            data.isRemote = res.isRemote;
                                        }

                                        writeData();
                                    })
                                    .then((err) => {
                                        dispatch({
                                            type: "StateChange",
                                            payload: {
                                                loading: false,
                                            },
                                        });
                                    });
                            }
                        }

                        function writeData() {
                            dispatch({ type: "CloseModal" });
                            if (key) {
                                attr.event.emit(attr.editEvent.editAudio, {
                                    key,
                                    data,
                                });
                            } else {
                                attr.event.emit(attr.editEvent.addAudio, data);
                            }
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
