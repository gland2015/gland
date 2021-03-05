import React from "react";

// Formik Field validate

export function getUseAsyncValidate(getErrMsg: (value, props) => Promise<any>, wait = 300, valueCache = true) {
    return function useValidateName(props) {
        const attr = React.useRef({
            lastErr: null,
            lastValue: null,
            valueMap: Object.create(null),
        }).current;

        const fn = React.useMemo(() => {
            return function (value) {
                attr.lastValue = value;

                let key = value + "";
                if (key in attr.valueMap) {
                    let r = attr.valueMap[key];
                    attr.lastErr = r;
                    return r;
                }

                return new Promise(function (resolve, reject) {
                    setTimeout(async () => {
                        if (value !== attr.lastValue) {
                            return resolve(attr.lastErr);
                        }

                        let errMsg = await getErrMsg(value, props);

                        if (valueCache) {
                            attr.valueMap[key] = errMsg;
                        }

                        if (value !== attr.lastValue) {
                            return resolve(attr.lastErr);
                        }
                        attr.lastErr = errMsg;
                        resolve(errMsg);
                    }, wait);
                });
            };
        }, []);

        return fn;
    };
}
