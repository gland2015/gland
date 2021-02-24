import { EventEmitter } from "events";
import { EditorState } from "@gland/draft-ts";

export interface EditorConfig {
    decorators: Array<any>;
    handleKey;
    RemoteDataProvider: any;

    noFollowBlocks: Array<string>;
    nonTexts: { [key: string]: any };
    wrappers: { [key: string]: any };
    subBlocks: { [key: string]: any };
    entitys: { [key: string]: any };
    classNames: { [key: string]: string };
}

export interface EditorProps {
    style?: React.CSSProperties;
    className?: string;
    config: EditorConfig;

    value?: string | any;
    readOnly?: boolean;

    data?: any;
    Toolbar?: any;
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

    noFollowBlocks: Array<string>;
    nonTexts: { [key: string]: any };
    wrappers: { [key: string]: any };
    subBlocks: { [key: string]: any };
    entitys: { [key: string]: any };
    classNames: { [key: string]: string };
}

