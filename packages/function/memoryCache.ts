import { isAsyncFn, isPromiseInstance } from "./typeJudge";

const memoryData = {};

export const EMPTY = Symbol();

/**
 *
 * @param name
 * @param obj 数据或获取数据的函数
 * @param time 有效期多少秒
 */
export function set(_id, value, expiresIn = 300) {
    let expireAt = new Date(Date.now() + expiresIn * 1000);
    memoryData[_id] = {
        value,
        expireAt
    }
}

export function get(_id) {
    const obj = memoryData[_id];
    if (!obj) return;
    if (Date.now() > obj.expireAt) {
        delete memoryData[_id]
        return;
    }
    return obj.value
}
