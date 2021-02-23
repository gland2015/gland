import React from "react";
import { EventEmitter } from "events";
import { Editor as DraftEditor, EditorState, convertToRaw, genKey } from "@gland/draft-ts";

import { EditorProps } from "./interface";
import { customStyleFn, blockRenderMap } from "./model";
import { EditorContext } from "./public/context";
import { getEditorState, insertText, makeCollapsed, haveSpecEntity, defaultKeyHandler, getCurrentState } from "./editAPI";

function reducer(state, action) {
    let newState = state;
    const type = action?.type;
    const payload = action?.payload;

    if (type === "Change") {
        return Object.assign({}, state, payload);
    }

    return newState;
}

function initer(props: EditorProps) {
    return {
        editorState: getEditorState(props.value, props.config.decorators),
    };
}

export const Editor = React.memo(
    React.forwardRef(function (props: EditorProps, ref) {
        const { Toolbar, value, config, readOnly, onChange, className, style, data } = props;
        const { decorators, handleKey, noFollowBlock, RemoteDataProvider, nonTextComponent, wrapperComponent, entityComponent, classNames } = config;

        const [state, dispatch] = React.useReducer(reducer, props, initer);
        const editorState: EditorState = state.editorState;
        const contentState = editorState.getCurrentContent();

        React.useEffect(() => {
            dispatch({
                type: "Change",
                payload: {
                    editorState: getEditorState(value, config.decorators),
                },
            });
        }, [value]);

        const attr = React.useMemo(() => {
            return {
                draftEditor: null,
                remote: null,
                context: {
                    editor: null,
                    toUpdateKeys: null as Array<string>,
                    editorState: null,
                    updateEditorState: null,
                    readOnly: false,
                    event: new EventEmitter(),
                    data: null,
                    nonTextComponent: null,
                    wrapperComponent: null,
                    entityComponent: null,
                    classNames: null,
                    noFollowBlock: null,
                },
                handleComposition: null,
            };
        }, []);

        Object.assign(attr.context, {
            editorState: state.editorState,
            updateEditorState,
            readOnly,
            data,
            nonTextComponent,
            wrapperComponent,
            entityComponent,
            classNames,
            noFollowBlock,
        });

        React.useEffect(() => {
            attr.context.toUpdateKeys = null;
        }, [state.editorState]);

        React.useImperativeHandle(ref, () => {
            attr.context.editor = {
                focus() {
                    attr.draftEditor.focus();
                },
            };
            return attr.context.editor;
        });

        const currentState = React.useMemo(() => {
            return getCurrentState(editorState);
        }, [editorState]);

        return (
            <EditorContext.Provider value={attr.context}>
                {Toolbar && <Toolbar currentState={currentState} />}
                <div className={className} style={style}>
                    <div
                        onMouseDown={handleMousedown}
                        onCutCapture={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onCompositionStartCapture={handleCompositionStart}
                        onCompositionEndCapture={handleCompositionEnd}
                    >
                        {RemoteDataProvider && <RemoteDataProvider ref={(r) => (attr.remote = r)} />}
                        <DraftEditor
                            ref={(r) => (attr.draftEditor = r)}
                            readOnly={readOnly}
                            editorState={state.editorState}
                            onChange={updateEditorState}
                            blockRenderMap={blockRenderMap}
                            customStyleFn={customStyleFn}
                            keyBindingFn={keyBindingFn}
                            handlePastedText={handlePastedText}
                            handleBeforeInput={handleBeforeInput}
                            handleKeyCommand={handleKeyCommand}
                        />
                    </div>
                    <div
                        style={{ flexGrow: 1, minHeight: 50 }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            attr.draftEditor.focus();
                        }}
                    ></div>
                </div>
            </EditorContext.Provider>
        );

        function updateEditorState(editorState: EditorState, toUpdateKeys = null) {
            if (attr.handleComposition) return;

            attr.context.toUpdateKeys = toUpdateKeys;
            dispatch({
                type: "Change",
                payload: { editorState },
            });

            if (contentState !== editorState.getCurrentContent()) {
                onChange && onChange();
            }
        }

        function handleBeforeInput(text, editorState, time) {
            if (attr.handleComposition) {
                attr.handleComposition(text);
            } else {
                // notice 这是包含了已有的样式的，无是null
                let result = insertText(editorState, text);
                updateEditorState(result.editorState, result.toUpdateKeys);
            }
            return "handled" as any;
        }

        function handleCompositionStart(event: React.CompositionEvent) {
            event.preventDefault();
            event.stopPropagation();
            let result = makeCollapsed(state.editorState);
            const editorStateAtStart = result.editorState;
            // gland 因为输入法输入无法阻止，要防止输入错位，只有重定位
            const needInsert = haveSpecEntity(result.editorState);
            if (needInsert) {
                result = insertText(result.editorState, "\r");
            }
            if (result.editorState !== state.editorState) {
                updateEditorState(result.editorState, result.toUpdateKeys);
            }
            attr.handleComposition = (_) => {
                attr.handleComposition = (text) => {
                    attr.handleComposition = null;
                    let editorState = editorStateAtStart;
                    if (text) {
                        let result = insertText(editorState, text);
                        editorState = result.editorState;
                    }
                    let toUpdateKeys = [editorState.getSelection().anchorKey];
                    updateEditorState(editorState, toUpdateKeys);
                };
            };
        }

        function handleCompositionEnd(event: React.CompositionEvent) {
            event.stopPropagation();
            const text = event.data;
            if (attr.handleComposition) {
                attr.handleComposition(text);
            }
        }

        function keyBindingFn(event) {
            const keyCode = event.keyCode;
            // 输入法状态下的事件
            if (keyCode === 229) return "disabled";
            const key = event.key;
            const shiftKey = event.shiftKey;
            const ctrlKey = event.ctrlKey;
            const altKey = event.altKey;
            let editorState = state.editorState;

            const keyState = {
                keyCode,
                key,
                shiftKey,
                ctrlKey,
                altKey,
            };

            let result = config.handleKey && config.handleKey(editorState, keyState, attr.context);
            if (!result) {
                result = defaultKeyHandler(editorState, keyState, attr.context);
            }

            if (result) {
                updateEditorState(result.editorState, result.toUpdateKeys);
                return "disabled";
            }
            if (result === null) return null;
            return "disabled";
        }
    })
);

function handlePastedText(text: string, html?: string, editorState?): any {
    return "handled";
}

function handleKeyCommand(command): any {
    return "handled";
}

function handleMousedown(event: React.MouseEvent) {
    if (event.detail >= 3) {
        event.preventDefault();
    }
}
