/**
 * @description 将blob转为base64
 * @param blob
 */
export function blobToDataURL(blob: Blob): Promise<any> {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function (e) {
            resolve(e.target.result);
        };
        reader.readAsDataURL(blob);
    });
}