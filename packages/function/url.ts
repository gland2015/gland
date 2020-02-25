
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
