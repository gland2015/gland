export function isPointInRect(point: { x; y }, rect: { left; right; top; bottom }) {
    if (rect.left <= point.x && point.x <= rect.right && rect.top <= point.y && point.y <= rect.bottom) {
        return true;
    }
    return false;
}

export function isEleContain(parent: HTMLElement, child: HTMLElement) {
    if (!parent || !child) return false;
    return parent.contains(child);
}
