
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
