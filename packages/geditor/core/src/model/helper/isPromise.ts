export function isPromiseInstance(obj) {
    return typeof obj === 'object' && obj.constructor.name === 'Promise';
}