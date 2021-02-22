interface BasicData {
    isText: boolean;
    name: string;
    wrapper?: {
        name: string;
        depth: number;
    };
    data?: {
        [key: string]: any;
    };

    pKey?: string;
}

export interface TextBlockData extends BasicData {
    head?: { grow: string; name: string };
    style?: React.CSSProperties;
}

export interface NonTextBlockData extends BasicData {}
