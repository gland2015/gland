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
            loading: false,
            type: (payload.key && payload.type) || "block",
            key: payload.key,
            data: {
                mediaId: payload.data?.mediaId || "",
                URL: payload.data?.URL || "",
                isRemote: payload.data?.isRemote || false,
                catalog: payload.data?.catalog || lastCatalog,
                widthType: payload.data?.widthType || "auto",
                width: payload.data?.width || 50,

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
        type: "block",
        key: "",
        data: {
            catalog: "0",
            mediaId: "",
            URL: "",
            isRemote: false,

            widthType: "auto",
            width: 50,

            title: "",
            align: "center",
        },
        filename: "",
        href: "",
    };
}

let lastCatalog = "0";

export function ImageEditModal(props: { attr: ToolAttr }) {
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

        attr.event.on(attr.editEvent.openEditImage, OpenEdit);

        return () => {
            attr.event.off(attr.editEvent.openEditImage, OpenEdit);
        };
    }, []);

    const modalAttr = React.useRef({} as { input }).current;

    return (
        <Modal
            title="编辑图片"
            isOpen={state.open}
            style={{ minWidth: 500 }}
            onDismiss={(event, from) => {
                if (state.loading) return;
                dispatch({ type: "CloseModal" });
                attr.event.emit(attr.editEvent.focus);
            }}
        >
            <div>
                <div className={classes.imageType}>
                    <span className={classes.label}>图片来源：</span>
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
                            label={"图片地址"}
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
                        <div className={classes.imageSel}>
                            <div className={classes.imageName}>
                                <span className={classes.label}>新图片：</span> {state.filename || "未选择"}
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
                                accept="image/*"
                                onChange={(e) => {
                                    let filename = e.target.files[0].name;
                                    dispatch({ type: "StateChange", payload: { filename } });
                                }}
                            />
                        </div>
                    )}
                </div>
                {state.key ? null : (
                    <div className={classes.iptLine}>
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
                {state.type === "block" ? (
                    <div className={classes.iptLine}>
                        <TextInput
                            label="标题"
                            value={state.data.title}
                            underlined
                            placeholder="可选"
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
                ) : null}
                <div className={classes.iptLine}>
                    <span className={classes.label}>宽度：</span>
                    <ChoiceGroup
                        selectedKey={state.data?.widthType}
                        options={[
                            { key: "auto", text: "自动" },
                            { key: "px", text: "像素" },
                            state.type === "block" ? { key: "rate", text: "百分比" } : null,
                        ].filter(Boolean)}
                        onChange={(item) => {
                            let width = 500;
                            if (item.key === "rate" || state.type === "inline") {
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
                {state.type === "block" ? (
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
                ) : null}
            </div>
            <div className={classes.modalFooter}>
                <FabricButton
                    color="primary"
                    loading={state.loading}
                    onClick={() => {
                        if (state.loading) return;

                        let key = state.key;
                        let data = Object.assign({}, state.data);

                        if (data.widthType !== "auto") {
                            let width = parseInt(data.width);
                            if (isNaN(width) || width < 4) {
                                delete data.width;
                                data["widthType"] = "auto";
                            } else {
                                data.width = width;
                            }
                        } else {
                            delete data.width;
                        }

                        if (state.type === "inline") {
                            delete data.align;
                            delete data.title;
                        }

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
                                    .addContentAsset(file, "Image")
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
                            if (state.type === "inline") {
                                if (key) {
                                    attr.event.emit(attr.editEvent.editInlineFormula, {
                                        key,
                                        data,
                                    });
                                } else {
                                    attr.event.emit(attr.editEvent.addInlineImage, data);
                                }
                            } else {
                                if (key) {
                                    attr.event.emit(attr.editEvent.editImage, {
                                        key,
                                        data,
                                    });
                                } else {
                                    attr.event.emit(attr.editEvent.addImage, data);
                                }
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
