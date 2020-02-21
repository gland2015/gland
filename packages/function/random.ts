
const random = {
    id, number, choice, randomLetter
}

export { random }
/**
 * 
 * @param length 
 * @param radix  max 58
 */
function id(length = 16, radix = 16) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += randomLetter(radix)
    }
}

/**
 * @description random a int between start and end
 * @param start int small
 * @param end int big
 */
function number(start: number, end: number) {
    return start + (Math.random() * (end - start + 1)) | 0;
}

/**
 * @description choice a random item  in array or object ;
 * @param container 
 */
function choice(container: Array<any> | object) {
    if (Array.isArray(container)) return container[number(0, container.length - 1)];
    let arr = Object.keys(container);
    return container[choice(arr)];
}

/**
 * 
 * @param radix max 58
 */
function randomLetter(radix = 16) {
    let num = number(0, radix);
    if (num < 10) {
        return num + '';
    }
    if (num < 34) {
        return String.fromCharCode(87 + num);
    }
    return String.fromCharCode(31 + num);
}