import React from "react";
// 自定义hooks

export { useMemoPro, useEffectPro, makeGlobal };

/**
 * @description 与useMemo类似，但第三个参数可以是一个函数，用于判断是否需要更新
 * @param Fn 会将args和preArgs,lastUpdateArgs传入
 * @param arr 若有第三个参数为函数，则将之传入新值和旧值，若第三个参数无，则若数组或对象则浅层比较，其余则直接比较
 * @param shouldUpdate 函数，返回值用于判断是否需要更新，若为非undefined的其他值则转换为布尔值用于判断是否需要更新，若无则根据第二个参数判断
 */
function useMemoPro(Fn, args, shouldUpdate) {
    const attr = React.useRef({
        needUpdate: false,
        preArgs: undefined,
        result: null,
        lastUpdateArgs: undefined
    }).current;
    let sdType = typeof shouldUpdate;
    attr.needUpdate = false;

    if (attr.result === null) {
        attr.needUpdate = true;
    } else if (sdType === "function") {
        if (shouldUpdate(args, attr.preArgs)) {
            attr.needUpdate = true;
        }
    } else if (sdType !== "undefined") {
        if (shouldUpdate) attr.needUpdate = true;
    } else {
        if (Array.isArray(args)) {
            if (!Array.isArray(attr.preArgs)) attr.needUpdate = true;
            else if (attr.preArgs.length !== args.length) attr.needUpdate = true;
            else {
                let noChange = attr.preArgs.every((value, index) => (value === attr.preArgs[index] ? true : false));
                if (!noChange) attr.needUpdate = true;
            }
        } else if (typeof args === "object") {
            if (!Object.is(args, attr.preArgs)) attr.needUpdate = true;
        } else if (args !== attr.preArgs) attr.needUpdate = true;
    }
    if (attr.needUpdate) {
        attr.result = Fn(args, attr.preArgs, attr.lastUpdateArgs);
        attr.lastUpdateArgs = args;
    }
    attr.preArgs = args;
    return attr.result;
}

/**
 * @description 与useEffect类似，但第三个参数可以是一个函数，用于判断是否需要更新
 * @param Fn 会将args和preArgs,lastUpdateArgs传入
 * @param arr 若有第三个参数为函数，则将之传入新值和旧值，若第三个参数无，则若数组或对象则浅层比较，其余则直接比较
 * @param shouldUpdate 函数，返回值用于判断是否需要更新，若为非undefined的其他值则转换为布尔值用于判断是否需要更新，若无则根据第二个参数判断
 */
function useEffectPro(Fn, args, shouldUpdate) {
    const attr = React.useRef({
        sign: true,
        preArgs: undefined,
        lastUpdateArgs: undefined
    }).current;
    let sdType = typeof shouldUpdate;
    let willUpdate = attr.sign;
    let lastUpdateArgs = attr.lastUpdateArgs;

    if (sdType === "function") {
        if (shouldUpdate(args, attr.preArgs)) {
            attr.sign = !attr.sign;
        }
    } else if (sdType !== "undefined") {
        if (shouldUpdate) attr.sign = !attr.sign;
    } else {
        if (Array.isArray(args)) {
            if (!Array.isArray(attr.preArgs)) attr.sign = !attr.sign;
            else if (attr.preArgs.length !== args.length) attr.sign = !attr.sign;
            else {
                let noChange = attr.preArgs.every((value, index) => (value === attr.preArgs[index] ? true : false));
                if (!noChange) attr.sign = !attr.sign;
            }
        } else if (typeof args === "object") {
            if (!Object.is(args, attr.preArgs)) attr.sign = !attr.sign;
        } else if (args !== attr.preArgs) attr.sign = !attr.sign;
    }

    if (willUpdate !== attr.sign) {
        attr.lastUpdateArgs = args;
    }
    attr.preArgs = args;
    React.useEffect(effectFn, [attr.sign]);

    function effectFn() {
        return Fn(args, attr.preArgs, lastUpdateArgs);
    }
}

/**
 * @description 共享对象
 * @param obj 共享的对象
 */
function makeGlobal(obj) {
    return function useGlobal() {
        return obj;
    };
}
