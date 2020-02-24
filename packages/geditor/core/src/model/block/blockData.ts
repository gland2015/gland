import { Map } from 'immutable';

// 块数据模型
const textBlockData = Map({
    type: 'div', // 格式：htmltype + '_' + 后缀
    isTextBlock: true,
    style: Map({}),
    wrapper: null,
    data: Map({})
});

const fixedWrapper = Map({
    name: '',
    firstKey: '',
    data: Map({})
});

const freeWrapper = Map({
    name: '',
    data: Map({})
});

const nonTextBlockData = Map({
    isTextBlock: false,
    data: Map({}),
    ComponentName: ''
});

/**
 * 返回固定包装的块的firstKey，若无包装则返回false，若非固定则undefined
 * @param block 
 */
export function getFixedWrapperFirstKey(block) {
    const wrapper = block.getData().get('wrapper');
    if (!wrapper) return false;
    return wrapper.get('firstKey');
}

export function getTextBlockData(type: string) {
    return textBlockData.set('type', type);
}

export function getNonBlockData(ComponentName = '') {
    return nonTextBlockData.set('ComponentName', ComponentName);
}

/**
 * 改变文本块的类型数据
 * @param blockData
 * @param type
 */
export function toggleTextBlockTypeData(blockData, type: string) {
    return blockData.set('type', type);
}
