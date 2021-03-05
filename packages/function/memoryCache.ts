const memoryData = {};

export const EMPTY = Symbol();

export function set(_id, value, expiresIn = 300) {
    let expireAt = new Date(Date.now() + expiresIn * 1000);
    memoryData[_id] = {
        value,
        expireAt,
    };
}

export function get(_id) {
    const obj = memoryData[_id];
    if (!obj) return;
    if (Date.now() > obj.expireAt) {
        delete memoryData[_id];
        return;
    }
    return obj.value;
}
