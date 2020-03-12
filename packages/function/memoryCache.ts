import { isAsyncFn, isPromiseInstance } from "./typeJudge";

const data = {};

export const EMPTY = Symbol();

/**
 *
 * @param name
 * @param obj 数据或获取数据的函数
 * @param time 有效期多少秒
 */
export function set(name, obj, time = 3600) {
    let value = obj;
    if (typeof obj === "function") {
        value = obj();
    }
    data[name] = {
        expireIn: Date.now() + time * 1000,
        value,
        obj,
        time
    };
}

export function get(name) {
    if (!data.hasOwnProperty(name)) {
        return EMPTY;
    }
    if (Date.now() > data[name].expireIn) {
        if (typeof data[name].obj === "function") {
            const value = data[name].obj();
            data[name].expireIn = Date.now() + data[name].time * 1000;
            data[name].value = value;
            return value;
        } else {
            delete data[name];
            return EMPTY;
        }
    }
    return data[name].value;
    // if()
}
