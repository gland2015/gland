import jsSHA from "jssha";

export function sha512(text: string) {
    const shaObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" });
    shaObj.update(text);
    return shaObj.getHash("HEX");
}
