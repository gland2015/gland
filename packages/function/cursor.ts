
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