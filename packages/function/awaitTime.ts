/**
 * 等待一段时间
 * @param ms 毫秒
 */
export function awaitTime(ms) {
    return new Promise(function(resolve, reject) {
        setTimeout(resolve, ms);
    });
}
