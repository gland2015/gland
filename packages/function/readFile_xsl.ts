import XLSX from "xlsx";

/**
 * @description 异步函数，将input file按钮元素里的exlsl表格文件读取为对象数据
 * @param inputEle input dom元素
 */
export async function readFileXslByInput(inputEle) {
    //导入
    if (!inputEle.files) {
        return "";
    }
    const result = [];

    let i = 0;
    while (inputEle.files[i]) {
        let file = inputEle.files[i];
        const data = await readFileXml(file);
        result.push(data);
        i++;
    }
    return result;
}

export async function readFileXml(file: Blob) {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function(e) {
            let initData: any = e.target.result;
            initData = XLSX.read(initData, {
                type: "binary"
            });
            const data = XLSX.utils.sheet_to_json(initData.Sheets[initData.SheetNames[0]]);
            if (data) resolve(data);
            else reject();
        };
        reader.readAsBinaryString(file);
    });
}
