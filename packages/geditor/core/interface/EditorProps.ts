import { EventEmitter } from "events";
import { EditorState } from "@gland/draft-ts";

export interface EditorConfig {
    decorators;
    handleKey;
    RemoteDataProvider;

    noFollowBlock: Array<string>;
    nonTextComponent;
    wrapperComponent;
    entityComponent;
    classNames;
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

    noFollowBlock: Array<string>;
    nonTextComponent: any;
    wrapperComponent: any;
    entityComponent: { [key: string]: any };
    classNames: { [key: string]: string };
}
