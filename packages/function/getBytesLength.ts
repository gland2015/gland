export function getBytesLength(str) {
    if (!str) return 0;

    let totalLength = 0;
    let charCode;
    for (let i = 0; i < str.length; i++) {
        charCode = str.charCodeAt(i);
        if (charCode < 0x007f) {
            totalLength++;
        } else if (0x0080 <= charCode && charCode <= 0x07ff) {
            totalLength += 2;
        } else if (0x0800 <= charCode && charCode <= 0xffff) {
            totalLength += 3;
        } else {
            totalLength += 4;
        }
    }
    return totalLength;
}
