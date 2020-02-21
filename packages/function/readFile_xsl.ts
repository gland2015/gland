import XLSX from "xlsx";

export default readFile_xsl;

/**
 * @description 异步函数，将input file按钮元素里的exlsl表格文件读取为对象数据
 * @param domEle input dom元素
 */
async function readFile_xsl(domEle) {
    //导入
    if (!domEle.files) {
        return "";
    }
    const result = [];

    let i = 0;
    while (domEle.files[i]) {
        let file = domEle.files[i];
        const data = await readFile(file);
        result.push(data);
        i++;
    }
    return result;
}

async function readFile(file) {
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
