import { EventEmitter } from "events";
import { EditorState } from "@gland/draft-ts";

export interface EditorConfig {
    decorators: Array<any>;
    handleKey;

    noFollowBlocks: Array<string>;
    nonTexts: { [key: string]: any };
    wrappers: { [key: string]: any };
    subBlocks: { [key: string]: any };
    entitys: { [key: string]: any };
    classNames: { [key: string]: string };
    toolCfg: any;
    defaultLang: any;
}

export interface EditorProps {
    style?: React.CSSProperties;
    editCls?: { rootCls?: string; wrapperCls?: string; toolCls?: string; footerCls?: string };
    config: EditorConfig;

    value?: string | any;
    readOnly?: boolean;
    lang?: any;
    data?: any;
    Toolbar?: any;
    RemoteDataProvider: any;
    onChange?: () => any;
}

export interface IEditorContext {
    editor: any;
    toUpdateKeys: Array<string>;
    editorState: EditorState;
    updateEditorState: any;

    readOnly: boolean;
    event: EventEmitter;
    data: any;

    lang: any;
    target: EditTarget;
    noFollowBlocks: Array<string>;
    nonTexts: { [key: string]: any };
    wrappers: { [key: string]: any };
    subBlocks: { [key: string]: any };
    entitys: { [key: string]: any };
    classNames: { [key: string]: string };
}

export interface EditTarget {
    key: string;
    offset: number;
    hasFocus: boolean;
    isCollapsed: boolean;
}
