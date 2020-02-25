/**
 * 获取随机id
 * @param length 
 * @param radix  max 62
 */
export function id(length = 16, radix = 16) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += randomLetter(radix)
    }
    return result;
}

/**
 * 获取uuid
 */
export function uuid() {
    let result: any = Date.now() + "";
    let radStr = "";
    while (radStr.length < 30) {
        radStr += (Math.random() + "").slice(2);
    }
    radStr = radStr.substr(0, 30);
    result = result + radStr;
    result = BigInt(result);
    return result.toString(36);
}

/**
 * @description random a int between start and end
 * @param start int small
 * @param end int big
 */
export function number(start: number, end: number) {
    return start + (Math.random() * (end - start + 1)) | 0;
}

/**
 * @description choice a random item  in array, string or object ;
 * @param container 
 */
export function choice(container: Array<any> | object | string) {
    if (Array.isArray(container)) return container[number(0, container.length - 1)];
    let arr = Object.keys(container);
    return container[choice(arr)];
}

/**
 * 获取随机数字
 * @param radix max 62
 */
export function randomLetter(radix = 16) {
    let num = number(0, radix);
    if (num < 10) {
        return num + '';
    }
    if (num < 34) {
        return String.fromCharCode(87 + num);
    }
    return String.fromCharCode(31 + num);
}