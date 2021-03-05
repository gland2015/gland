import React from "react";
import { Modal, FabricButton, TextInput, ChoiceGroup } from "@/components/fluent";
import { ToolAttr } from "../utils";
import { toolClasses as classes } from "../style";
import { formatByteText } from "@/utils";

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
                mediaId: payload.data?.mediaId || "",
                URL: payload.data?.URL || "",
                isRemote: payload.data?.isRemote || false,

                align: payload.data?.align || "center",

                title: payload.data?.title || "",
                filename: payload.data?.filename || "",
                size: payload.data?.size || "",
            },
            href: payload.key && payload.data?.catalog === "0" ? payload.data?.URL || "" : "",
            filename: "",
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

            align: "center",

            title: "",
            filename: "",
            size: "",
        },
        href: "",
        filename: "",
    };
}

let lastCatalog = "0";

export function FileEditModal(props: { attr: ToolAttr }) {
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

        attr.event.on(attr.editEvent.openEditFile, OpenEdit);

        return () => {
            attr.event.off(attr.editEvent.openEditFile, OpenEdit);
        };
    }, []);

    const modalAttr = React.useRef({} as { input }).current;

    return (
        <Modal
            title="编辑文件"
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
                    <span className={classes.label}>文件来源：</span>
                    <ChoiceGroup
                        options={[
                            { key: "0", text: "链接" },
                            { key: "1", text: "上传" },
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
                            label="文件地址"
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
                                <span className={classes.label}>新文件：</span>
                                <div className={classes.nameshow}>{state.filename || "未选择"}</div>
                            </div>
                            <FabricButton
                                color={"primary"}
                                style={{ fontSize: 12, marginLeft: 15 }}
                                onClick={(e) => {
                                    modalAttr.input.click();
                                }}
                            >
                                选择文件
                            </FabricButton>
                            <input
                                ref={(r) => (modalAttr.input = r)}
                                style={{ display: "none" }}
                                type="file"
                                accept="*"
                                onChange={(e) => {
                                    let file = e.target.files[0];
                                    let filename = file.name;
                                    dispatch({
                                        type: "StateChange",
                                        payload: {
                                            filename,
                                            data: {
                                                ...state.data,
                                                filename,
                                                size: formatByteText(file.size),
                                            },
                                        },
                                    });
                                }}
                            />
                        </div>
                    )}
                </div>
                <div className={classes.iptLine}>
                    <TextInput
                        label="标题"
                        value={state.data.title}
                        underlined
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
                <div className={classes.twoCol}>
                    <div className={classes.twoColItem}>
                        <TextInput
                            label="文件名"
                            value={state.data?.filename || ""}
                            className={classes.twoColIpt}
                            style={{ width: 150 }}
                            onChange={(e) => {
                                dispatch({
                                    type: "StateChange",
                                    payload: {
                                        data: Object.assign({}, state.data, { filename: e.target.value }),
                                    },
                                });
                            }}
                        />
                    </div>
                    <div className={classes.twoColItem}>
                        <TextInput
                            label="大小"
                            value={state.data?.size || ""}
                            className={classes.twoColIpt}
                            style={{ width: 150 }}
                            onChange={(e) => {
                                dispatch({
                                    type: "StateChange",
                                    payload: {
                                        data: Object.assign({}, state.data, { size: e.target.value }),
                                    },
                                });
                            }}
                        />
                    </div>
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
                                    .addContentAsset(file, "File")
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
                                attr.event.emit(attr.editEvent.editFile, {
                                    key,
                                    data,
                                });
                            } else {
                                attr.event.emit(attr.editEvent.addFile, data);
                            }
                        }
                    }}
                >
                    确定
                </FabricButton>
                <FabricButton
                    style={{ marginLeft: 20 }}
                    onClick={(e) => {
                        if (state.loading) return;

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
