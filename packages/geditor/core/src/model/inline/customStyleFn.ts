import { getClassNameByInlineName  } from '../keys'
// styles: ['color:red;font:12px;', '.classname']
function customStyleFn(styles, block) {
    const result = {
        classNames: []
    };
    let keyValue;
    styles.forEach(styleName => {
        const charCode = styleName.charCodeAt(0);
        // '.' 点号开头为类名
        if (charCode === 46) {
            const className = getClassNameByInlineName(styleName, this.identifier);
            result.classNames.push(className);
        } else if (charCode >= 91 && charCode <= 122) {
            // 小写字母开头为css样式
            styleName.split(';').forEach(name => {
                if (name) {
                    keyValue = name.split(':');
                    result[keyValue[0]] = keyValue[1];
                }
            });
        }
    });
    return result;
}

export  function getStyleObj(obj, identifier, changeNew = true) {
    let result = {};
    let hasChange;
    if (obj['animation'] && obj['animation'].match(/\$[^ ]+/)) {
        hasChange = true;
        result['animation'] = obj['animation'].replace(/\$[^ ]+/, '$' + identifier);
    }
    if (!hasChange) {
        return obj;
    }
    if (changeNew) {
        return Object.assign({}, obj, result);
    }
    return Object.assign(obj, result);
}


export { customStyleFn };
