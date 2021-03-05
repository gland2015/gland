export const chPhoneReg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,2,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
export const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

export function isChPhone(str) {
    if (typeof str !== "string") return false;
    return str.match(chPhoneReg) ? true : false;
}

export function isEmail(str) {
    if (typeof str !== "string") return false;
    return str.match(emailReg) ? true : false;
}

export function getStrType(str) {
    if (isChPhone(str)) return "phone";
    if (isEmail(str)) return "email";
    return "username";
}
