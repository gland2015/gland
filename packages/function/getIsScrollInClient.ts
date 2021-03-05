export function getIsScrollInClient(ele, depth = 0, refPos?: "center") {
    if (!depth) {
        depth = 0;
    }

    let rect = ele.getBoundingClientRect();

    let bottom = rect.bottom;
    let top = rect.top;
    let docHeight = document.scrollingElement.clientHeight;

    if (refPos === "center") {
        top = bottom = (rect.bottom + rect.top) / 2;
    }

    return top > depth && docHeight - bottom > depth;
}
