import { withStyles } from '@material-ui/core/styles';
import { getClassNameByBlockKey, getClassNameByType, getClassNameByInlineName } from '../model';
import { getStyleObj } from '../model';

// 样式表都在此更改
const StyleSheetComponent = withStyles((theme: any) => {
    const result = {};
    const { classStyles, identifier } = theme;
    if (!classStyles) return result;
    if (classStyles['@keyframes']) {
        for (let name in classStyles['@keyframes']) {
            result['@keyframes ' + name + identifier] = classStyles['@keyframes'][name];
        }
    }
    if (classStyles['type']) {
        for (let type in classStyles['type']) {
            const name = getClassNameByType(type, identifier);
            result[name] = getStyleObj(classStyles['type'][type], identifier);
        }
    }
    if (classStyles['block']) {
        for (let key in classStyles['block']) {
            const name = getClassNameByBlockKey(key, identifier);
            result[name] = getStyleObj(classStyles['block'][key], identifier);
        }
    }
    // identifier
    if (classStyles['inline']) {
        Object.assign(result, classStyles['inline']);
        for (let inlineName in classStyles['inline']) {
            const name = getClassNameByInlineName(inlineName, identifier);
            result[name + identifier] = getStyleObj(classStyles['inline'][inlineName], identifier);
        }
    }
    return {
        '@global': result
    };
})(function() {
    return null;
});

export { StyleSheetComponent };
