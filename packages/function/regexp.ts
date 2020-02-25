/**
 * @description 刪除多行字符中行开头前的空字符
 * @param str 
 */
export function neatStr(str: string) {
    str = str.trim();
    str = str.replace(/\n\s*/g, '\n');
    return str;
}

/**
 * @description 删除js注释
 * @param str 
 */
export function deleteNote(str:string) {
    str = str.replace(/\/\/[^\n]*/g, '');
    str = str.replace(/\/\*[\s\S]*?\*\//g, '')
    return str;
}

/**
 * @description 验证中国手机号
 */
export function isPhoneNumber(phoneNum:string):boolean {
    let reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
    return reg.test(phoneNum);
}

/**
 * 转换首字母小写
 * @param str 
 */
export function transformFirstCharLowerCase(str:string) {
    return str.replace(/^[a-z-A-Z]/,  function(s) { return s.toLowerCase() })
}