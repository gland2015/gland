import { isPromiseInstance } from "./typeJudge";

/**
 * 单例调用该函数，需要传入一个空对象存储每一次的情况
 * @param fn
 * @param args
 * @param sign
 */
export function singleCall(fn, args = [], sign) {
    if (sign.inCall) return;
    sign.inCall = true;
    if (!Array.isArray(args)) args = [args];
    const fnResult = fn(...args);
    if (isPromiseInstance(fnResult)) {
        return new Promise(function (resolve, reject) {
            fnResult
                .then(function (data) {
                    sign.inCall = false;
                    resolve(data);
                })
                .catch(function (err) {
                    sign.inCall = false;
                    resolve(err);
                });
        });
    } else {
        sign.inCall = false;
        return fnResult;
    }
}

/**
 * 将函数单例化，即该函数未执行完将会跳过后面的调用
 * @param fn
 */
export function singleFn(fn) {
    let sign = {};
    if (typeof fn !== "function") {
        return function () {
            return fn;
        };
    }
    return function () {
        return singleCall(fn, Array.from(arguments), sign);
    };
}

export function makeOnceMemo(fn) {
    let hasRun;
    let value;

    return function (...args) {
        if (hasRun) {
            return value;
        }
        hasRun = true;
        value = fn(...args);

        return value;
    };
}
