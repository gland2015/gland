export interface currentState {
    blockType?: string;
    blockComponentName?: string;
    blockStyle?: object;
    entityData?: any;
    // todo: 返回非焦点处的但在选择范围的其他实体数据
    rangleEntityData?: any;
    isCollapsed?: boolean;
    inlineStyle?: Array<string>;
    inlineClassName?: Array<string>;
}
