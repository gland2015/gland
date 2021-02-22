// styles: ['color:red;font:12px;', '.classname']
function customStyleFn(styles, block) {
    const result = {
        classNames: [],
    };
    let keyValue;
    styles.forEach((styleName) => {
        const charCode = styleName.charCodeAt(0);
        // '.' The className start with a dot
        if (charCode === 46) {
            const className = styleName;
            result.classNames.push(className);
        } else if (charCode >= 91 && charCode <= 122) {
            styleName.split(";").forEach((name) => {
                if (name) {
                    keyValue = name.split(":");
                    result[keyValue[0]] = keyValue[1];
                }
            });
        }
    });
    return result;
}

export { customStyleFn };
