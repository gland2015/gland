/**
 * 选出o1中和o2不同的属性，若无，返回null
 * @param o1
 * @param o2
 */
export function diffObj(o1, o2) {
    let hasDiff = false;
    let obj = {} as any;
    for (let key in o1) {
        let v1 = o1[key];
        let v2 = o2[key];
        if (v1 !== v2) {
            hasDiff = true;
            obj[key] = v1;
        }
    }

    return hasDiff ? obj : null;
}
