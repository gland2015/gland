// todo
// 1、wrapper depth method

import React from "react";
import clsx from "clsx";
import { EventEmitter } from "events";
import { Editor as DraftEditor, EditorState, convertToRaw, genKey } from "@gland/draft-ts";

import { EditorProps, IEditorContext } from "./interface";
import { customStyleFn, blockRenderMap } from "./model";
import { EditorContext, TargetContext } from "./public/context";
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
        const { Toolbar, value, config, readOnly, onChange, style, data, RemoteDataProvider, editCls, lang } = props;
        const { decorators, handleKey, noFollowBlocks, nonTexts, wrappers, subBlocks, entitys, classNames, defaultLang, toolCfg } = config;

        const [state, dispatch] = React.useReducer(reducer, props, initer);
        const editorState: EditorState = state.editorState;
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();

        const target = React.useMemo(() => {
            if (readOnly) return {} as any;

            const targetKey = selection.isBackward ? selection.focusKey : selection.anchorKey;
            const targetOffset = selection.isBackward ? selection.focusOffset : selection.anchorOffset;
            const hasFocus = selection.hasFocus;
            const isCollapsed = selection.isCollapsed();

            return {
                key: targetKey,
                offset: targetOffset,
                hasFocus,
                isCollapsed,
            };
        }, [selection]);

        React.useEffect(() => {
            if (attr.hasInit) {
                dispatch({
                    type: "Change",
                    payload: {
                        editorState: getEditorState(value, config.decorators),
                    },
                });
            } else {
                attr.hasInit = true;
            }
        }, [value]);

        const attr = React.useMemo(() => {
            return {
                hasInit: false,
                draftEditor: null,
                remote: null,
                context: {
                    event: new EventEmitter(),
                    editor: null,
                    toUpdateKeys: null as Array<string>,
                } as IEditorContext,
                handleComposition: null,
            };
        }, []);

        Object.assign(attr.context, {
            editorState: state.editorState,
            updateEditorState,
            lang: lang || defaultLang,
            data,
            target,
            readOnly,
            nonTexts,
            wrappers,
            classNames,
            subBlocks,
            entitys,
            noFollowBlocks,
        });

        React.useEffect(() => {
            attr.context.toUpdateKeys = null;
        }, [state.editorState]);

        React.useImperativeHandle(ref, () => {
            attr.context.editor = {
                focus(pos?) {
                    attr.draftEditor.focus(pos);
                },
                get remote() {
                    return attr.remote;
                },
                getStore() {
                    return convertToRaw(contentState);
                },
            };
            return attr.context.editor;
        });

        const currentState = React.useMemo(() => {
            return getCurrentState(editorState);
        }, [editorState]);

        return (
            <EditorContext.Provider value={attr.context}>
                <TargetContext.Provider value={target}>
                    {Toolbar && <Toolbar currentState={currentState} context={attr.context} className={editCls?.toolCls} config={toolCfg} />}
                    <div className={clsx(editCls?.wrapperCls)} style={style}>
                        {RemoteDataProvider && <RemoteDataProvider ref={(r) => (attr.remote = r)} context={attr.context} />}
                        <div
                            className={clsx(classNames.root, editCls?.rootCls)}
                            onDragStartCapture={readOnly ? null : disableEvent}
                            onCompositionStartCapture={readOnly ? null : handleCompositionStart}
                            onCompositionEndCapture={readOnly ? null : handleCompositionEnd}
                        >
                            <DraftEditor
                                ref={(r) => (attr.draftEditor = r)}
                                key={readOnly + ""}
                                readOnly={readOnly}
                                editorState={state.editorState}
                                onChange={updateEditorState}
                                blockRenderMap={blockRenderMap}
                                customStyleFn={customStyleFn}
                                keyBindingFn={keyBindingFn}
                                handlePastedText={handlePastedText}
                                handleBeforeInput={handleBeforeInput}
                                handleKeyCommand={handleKeyCommand}
                                onCut={handleCut}
                                onPaste={handlePaste}
                            />
                        </div>
                        <div
                            className={editCls?.footerCls}
                            onMouseDown={
                                readOnly
                                    ? null
                                    : (e) => {
                                          e.preventDefault();
                                          attr.draftEditor.focus();
                                      }
                            }
                        ></div>
                    </div>
                </TargetContext.Provider>
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

        function handleCut(editor, event) {
            event.preventDefault();

            let winSel = window.getSelection();
            if (!winSel.rangeCount) {
                return;
            }
            let range = winSel.getRangeAt(0);
            let clonedSelection = range.cloneContents();

            let newDiv = document.createElement("div");
            newDiv.appendChild(clonedSelection);
            event.clipboardData.setData("text/html", newDiv.innerHTML);
            event.clipboardData.setData("text/plain", newDiv.innerText.replace(/\u200b\u200c\u200d/g, ""));

            const result = makeCollapsed(editor.props.editorState);
            updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handlePaste(editor, event) {
            event.preventDefault();
            let txt = event.clipboardData.getData("text/plain") || "";
            txt = txt.replace(/\u200b\u200c\u200d/g, "");
            let result = insertText(editor.props.editorState, txt);
            updateEditorState(result.editorState, result.toUpdateKeys);
        }

        function handleBeforeInput(text, editorState, time) {
            if (attr.handleComposition) {
                attr.handleComposition(text);
            } else {
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

function disableEvent(event) {
    event.preventDefault();
    event.stopPropagation();
}
