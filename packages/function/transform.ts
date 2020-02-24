

export { hexToBase64, hexToArrayBuffer, decodeByBrowser, dataURLtoBlob, blobToDataURL, blobToArrayBuffer };
export { stringToByte, byteToString, stringToBase64, base64ToString, stringToArrayBuffer };

type IMediatype = 'text/plain' | 'text/html' | 'application/rtf' | 'image/gif' | 'audio/basic' | 'video/x-msvideo' | 'image/svg+xml' | 'image/wmf' | any;


/**
 * @description base64转blob，同步返回blob对象
 * @param dataurl
 */
function dataURLtoBlob(dataurl) {
    let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

/**
 * @description 将blob转为base64
 * @param blob
 */
function blobToDataURL(blob: Blob): Promise<any> {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function (e) {
            resolve(e.target.result);
        };
        reader.readAsDataURL(blob);
    });
}

/**
 * 将blob转为ArrayBuffer
 * @param blob
 */
function blobToArrayBuffer(blob: Blob): Promise<any> {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function (e) {
            resolve(e.target.result);
        };
        reader.readAsArrayBuffer(blob);
    });
}

/**
 * @description 将16进制编码转为base64编码
 * @param str
 */
function hexToBase64(str: string) {
    let bString = "";
    for (let i = 0; i < str.length; i += 2) {
        bString += String.fromCharCode(parseInt(str.substr(i, 2), 16));
    }
    return btoa(bString);
}

/**
 * @description 将文件的16进制编码转换为ArrayBuffer
 * @param str hex
 * @param mediatype base64编码的mime类型，如image/wmf
 */
function hexToArrayBuffer(str: string, mediatype: IMediatype): Promise<any> {
    const base64 = hexToBase64(str);
    const dataUrl = "data:" + mediatype + ";base64," + base64;
    const blob = dataURLtoBlob(dataUrl);
    return blobToArrayBuffer(blob);
}

/**
 * @description 利用浏览器脚本来解码字符串，charset要正确，一般编码类型为'CP936'时传'GBK'，为'CP1252'时是'windows-1252'，big5是big5，utf-8是utf-8
 * @param str 被编码的字符串，格式一般为%加字符的字节的16进制编码
 * @param charset 编码的类型，默认gbk
 */
function decodeByBrowser(str: string, charset: string = "GBK"): Promise<string> {
    return new Promise(function (resolve, reject) {
        let script = document.createElement("script");
        const fnName = "__ONNATIVEDECODECHANGE__" + Math.random();
        window[fnName] = function (str) {
            delete window[fnName];
            resolve(str);
        };
        charset = charset.replace(/[\r\n]/g, "");
        script.src = `data:text/javascript;charset=${charset},(function(){window['${fnName}']('${str}')})()`;
        document.body.appendChild(script);
        document.body.removeChild(script);
    });
}

// decodeURIComponent encodeURIComponent

/**
 * 
 * @param str 
 */
function stringToByte(str: string) {
    let bytes = new Array();
    let len, c;
    len = str.length;
    for (let i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(c & 0xFF);
        }
    }
    return bytes;
}

/**
 * 
 * @param arr 
 */
function byteToString(arr: Array<any>) {
    let str = '';
    for (let i = 0; i < arr.length; i++) {
        let one = arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
            let bytesLength = v[0].length;
            let store = arr[i].toString(2).slice(7 - bytesLength);
            for (let st = 1; st < bytesLength; st++) {
                store += arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(arr[i]);
        }
    }
    return str;
}


function stringToBase64(str: string) {
    str = encodeURIComponent(str);
    return btoa(str);
}

function base64ToString(base64String: string) {
    return decodeURIComponent(atob(base64String));
}

async function stringToArrayBuffer(string: string): Promise<ArrayBuffer> {
    let dataUrl = 'data:text/plain;base64,' + stringToBase64(string);
    let blob = dataURLtoBlob(dataUrl);
    return blobToArrayBuffer(blob);
}