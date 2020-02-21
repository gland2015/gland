// 实用小函数

/**
 * @description 将一个数字转化为百分数字符串
 * @param num 数字
 * @param length 保留百分位小数长度
 */
export function toPercentage(num: number, length: number = 0) {
    let result = (num * 100 + '').split('.');
    let float = length && result[1] ? '.' + result[1].substr(0, length) : '';
    return result[0] + float + '%';
}

/**
 * @description 以对象形式返回搜索参数
 * @param search url的search部分
 */
export function parseUrlSearch(search) {
    let parseResult = {};
    if (typeof search === 'string' && search) {
        if (search[0] === '?') search = search.slice(1);
        let arr = search.split('&');
        arr.forEach(value => {
            value = value.split('=');
            parseResult[value[0]] = value[1];
        });
    }
    return parseResult;
}

/**
 * 向url上添加新参数
 * @param urlSearch
 * @param search
 */
export function addUrlSearch(urlSearch = '', search = {}): string {
    let result = urlSearch;
    let searchKeys = Object.keys(search);
    if (searchKeys.length === 0) return result || '?';
    if (urlSearch.length === 0) {
        result = '?';
        searchKeys = searchKeys.map(function(key) {
            return key + '=' + search[key];
        });
        result = result + searchKeys.join('&');
        return result;
    }

    let currentSearch = parseUrlSearch(urlSearch);
    search = Object.assign(currentSearch, search);
    result = addUrlSearch('', search);
    return result;
}

/**
 * 移除url上搜索参数
 * @param urlSearch
 * @param search 要移除的search名称数组
 */
export function removeUrlSearch(urlSearch = '', search = []) {
    let result = urlSearch;
    if (search.length === 0) return result || '?';
    let currentSearch = parseUrlSearch(urlSearch);
    search.forEach(function(key) {
        delete currentSearch[key];
    });
    return addUrlSearch('', currentSearch);
}

/**
 * @description set cursor position
 * @param ele
 * @param offset
 */
export function setCursorPosition(ele, offset) {
    ele.focus();
    if (ele.nodeName === 'INPUT') {
        return ele.setSelectionRange(offset, offset);
    }
    let textNode = ele.childNodes[0];
    let selection = window.getSelection();
    let range = document.createRange();

    range.setStart(textNode, offset);
    range.setEnd(textNode, offset);
    selection.removeAllRanges();
    selection.addRange(range);
}

/**
 * 简单的将单词转为复数
 * @param s
 */
export function pluralize(s) {
    // 准确点使用
    /**
    import camelCase from 'camelcase';
    import * as pluralize from 'pluralize';
     */
    const plural = s.slice(-1) === 'y' ? `${s.slice(0, -1)}ies` : s.slice(-1) === 's' ? `${s}es` : `${s}s`;
    return plural;
}
