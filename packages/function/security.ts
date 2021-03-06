import aesjs from 'aes-js';
import md5 from 'md5';

function encrypt(string, key) {
    key = genCryptKeyFromString(key);
    const textBytes = aesjs.utils.utf8.toBytes(string);
    const aesCtr = new aesjs.ModeOfOperation.ctr(key);
    var encryptedBytes = aesCtr.encrypt(textBytes);
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    return encryptedHex
}

function decrypt(hexString, key) {
    key = genCryptKeyFromString(key);
    var encryptedBytes = aesjs.utils.hex.toBytes(hexString);
    var aesCtr = new aesjs.ModeOfOperation.ctr(key);
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    return decryptedText;
}

export { encrypt, decrypt }

function genCryptKeyFromString(string: string) {
    const result = new Uint8Array(32);
    string = md5(string);
    for (let i = 0; i < 32; i++) {
        const s = string.charAt(i);
        let code = s.charCodeAt(0);
        if (code >= 97) code -= 87;
        else if(code >= 48) code -= 48; 
        result[i] = code;
    }
    return result;
}