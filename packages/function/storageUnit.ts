export function formatByteText(byte: number) {
    if (!byte) return "0B";
    if (byte < 1024) return byte.toFixed(2) + "B";
    byte = byte / 1024;
    if (byte < 1024) {
        return byte.toFixed(2) + "KB";
    }

    byte = byte / 1024;
    if (byte < 1024) {
        return byte.toFixed(2) + "MB";
    }

    byte = byte / 1024;
    if (byte < 1024) {
        return byte.toFixed(2) + "GB";
    }

    byte = byte / 1024;
    return byte.toFixed(2) + "TB";
}
