import { editorName } from '../constants';

export function getClassNameByInlineName(name, identifier) {
    return 'inline' + '_' + name + '_' + editorName + identifier;
}

export function getClassNameByType(type = 'default', identifier) {
    return 'type' + '_' + type + '_' + editorName + identifier;
}

export function getClassNameByBlockKey(blockKey: string, identifier) {
    return 'block' + '_' + blockKey + editorName + identifier;
}

export function getClassName(type: string, blockKey: string, identifier) {
    return getClassNameByType(type, identifier) + ' ' + getClassNameByBlockKey(blockKey, identifier);
}