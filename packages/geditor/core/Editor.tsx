// 1、火狐光标兼容
// 2、编辑块之后光标重定位，防止丢失
// 3、getCurrentState，editorState toUpdateKeys = null

import React from "react";
import { EventEmitter } from "events";
import { Editor as DraftEditor, EditorState, convertToRaw, genKey } from "@gland/draft-ts";

import { EditorProps } from "./interface";
import { customStyleFn, blockRenderMap } from "./model";
import { EditorContext, TargetKeyContext } from "./public/context";
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
        const { decorators, handleKey, noFollowBlocks, RemoteDataProvider, nonTexts, wrappers, subBlocks, entitys, classNames } = config;

        const [state, dispatch] = React.useReducer(reducer, props, initer);
        const editorState: EditorState = state.editorState;
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const targetKey = selection.isBackward ? selection.focusKey : selection.anchorKey;

        React.useEffect(() => {
            if (attr.hasInit) {
                dispatch({
                    type: "Change",
                    payload: {
                        editorState: getEditorState(value, config.decorators),
                    },
                });
            }
        }, [value]);

        const attr = React.useMemo(() => {
            return {
                hasInit: false,
                draftEditor: null,
                remote: null,
                context: {
                    editor: null,
                    toUpdateKeys: null as Array<string>,
                    editorState: null,
                    updateEditorState: null,
                    targetKey: null,
                    readOnly: false,
                    event: new EventEmitter(),
                    data: null,
                    nonTexts: null,
                    wrappers: null,
                    entitys: null,
                    subBlocks: null,
                    classNames: null,
                    noFollowBlocks: null,
                },
                handleComposition: null,
            };
        }, []);

        Object.assign(attr.context, {
            editorState: state.editorState,
            updateEditorState,
            readOnly,
            data,
            targetKey,
            nonTexts,
            wrappers,
            subBlocks,
            entitys,
            classNames,
            noFollowBlocks,
        });

        React.useEffect(() => {
            attr.context.toUpdateKeys = null;
        }, [state.editorState]);

        React.useImperativeHandle(ref, () => {
            attr.context.editor = {
                focus() {
                    attr.draftEditor.focus();
                },
                get remote() {
                    return attr.remote;
                },
            };
            return attr.context.editor;
        });

        const currentState = React.useMemo(() => {
            return getCurrentState(editorState);
        }, [editorState]);

        React.useEffect(() => {
            attr.hasInit = true;
        }, []);

        return (
            <EditorContext.Provider value={attr.context}>
                <TargetKeyContext.Provider value={targetKey}>
                    {Toolbar && <Toolbar currentState={currentState} context={attr.context} />}
                    <div className={className} style={style}>
                        <div
                            onCutCapture={readOnly ? null : disableEvent}
                            onDragStartCapture={readOnly ? null : disableEvent}
                            onCompositionStartCapture={handleCompositionStart}
                            onCompositionEndCapture={handleCompositionEnd}
                        >
                            {RemoteDataProvider && <RemoteDataProvider ref={(r) => (attr.remote = r)} context={attr.context} />}
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
                </TargetKeyContext.Provider>
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

function disableEvent(event) {
    event.preventDefault();
    event.stopPropagation();
}
