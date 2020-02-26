import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { Editor as DraftEditor, EditorState, convertToRaw, genKey } from "@gland/draft-ts";

import { StyleSheetComponent } from "./component";
import { makeCollapsed, insertText, utils, defaultKeyHandler, isImutableEntityAtBlockLast } from "./editAPI";
import { classStyles, customStyleFn, blockRenderMap, store } from "./model";
import { editorConfigContext } from "./public/context";
import { getCurrentState } from "./public/getCurrentState";

class Editor extends React.Component<
    {
        value?: string | any;
        Toolbar?: any;
        mode?: string;
        readOnly?: boolean;
        classStyles: classStyles;
        config?: any;
    },
    any
> {
    static defaultProps = {
        mode: "editor",
        classStyles: store.classStyles
    };

    constructor(props) {
        super(props);
        this.identifier = genKey();
        this.customStyleFn = customStyleFn;
        this.editorTheme = {
            classStyles: initClassStyles(this.props.classStyles),
            identifier: this.identifier
        };

        this.initContext(props.config);

        this.state = {
            editorState: initEditorState(props.value, this.config.decorators)
        };
        this.editorContext.editor = this;
        this.editorContext.mode = props.mode;
    }
    readonly identifier;
    editorContext;
    editorTheme;
    customStyleFn;
    state;
    config;
    editorRef = null;
    remoteDataProvider = null;
    editorStateBeforeComposition;

    shouldComponentUpdate(nextProps, nextState) {
        if (Object.is(this.props, nextProps)) return true;
        if (nextProps.value !== this.props.value) {
            this.editorContext.mode = nextProps.mode;
            this.editorTheme = Object.assign({}, this.editorTheme, { classStyles: initClassStyles(nextProps.classStyles) });
            this.setState({
                editorState: initEditorState(nextProps.value, this.config.decorators)
            });
            return false;
        }
        if (nextProps.classStyles !== this.props.classStyles) {
            this.editorContext.mode = nextProps.mode;
            this.editorTheme = Object.assign({}, this.editorTheme, { classStyles: initClassStyles(nextProps.classStyles) });
            this.setState({});
            return false;
        }
        if (nextProps.mode !== this.props.mode) {
            this.editorContext.mode = nextProps.mode;
            return true;
        }
        return true;
    }

    updateEditorState = (editorState, toUpdateKeys = null) => {
        //console.log('update', toUpdateKeys, !!this.editorStateBeforeComposition)
        // 输入法事件
        if (this.editorStateBeforeComposition) return;
        this.editorContext.toUpdateKeys = toUpdateKeys;
        this.setState({ editorState });
    };

    render() {
        const { Toolbar, readOnly } = this.props;
        const { RemoteDataProvider } = this.config;
        const currentState = getCurrentState(this.state.editorState, this.editorTheme);

        return (
            <editorConfigContext.Provider value={this.editorContext}>
                <div>
                    {Toolbar && <Toolbar currentState={currentState} />}
                    <ThemeProvider theme={this.editorTheme}>
                        <div
                            onCutCapture={e => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onCompositionStartCapture={this.handleCompositionStart}
                            onCompositionEndCapture={this.handleCompositionEnd}
                        >
                            {RemoteDataProvider && <RemoteDataProvider onRef={r => (this.remoteDataProvider = r)} />}
                            <StyleSheetComponent />
                            <DraftEditor
                                ref={r => (this.editorRef = r)}
                                editorState={this.state.editorState}
                                onChange={this.updateEditorState}
                                keyBindingFn={this.keyBindingFn}
                                handlePastedText={handlePastedText}
                                blockRenderMap={blockRenderMap}
                                handleBeforeInput={_ => "handled"}
                                customStyleFn={this.customStyleFn}
                                handleKeyCommand={handleKeyCommand}
                                readOnly={readOnly}
                            />
                        </div>
                    </ThemeProvider>
                </div>
            </editorConfigContext.Provider>
        );
    }

    handleCompositionStart = (event: React.CompositionEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const editorStateBeforeComposition = this.state.editorState;
        let result = makeCollapsed(editorStateBeforeComposition);
        if (isImutableEntityAtBlockLast(result.editorState)) {
            result = insertText(result.editorState, "\r");
        }

        this.updateEditorState(result.editorState, result.toUpdateKeys);
        this.editorStateBeforeComposition = editorStateBeforeComposition;
        //}
    };

    handleCompositionEnd = (event: React.CompositionEvent) => {
        event.stopPropagation();
        const text = event.data;
        let editorState = this.editorStateBeforeComposition;
        this.editorStateBeforeComposition = null;
        if (text) {
            // notice 这是包含了已有的样式的，无是null
            const style = editorState.getInlineStyleOverride() || undefined;
            let result = insertText(editorState, text, style);
            editorState = result.editorState;
        }
        let toUpdateKeys = [editorState.getSelection().anchorKey];
        this.updateEditorState(editorState, toUpdateKeys);
    };

    keyBindingFn = event => {
        const keyCode = event.keyCode;
        // 输入法事件
        if (keyCode === 229) return "disabled";
        const key = event.key;
        const shiftKey = event.shiftKey;
        const ctrlKey = event.ctrlKey;
        const altKey = event.altKey;
        let editorState = this.state.editorState;

        const keyState = {
            keyCode,
            key,
            shiftKey,
            ctrlKey,
            altKey
        };

        let result = this.config.handleKey && this.config.handleKey(editorState, keyState, this.editorContext);
        if (!result) {
            result = defaultKeyHandler(editorState, keyState, this.editorContext);
        }

        if (result) {
            this.updateEditorState(result.editorState, result.toUpdateKeys);
            return "disabled";
        }
        if (result === null) return null;
        return "disabled";
    };

    focus() {
        this.editorRef.focus();
    }

    initContext(config) {
        this.config = config;
        const {
            // 编辑器固定配置
            decorators,
            handleKey,
            RemoteDataProvider,

            editorAsset = {},
            nonTextComponent = {},
            wrapperComponent = {},
            entityComponent = {},
            textBlockDefaultClassName = {}
        } = config;

        // 编辑器上下文
        const editorContext: any = {
            nonTextComponent,
            wrapperComponent,
            textBlockDefaultClassName,
            entityComponent,
            editorAsset,
            editor: null,
            toUpdateKeys: []
        };
        this.editorContext = editorContext;
    }

    updateConfig(config) {
        this.initContext(config);
        this.setState({});
    }

    updateValue(value) {
        this.setState({
            editorState: initEditorState(value, this.config.decorators)
        });
    }

    /**
     * 获取编辑器原始内容
     */
    getRawDraftContentState() {
        const editorState = this.state.editorState;
        const contentState = editorState.getCurrentContent();
        const content = convertToRaw(contentState);
        return content;
    }

    /**
     * 获取存储对象
     */
    getStore() {
        const store = {
            rawDraftContentState: JSON.stringify(this.getRawDraftContentState()),
            classStyles: JSON.stringify(this.editorTheme.classStyles)
        };
        return store;
    }
}

function handlePastedText(text: string, html?: string, editorState?): any {
    return "handled";
}

function initClassStyles(classStyles) {
    if (typeof classStyles === "string") {
        classStyles = JSON.parse(classStyles);
    }
    return classStyles;
}

function handleKeyCommand(command): any {
    return "handled";
}

function initEditorState(value, decorators) {
    if (value instanceof EditorState) return value;
    return utils.getEditorState(value, decorators);
}

export { Editor };

export * from "./editAPI";
export * from "./public/context";
export * from "./public/constants";
