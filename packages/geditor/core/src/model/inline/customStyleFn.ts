import { getClassNameByInlineName  } from '../../public/keys'
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

export { customStyleFn };
