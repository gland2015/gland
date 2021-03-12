import React from "react";
import { Modal } from "@gland/react/modal";
import { Dropdown } from "@gland/react/dropdown";
import { FabricButton } from "@gland/react/button";
import { CodeMirror } from "@gland/react/common/CodeMirror";
import { syntaxStyles, syntaxModes } from "@gland/react/common/SyntaxHighlighter";
import { ToolAttr } from "../utils";
import { toolClasses as classes } from "../style";

const modes = syntaxModes.map((name) => ({ key: name, label: name }));

const modeMap = {
    clike: "clike",
    css: "css",
    go: "go",
    javascript: "javascript",
    typescript: "javascript",
    jsx: "jsx",
    markdown: "markdown",
    nginx: "nginx",
    php: "php",
    powershell: "powershell",
    python: "python",
    ruby: "ruby",
    rust: "rust",
    sass: "sass",
    sql: "sql",
    textile: "textile",
    xmlDoc: "xml",
};

function getMirrorMode(name) {
    if (modeMap[name]) {
        return modeMap[name];
    }
    return name;
}

const themes = Object.keys(syntaxStyles).map(function (key) {
    return {
        key,
        label: key,
    };
});

function reducer(state, action) {
    let newState = state;
    let type = action?.type;
    let payload = action?.payload;

    if (type === "OpenModal") {
        return Object.assign({}, state, {
            open: true,
            key: payload.key,
            data: payload.data,

            codeOptions: Object.assign({}, state.codeOptions, {
                mode: getMirrorMode(payload.data.mode),
            }),
        });
    } else if (type === "StateChange") {
        return Object.assign({}, state, payload);
    } else if (type === "ModeChange") {
        return Object.assign({}, state, {
            data: Object.assign({}, state.data, {
                mode: payload,
            }),
            codeOptions: Object.assign({}, state.codeOptions, {
                mode: getMirrorMode(payload),
            }),
        });
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
        key: null,
        data: {
            mode: "javascript",
            theme: "dark",
            value: "",
        },
        codeOptions: {
            mode: getMirrorMode("javascript"),
            theme: "material",
            lineNumbers: true,
        },
    };
}

export function CodeEditModal(props: { attr: ToolAttr }) {
    const [state, dispatch] = React.useReducer(reducer, props, initer);
    const attr = props.attr;
    const lang = attr.lang;

    React.useEffect(() => {
        function OpenEdit(options) {
            dispatch({
                type: "OpenModal",
                payload: options,
            });
        }

        attr.event.on(attr.editEvent.openEditCode, OpenEdit);

        return () => {
            attr.event.off(attr.editEvent.openEditCode, OpenEdit);
        };
    }, []);

    return (
        <Modal
            title={lang.other.codeEdit}
            isOpen={state.open}
            style={{ minWidth: 800 }}
            animation="slideDown"
            onDismiss={(event, from) => {
                dispatch({ type: "CloseModal" });
                attr.event.emit(attr.editEvent.focus);
            }}
        >
            <div>
                <div className={classes.codeSelect}>
                    <span>{lang.base.language}: </span>
                    <Dropdown
                        list={modes}
                        menuStyle={{
                            maxHeight: 300,
                        }}
                        selecedKey={state.data.mode}
                        onChange={(item) => {
                            dispatch({
                                type: "ModeChange",
                                payload: item.key,
                            });
                        }}
                    />
                    <span style={{ marginLeft: 20 }}>{lang.base.theme}: </span>
                    <Dropdown
                        list={themes}
                        menuStyle={{
                            maxHeight: 300,
                        }}
                        selecedKey={state.data.theme}
                        onChange={(item) => {
                            dispatch({
                                type: "StateChange",
                                payload: {
                                    data: Object.assign({}, state.data, {
                                        theme: item.key,
                                    }),
                                },
                            });
                        }}
                    />
                </div>
            </div>
            <div style={{ minHeight: 300, maxWidth: 760 }}>
                <CodeMirror
                    autoCursor
                    value={state.data.value}
                    options={state.codeOptions}
                    onBeforeChange={(editor, data, value) => {
                        dispatch({
                            type: "StateChange",
                            payload: {
                                data: Object.assign({}, state.data, {
                                    value,
                                }),
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
                            attr.event.emit(attr.editEvent.editCode, {
                                key: state.key,
                                data: state.data,
                            });
                        } else {
                            attr.event.emit(attr.editEvent.addCode, state.data);
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
