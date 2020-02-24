//  数据存储模型

export interface IEditorTheme {
    classStyles: classStyles;
    identifier:string;
}

export interface classStyles {
    '@keyframes': object;
    type: object;
    block: object;
    inline: object;
}

export const store = {
    rawDraftContentState: '', // contentState字符串
    classStyles: {
        '@keyframes': {}, // 关键帧动画
        type: {
            // 块类型基本样式表
            default: {}
        },
        block: {
            // 块样式表
        },
        inline: {
            // 内联样式表 --固定类名
        }
    }
};
