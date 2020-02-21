export function awaitTime(ms) {
    return new Promise(function(resolve, reject) {
        setTimeout(resolve, ms);
    });
}

export function isAsyncFn(fn) {
    return typeof fn === 'function' && fn.constructor.name === 'AsyncFunction';
}

export function isGeneratorFn(fn) {
    return typeof fn === 'function' && fn.constructor.name === 'GeneratorFunction';
}

export function isSyncFn(fn) {
    return typeof fn === 'function' && fn.constructor.name === 'Function';
}

export function isFunction(fn) {
    return typeof fn === 'function';
}

export function isPromiseInstance(obj) {
    return typeof obj === 'object' && obj.constructor.name === 'Promise';
}

export function isGeneratorInstance(obj) {
    return typeof obj === 'object' && obj.constructor.constructor && obj.constructor.constructor.name === 'GeneratorFunction';
}

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
        return new Promise(function(resolve, reject) {
            fnResult
                .then(function(data) {
                    sign.inCall = false;
                    resolve(data);
                })
                .catch(function(err) {
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
    if (typeof fn !== 'function') {
        return function() {
            return fn;
        };
    }
    return function() {
        return singleCall(fn, Array.from(arguments), sign);
    };
}


