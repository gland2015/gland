import React from 'react';

export interface IDefaultConfigContext {
    mode: 'edit' | 'display' | 'check' | 'interactive';
    nonTextComponent: object;
    wrapperComponent: object;
    entityComponent: object;

    textBlockDefaultClassName: object;
    toUpdateKeys: Array<string>;
    asset: object;
}

const defaultContext: IDefaultConfigContext = {
    mode: 'edit',
    // 渲染
    nonTextComponent: {},
    wrapperComponent: {},
    textBlockDefaultClassName: {},
    entityComponent: {},
    asset: {},
    // 控制更新
    toUpdateKeys: []
};

export const editorConfigContext = React.createContext(defaultContext);
