/**
 * @description 将一个数字转化为百分数字符串
 * @param num 数字
 * @param length 保留百分位小数长度
 */
export function toPercentage(num: number, length: number = 0) {
    let result = (num * 100 + '').split('.');
    let float = length && result[1] ? '.' + result[1].substr(0, length) : '';
    return result[0] + float + '%';
}