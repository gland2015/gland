import * as utils from './utils';
import { toggleTextBlockTypeData, getTextBlockData, getNonBlockData } from '../model';
import { EditorState } from "@gland/draft-ts";
/**
 * 遍历当前选中区域的文本块数据
 * @param editorState
 * @param Fn 应返回块数据
 */
export function reduceTextBlockData(editorState, Fn: (conent, blockData, currenType, key) => any) {
    let selection = editorState.getSelection();
    let content = editorState.getCurrentContent();
    const toUpdateKeys = [];
    content = utils.reduceCurrentBlocks(myFn, content, selection);
    editorState = EditorState.push(editorState, content, 'change-block-data');
    editorState = EditorState.forceSelection(editorState, selection);
    return { editorState, toUpdateKeys };

    function myFn(conent, blockData, key) {
        // notice 这里假设了非文本块都没有type
        const currentType = blockData.get('type');
        if (currentType) {
            let newBlockData = Fn(conent, blockData, currentType, key);
            if (blockData !== newBlockData) {
                toUpdateKeys.push(key);
                conent = utils.setBlockData(conent, key, blockData);
            }
        }
        return conent;
    }
}

/**
 * 切换块类型
 * @param editorState
 * @param type
 */
export function applyBlockType(editorState, type: string) {
    return reduceTextBlockData(editorState, Fn);
    function Fn(theContent, blockData, currenType, key) {
        if (type !== currenType) {
            blockData = toggleTextBlockTypeData(blockData, type);
        }
        return blockData;
    }
}

/**
 * 应用块样式
 * @param editorState
 * @param style
 */
export function applyBlockStyle(editorState, style: object) {
    return reduceTextBlockData(editorState, Fn);
    function Fn(theContent, blockData, currenType, key) {
        const styleMap = blockData.get('style').merge(style);
        blockData = blockData.set('style', styleMap);
        return blockData;
    }
}

/**
 * 移除块样式
 * @param editorState
 * @param styles
 */
export function removeBlockStyle(editorState, styles: Array<string>) {
    return reduceTextBlockData(editorState, Fn);

    function Fn(theContent, blockData, currenType, key) {
        let styleMap = blockData.get('style');
        for (let i = 0; i < styles.length; i++) {
            styleMap = styleMap.delete(styles[i]);
        }
        blockData = blockData.set('style', styleMap);
        return blockData;
    }
}
