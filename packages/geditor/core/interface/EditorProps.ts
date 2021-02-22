import { EventEmitter } from "events";

export interface EditorConfig {
    decorators;
    handleKey;
    RemoteDataProvider;

    nonTextComponent;
    wrapperComponent;
    entityComponent;
    textBlockDefaultClassName;
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

export interface EditorContext {
    toUpdateKeys: [];

    readOnly: boolean;
    event: EventEmitter;
    data: any;

    nonTextComponent: any;
    wrapperComponent: any;
    entityComponent: any;
}
