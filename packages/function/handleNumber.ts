export function centerValue(a, b, c) {
    if (a > b) {
        return b > c ? b : a > c ? c : a;
    } else {
        return a > c ? a : b > c ? c : b;
    }
}
