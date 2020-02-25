import {decodeByBrowser} from './dataTransform';

export { parseWMFFile };

interface decode {
    (chars, charset: string): Promise<string>;
}
/**
 * 解析wmf图元文件为png的dataurl
 * @param blob 
 * @param decode 
 */
function parseWMFFile(blob: Blob, decode: decode | any = myDecode): Promise<string> {
    return new Promise(async function(resolve, reject) {
        let canvas = document.createElement("canvas");
        let reader: any = new FileReader();
        reader.onload = async function(event) {
            try {
                await parseWMF(new DataView(event.target.result), canvas);
                setTimeout(() => {
                    resolve(canvas.toDataURL());
                });
            } catch (e) {
                console.error(e.message);
                reject();
            }
        };
        reader.onerror = function(event) {
            console.error(event);
            reject();
        };
        reader.readAsArrayBuffer(blob);
    });

    function UserException(message) {
        this.message = message;
        this.name = "UserException";
    }

    function insertObjToFirstNull(arr, obj) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === null) {
                arr[i] = obj;
                break;
            }
        }
    }

    function drawBmpImage(ctx, base64ImgData, sx, sy, sw, sh, dx, dy, dw, dh, rop) {
        // TODO: Not implement rop
        let img = new Image();
        img.src = "data:image/bmp;base64," + base64ImgData;
        img.onload = function() {
            ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
        };
        img.onerror = function(stuff) {
            console.error("Img Onerror:", stuff);
        };
    }

    function drawPie(ctx, sxr, syr, exr, eyr, sxa, sya, exa, eya) {
        let rx = Math.abs(exr - sxr) / 2.0;
        let ry = Math.abs(eyr - syr) / 2.0;
        if (rx <= 0 || ry <= 0) {
            return;
        }

        let cx = Math.min(sxr, exr) + rx;
        let cy = Math.min(syr, eyr) + ry;

        ctx.beginPath();

        if (sxa == exa && sya == eya) {
            // Non-Rotate
            if (rx == ry) {
                ctx.arc(cx, cy, rx, 0, 2 * Math.PI);
            } else {
                ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
            }
        } else {
            // Rotate
            let sa = Math.atan2((sya - cy) * rx, (sxa - cx) * ry);

            let sx = rx * Math.cos(sa);
            let sy = ry * Math.sin(sa);

            let ea = Math.atan2((eya - cy) * rx, (exa - cx) * ry);
            let ex = rx * Math.cos(ea);
            let ey = ry * Math.sin(ea);

            let a = Math.atan2((ex - sx) * -sy - (ey - sy) * -sx, (ex - sx) * -sx + (ey - sy) * -sy);

            ctx.ellipse(cx, cy, rx, ry, a, 0, 2 * Math.PI);
        }

        ctx.stroke();
    }

    function drawRoundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke == "undefined") {
            stroke = true;
        }
        if (typeof radius === "undefined") {
            radius = 5;
        }
        if (typeof radius === "number") {
            radius = { tl: radius, tr: radius, br: radius, bl: radius };
        } else {
            var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    }

    function Int32ToHexColor(color) {
        let blue = (color >> 16) & 0xff;
        let green = (color >> 8) & 0xff;
        let red = color & 0xff;
        let result: any = (red << 16) | (green << 8) | blue;
        result =
            "#" +
            result
                .toString(16)
                .toLocaleUpperCase()
                .substr(0, 6);
        return result;
    }

    function Uint8ArrayToBase64(dv) {
        let bs = "";
        for (let i = 0; i < dv.byteLength; i++) {
            bs += String.fromCharCode(dv.getUint8(i));
        }
        return window.btoa(bs);
    }

    function dibToBmp(dib) {
        let length = dib.length;

        // dibToBmp
        let bmpData = new DataView(new ArrayBuffer(length + 14));

        /* BitmapFileHeader */
        bmpData.setUint8(0, 0x42);
        bmpData.setUint8(1, 0x4d);
        bmpData.setUint8(2, length & 0xff);
        bmpData.setUint8(3, (length >> 8) & 0xff);
        bmpData.setUint8(4, (length >> 16) & 0xff);
        bmpData.setUint8(5, (length >> 24) & 0xff);

        // reserved 1
        bmpData.setUint8(6, 0x00);
        bmpData.setUint8(7, 0x00);

        // reserved 2
        bmpData.setUint8(8, 0x00);
        bmpData.setUint8(9, 0x00);

        /* BitmapInfoHeader */
        let biSize = (dib[0] & 0xff) + ((dib[1] & 0xff) << 8) + ((dib[2] & 0xff) << 16) + ((dib[3] & 0xff) << 24);
        // offset
        let bfOffBits = biSize + 14;

        let biBitCount = (dib[14] & 0xff) + ((dib[15] & 0xff) << 8);

        let clrUsed = (dib[32] & 0xff) + ((dib[33] & 0xff) << 8) + ((dib[34] & 0xff) << 16) + ((dib[35] & 0xff) << 24);

        switch (biBitCount) {
            case 1:
                bfOffBits += (0x1 + 1) * 4;
                break;
            case 4:
                bfOffBits += (0xf + 1) * 4;
                break;
            case 8:
                bfOffBits += (0xff + 1) * 4;
                break;
            case 16:
                bfOffBits += clrUsed == 0 ? 0 : (0xffff + 1) * 4;
                break;
            case 24:
                bfOffBits += clrUsed == 0 ? 0 : (0xffffff + 1) * 4;
                break;
            case 32:
                bfOffBits += clrUsed == 0 ? 0 : (0xffffffff + 1) * 4;
                break;
        }

        bmpData.setUint8(10, bfOffBits & 0xff);
        bmpData.setUint8(11, (bfOffBits >> 8) & 0xff);
        bmpData.setUint8(12, (bfOffBits >> 16) & 0xff);
        bmpData.setUint8(13, (bfOffBits >> 24) & 0xff);

        // Copy dib data
        for (let i = 0; i < length; i++) {
            bmpData.setUint8(14 + i, dib[i]);
        }

        return bmpData;
    }

    function getCharset(charset) {
        switch (charset) {
            case 0:
                return "CP1252";
            case 2:
                return "CP1252";
            case 77:
                return "MacRoman";
            case 128:
                return "CP932";
            case 129:
                return "CP949";
            case 130:
                return "Johab";
            case 134:
                return "CP936";
            case 136:
                return "big5";
            case 161:
                return "CP1253";
            case 162:
                return "CP1254";
            case 163:
                return "CP1258";
            case 177:
                return "CP1255";
            case 178:
                return "CP1256";
            case 186:
                return "CP1257";
            case 204:
                return "CP1251";
            case 222:
                return "CP874";
            case 238:
                return "CP1250";
            case 255:
                return "CP1252";
            default:
                return "CP1252";
        }
    }

    function toAbsoluteX(x, ww, wx, mx, wox, wsx) {
        return ((ww >= 0 ? 1 : -1) * (mx * x - (wx + wox))) / wsx;
    }

    function toAbsoluteY(y, wh, wy, my, woy, wsy) {
        return ((wh >= 0 ? 1 : -1) * (my * y - (wy + woy))) / wsy;
    }

    async function parseWMF(dv, canvas) {
        const RECORD_EOF = 0x0000;
        const RECORD_REALIZE_PALETTE = 0x0035;
        const RECORD_SET_PALETTE_ENTRIES = 0x0037;
        const RECORD_SET_BK_MODE = 0x0102;
        const RECORD_SET_MAP_MODE = 0x0103;
        const RECORD_SET_ROP2 = 0x0104;
        const RECORD_SET_REL_ABS = 0x0105;
        const RECORD_SET_POLY_FILL_MODE = 0x0106;
        const RECORD_SET_STRETCH_BLT_MODE = 0x0107;
        const RECORD_SET_TEXT_CHARACTER_EXTRA = 0x0108;
        const RECORD_RESTORE_DC = 0x0127;
        const RECORD_RESIZE_PALETTE = 0x0139;
        const RECORD_DIB_CREATE_PATTERN_BRUSH = 0x0142;
        const RECORD_SET_LAYOUT = 0x0149;
        const RECORD_SET_BK_COLOR = 0x0201;
        const RECORD_SET_TEXT_COLOR = 0x0209;
        const RECORD_OFFSET_VIEWPORT_ORG_EX = 0x0211;
        const RECORD_LINE_TO = 0x0213;
        const RECORD_MOVE_TO_EX = 0x0214;
        const RECORD_OFFSET_CLIP_RGN = 0x0220;
        const RECORD_FILL_RGN = 0x0228;
        const RECORD_SET_MAPPER_FLAGS = 0x0231;
        const RECORD_SELECT_PALETTE = 0x0234;
        const RECORD_POLYGON = 0x0324;
        const RECORD_POLYLINE = 0x0325;
        const RECORD_SET_TEXT_JUSTIFICATION = 0x020a;
        const RECORD_SET_WINDOW_ORG_EX = 0x020b;
        const RECORD_SET_WINDOW_EXT_EX = 0x020c;
        const RECORD_SET_VIEWPORT_ORG_EX = 0x020d;
        const RECORD_SET_VIEWPORT_EXT_EX = 0x020e;
        const RECORD_OFFSET_WINDOW_ORG_EX = 0x020f;
        const RECORD_SCALE_WINDOW_EXT_EX = 0x0410;
        const RECORD_SCALE_VIEWPORT_EXT_EX = 0x0412;
        const RECORD_EXCLUDE_CLIP_RECT = 0x0415;
        const RECORD_INTERSECT_CLIP_RECT = 0x0416;
        const RECORD_ELLIPSE = 0x0418;
        const RECORD_FLOOD_FILL = 0x0419;
        const RECORD_FRAME_RGN = 0x0429;
        const RECORD_ANIMATE_PALETTE = 0x0436;
        const RECORD_TEXT_OUT = 0x0521;
        const RECORD_POLY_POLYGON = 0x0538;
        const RECORD_EXT_FLOOD_FILL = 0x0548;
        const RECORD_RECTANGLE = 0x041b;
        const RECORD_SET_PIXEL = 0x041f;
        const RECORD_ROUND_RECT = 0x061c;
        const RECORD_PAT_BLT = 0x061d;
        const RECORD_SAVE_DC = 0x001e;
        const RECORD_PIE = 0x081a;
        const RECORD_STRETCH_BLT = 0x0b23;
        const RECORD_ESCAPE = 0x0626;
        const RECORD_INVERT_RGN = 0x012a;
        const RECORD_PAINT_RGN = 0x012b;
        const RECORD_SELECT_CLIP_RGN = 0x012c;
        const RECORD_SELECT_OBJECT = 0x012d;
        const RECORD_SET_TEXT_ALIGN = 0x012e;
        const RECORD_ARC = 0x0817;
        const RECORD_CHORD = 0x0830;
        const RECORD_BIT_BLT = 0x0922;
        const RECORD_EXT_TEXT_OUT = 0x0a32;
        const RECORD_SET_DIBITS_TO_DEVICE = 0x0d33;
        const RECORD_DIB_BIT_BLT = 0x0940;
        const RECORD_DIB_STRETCH_BLT = 0x0b41;
        const RECORD_STRETCH_DIBITS = 0x0f43;
        const RECORD_DELETE_OBJECT = 0x01f0;
        const RECORD_CREATE_PALETTE = 0x00f7;
        const RECORD_CREATE_PATTERN_BRUSH = 0x01f9;
        const RECORD_CREATE_PEN_INDIRECT = 0x02fa;
        const RECORD_CREATE_FONT_INDIRECT = 0x02fb;
        const RECORD_CREATE_BRUSH_INDIRECT = 0x02fc;
        const RECORD_CREATE_RECT_RGN = 0x06ff;

        canvas.width = 480;
        canvas.height = 320;
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let offset = 0,
            offset_bk = 0;
        let mtType = 0,
            mtHeaderSize = 0;

        // DC window
        let wx = 0,
            wy = 0,
            ww = 0,
            wh = 0;

        // DC window offset
        let wox = 0,
            woy = 0;

        // DC window scale
        let wsx = 1.0,
            wsy = 1.0;

        // DC mapping scale
        let mx = 1.0,
            my = 1.0;

        let charset: string | number = 0;
        let textColor = "#000";
        let fillMode = "evenodd";

        let key = dv.getUint32(offset, true);
        offset += 4;
        if (key == 0x9ac6cdd7) {
            mtType = dv.getUint16(offset, true);
            offset += 2;
            mtHeaderSize = dv.getUint16(offset, true);
            offset += 2;
        } else {
            mtType = key & 0x0000ffff;
            mtHeaderSize = (key & 0xffff0000) >> 16;
        }

        offset += 2;
        offset += 4;
        let mtNoObjects = dv.getUint16(offset, true);
        offset += 2;
        offset += 4;
        offset += 2;

        if (mtType != 1 || mtHeaderSize != 9) {
            throw new UserException("Invalid file format.");
        }

        let objs = new Array(mtNoObjects);
        for (let i = 0; i < mtNoObjects; i++) {
            objs[i] = null;
        }

        while (true) {
            let size = dv.getUint32(offset, true) - 3;
            offset += 4;
            let id = dv.getUint16(offset, true);
            offset += 2;

            if (id == RECORD_EOF) {
                break; // Last record
            }

            offset_bk = offset;

            switch (id) {
                case RECORD_REALIZE_PALETTE: {
                    break;
                }
                case RECORD_SET_PALETTE_ENTRIES: {
                    var entries = new Array[dv.getUint16(offset, true)]();
                    offset += 2;

                    for (let i = 0; i < entries.length; i++) {
                        entries[i] = dv.getInt32(offset, true);
                        offset += 4;
                    }
                    break;
                }
                case RECORD_SET_BK_MODE: {
                    break;
                }
                case RECORD_SET_MAP_MODE: {
                    break;
                }
                case RECORD_SET_ROP2: {
                    break;
                }
                case RECORD_SET_REL_ABS: {
                    break;
                }
                case RECORD_SET_POLY_FILL_MODE: {
                    let mode = dv.getInt16(offset, true);
                    offset += 2;
                    fillMode = mode == 0x01 ? "evenodd" : "nonzero";
                    break;
                }
                case RECORD_SET_STRETCH_BLT_MODE: {
                    break;
                }
                case RECORD_SET_TEXT_CHARACTER_EXTRA: {
                    break;
                }
                case RECORD_RESTORE_DC: {
                    break;
                }
                case RECORD_RESIZE_PALETTE: {
                    break;
                }
                case RECORD_DIB_CREATE_PATTERN_BRUSH: {
                    break;
                }
                case RECORD_SET_LAYOUT: {
                    break;
                }
                case RECORD_SET_BK_COLOR: {
                    let color = dv.getInt32(offset, true);
                    offset += 4;
                    color = Int32ToHexColor(color);
                    ctx.fillStyle = color;
                    break;
                }
                case RECORD_SET_TEXT_COLOR: {
                    break;
                }
                case RECORD_OFFSET_VIEWPORT_ORG_EX: {
                    break;
                }
                case RECORD_LINE_TO: {
                    let ey = dv.getInt16(offset, true);
                    offset += 2;
                    let ex = dv.getInt16(offset, true);
                    offset += 2;
                    ctx.lineTo(ex, ey);
                    ctx.stroke();
                    break;
                }
                case RECORD_MOVE_TO_EX: {
                    let y = dv.getInt16(offset, true);
                    offset += 2;
                    let x = dv.getInt16(offset, true);
                    offset += 2;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    break;
                }
                case RECORD_OFFSET_CLIP_RGN: {
                    break;
                }
                case RECORD_FILL_RGN: {
                    break;
                }
                case RECORD_SET_MAPPER_FLAGS: {
                    break;
                }
                case RECORD_SELECT_PALETTE: {
                    break;
                }
                case RECORD_POLYGON: {
                    let numOfPoints = dv.getInt16(offset, true);
                    offset += 2;

                    ctx.beginPath();

                    let x = toAbsoluteX(dv.getInt16(offset, true), ww, wx, mx, wox, wsx);
                    offset += 2;
                    let y = toAbsoluteY(dv.getInt16(offset, true), wh, wy, my, woy, wsy);
                    offset += 2;
                    ctx.moveTo(x, y);

                    for (let i = 1; i < numOfPoints; i++) {
                        x = toAbsoluteX(dv.getInt16(offset, true), ww, wx, mx, wox, wsx);
                        offset += 2;
                        y = toAbsoluteY(dv.getInt16(offset, true), wh, wy, my, woy, wsy);
                        offset += 2;
                        ctx.lineTo(x, y);
                    }

                    ctx.closePath();
                    ctx.fill(fillMode);
                    ctx.stroke();
                    break;
                }
                case RECORD_POLYLINE: {
                    let numOfPoints = dv.getInt16(offset, true);
                    offset += 2;

                    ctx.beginPath();

                    let x = toAbsoluteX(dv.getInt16(offset, true), ww, wx, mx, wox, wsx);
                    offset += 2;
                    let y = toAbsoluteY(dv.getInt16(offset, true), wh, wy, my, woy, wsy);
                    offset += 2;
                    ctx.moveTo(x, y);

                    for (let i = 1; i < numOfPoints; i++) {
                        x = toAbsoluteX(dv.getInt16(offset, true), ww, wx, mx, wox, wsx);
                        offset += 2;
                        y = toAbsoluteY(dv.getInt16(offset, true), wh, wy, my, woy, wsy);
                        offset += 2;
                        ctx.lineTo(x, y);
                    }

                    ctx.stroke();
                    break;
                }
                case RECORD_SET_TEXT_JUSTIFICATION: {
                    break;
                }
                case RECORD_SET_WINDOW_ORG_EX: {
                    wy = dv.getInt16(offset, true);
                    offset += 2;
                    wx = dv.getInt16(offset, true);
                    offset += 2;
                    break;
                }
                case RECORD_SET_WINDOW_EXT_EX: {
                    let height = dv.getInt16(offset, true);
                    offset += 2;
                    let width = dv.getInt16(offset, true);
                    offset += 2;

                    let inMemCanvas = document.createElement("canvas");
                    let inMemCtx = inMemCanvas.getContext("2d");
                    inMemCtx.drawImage(canvas, 0, 0);
                    canvas.width = Math.abs(width);
                    canvas.height = Math.abs(height);
                    ctx.drawImage(inMemCanvas, 0, 0);

                    ww = width;
                    wh = height;
                    break;
                }
                case RECORD_SET_VIEWPORT_ORG_EX: {
                    break;
                }
                case RECORD_SET_VIEWPORT_EXT_EX: {
                    break;
                }
                case RECORD_OFFSET_WINDOW_ORG_EX: {
                    break;
                }
                case RECORD_SCALE_WINDOW_EXT_EX: {
                    break;
                }
                case RECORD_SCALE_VIEWPORT_EXT_EX: {
                    break;
                }
                case RECORD_EXCLUDE_CLIP_RECT: {
                    break;
                }
                case RECORD_INTERSECT_CLIP_RECT: {
                    break;
                }
                case RECORD_ELLIPSE: {
                    let ey = dv.getInt16(offset, true);
                    offset += 2;
                    let ex = dv.getInt16(offset, true);
                    offset += 2;
                    let sy = dv.getInt16(offset, true);
                    offset += 2;
                    let sx = dv.getInt16(offset, true);
                    offset += 2;

                    ctx.beginPath();
                    ctx.ellipse(ex, ey, sx, sy, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    break;
                }
                case RECORD_FLOOD_FILL: {
                    break;
                }
                case RECORD_FRAME_RGN: {
                    break;
                }
                case RECORD_ANIMATE_PALETTE: {
                    break;
                }
                case RECORD_TEXT_OUT: {
                    break;
                }
                case RECORD_POLY_POLYGON: {
                    let numOfpolygons = dv.getInt16(offset, true);
                    offset += 2;
                    let numOfPoints = new Array(numOfpolygons);
                    for (let i = 0; i < numOfpolygons; i++) {
                        numOfPoints[i] = dv.getInt16(offset, true);
                        offset += 2;
                    }

                    for (let i = 0; i < numOfpolygons; i++) {
                        ctx.beginPath();

                        let x = toAbsoluteX(dv.getInt16(offset, true), ww, wx, mx, wox, wsx);
                        offset += 2;
                        let y = toAbsoluteY(dv.getInt16(offset, true), wh, wy, my, woy, wsy);
                        offset += 2;
                        ctx.moveTo(x, y);

                        for (let j = 1; j < numOfPoints[i]; j++) {
                            x = toAbsoluteX(dv.getInt16(offset, true), ww, wx, mx, wox, wsx);
                            offset += 2;
                            y = toAbsoluteY(dv.getInt16(offset, true), wh, wy, my, woy, wsy);
                            offset += 2;
                            ctx.lineTo(x, y);
                        }

                        ctx.closePath();
                        ctx.fill(fillMode);
                        ctx.stroke();
                    }
                    break;
                }
                case RECORD_EXT_FLOOD_FILL: {
                    break;
                }
                case RECORD_RECTANGLE: {
                    let ey = dv.getInt16(offset, true);
                    offset += 2;
                    let ex = dv.getInt16(offset, true);
                    offset += 2;
                    let sy = dv.getInt16(offset, true);
                    offset += 2;
                    let sx = dv.getInt16(offset, true);
                    offset += 2;
                    ctx.rect(sx, sy, ex - sx, ey - sy);
                    ctx.fill();
                    ctx.stroke();
                    break;
                }
                case RECORD_SET_PIXEL: {
                    let color = dv.getInt32(offset, true);
                    offset += 4;
                    let y = dv.getInt16(offset, true);
                    offset += 2;
                    let x = dv.getInt16(offset, true);
                    offset += 2;
                    color = Int32ToHexColor(color);
                    ctx.fillStyle = color;
                    ctx.fillRect(x, y, 1, 1);
                    break;
                }
                case RECORD_ROUND_RECT: {
                    let rh = dv.getInt16(offset, true);
                    offset += 2;
                    let rw = dv.getInt16(offset, true);
                    offset += 2;
                    let ey = dv.getInt16(offset, true);
                    offset += 2;
                    let ex = dv.getInt16(offset, true);
                    offset += 2;
                    let sy = dv.getInt16(offset, true);
                    offset += 2;
                    let sx = dv.getInt16(offset, true);
                    offset += 2;
                    drawRoundRect(ctx, sx, sy, ex - sx, ey - sy, (rh + rw) / 2, false, true);
                    break;
                }
                case RECORD_PAT_BLT: {
                    break;
                }
                case RECORD_SAVE_DC: {
                    break;
                }
                case RECORD_PIE: {
                    let eyr = dv.getInt16(offset, true);
                    offset += 2;
                    let exr = dv.getInt16(offset, true);
                    offset += 2;
                    let syr = dv.getInt16(offset, true);
                    offset += 2;
                    let sxr = dv.getInt16(offset, true);
                    offset += 2;
                    let ey = dv.getInt16(offset, true);
                    offset += 2;
                    let ex = dv.getInt16(offset, true);
                    offset += 2;
                    let sy = dv.getInt16(offset, true);
                    offset += 2;
                    let sx = dv.getInt16(offset, true);
                    offset += 2;

                    drawPie(ctx, sx, sy, ex, ey, sxr, syr, exr, eyr);
                    break;
                }
                case RECORD_STRETCH_BLT: {
                    break;
                }
                case RECORD_ESCAPE: {
                    break;
                }
                case RECORD_INVERT_RGN: {
                    break;
                }
                case RECORD_PAINT_RGN: {
                    break;
                }
                case RECORD_SELECT_CLIP_RGN: {
                    break;
                }
                case RECORD_SELECT_OBJECT: {
                    let objID = dv.getUint16(offset, true);
                    offset += 2;
                    let obj = objs[objID];
                    switch (obj.type) {
                        case "PEN":
                            ctx.lineWidth = obj.width;
                            ctx.strokeStyle = obj.color;
                            break;
                        case "BRUSH":
                            ctx.fillStyle = obj.color;
                            break;
                        case "FONT":
                            ctx.font = `${obj.italic ? "italic " : ""}${obj.weight} ${Math.abs(obj.height)}px ${obj.faceName}`;
                            break;
                    }
                    break;
                }
                case RECORD_SET_TEXT_ALIGN: {
                    let align = dv.getInt16(offset, true);
                    offset += 2;

                    let alignH = align & (0x00 | 0x06 | 0x02);
                    let alignV = align & (0x08 | 0x00 | 0x18);

                    if (alignH == 0x02) {
                        ctx.textAlign = "right";
                    } else if (alignH == 0x06) {
                        ctx.textAlign = "center";
                    } else {
                        ctx.textAlign = "left";
                    }

                    if (alignV == 0x08) {
                        ctx.textBaseline = "bottom";
                    } else if (alignV == 0x00) {
                        ctx.textBaseline = "top";
                    } else {
                        ctx.textBaseline = "alphabetic";
                    }

                    break;
                }
                case RECORD_ARC: {
                    break;
                }
                case RECORD_CHORD: {
                    break;
                }
                case RECORD_BIT_BLT: {
                    let rop = dv.getUint32(offset, true);
                    offset += 4;
                    let sy = dv.getInt16(offset, true);
                    offset += 2;
                    let sx = dv.getInt16(offset, true);
                    offset += 2;
                    let height = dv.getInt16(offset, true);
                    offset += 2;
                    let width = dv.getInt16(offset, true);
                    offset += 2;
                    let dy = dv.getInt16(offset, true);
                    offset += 2;
                    let dx = dv.getInt16(offset, true);
                    offset += 2;

                    let dib = new Uint8Array(dv.buffer, offset, size * 2 - 16);
                    let base64 = Uint8ArrayToBase64(dibToBmp(dib));
                    drawBmpImage(ctx, base64, sx, sy, width, height, dx, dy, width, height, rop);

                    break;
                }
                case RECORD_EXT_TEXT_OUT: {
                    // TODO
                    let rsize = size;

                    let y = toAbsoluteY(dv.getInt16(offset, true), wh, wy, my, woy, wsy);
                    offset += 2;
                    let x = toAbsoluteX(dv.getInt16(offset, true), ww, wx, mx, wox, wsx);
                    offset += 2;

                    let count = dv.getInt16(offset, true);
                    offset += 2;
                    let options = dv.getUint16(offset, true);
                    offset += 2;
                    rsize -= 4;

                    let rect = null;
                    if ((options & 0x0006) > 0) {
                        rect = new Array(4);
                        rect[0] = dv.getInt16(offset, true);
                        offset += 2;
                        rect[1] = dv.getInt16(offset, true);
                        offset += 2;
                        rect[2] = dv.getInt16(offset, true);
                        offset += 2;
                        rect[3] = dv.getInt16(offset, true);
                        offset += 2;
                        rsize -= 4;
                    }

                    let buffer = new Uint8Array(count);
                    for (let i = 0; i < count; i++) {
                        let c = dv.getInt8(offset++, true);
                        buffer[i] = c;
                    }
                    let text = await decode(buffer, charset);

                    let fillStyle_bk = ctx.fillStyle;
                    ctx.fillStyle = textColor;
                    ctx.fillText(text, x, y);
                    ctx.fillStyle = fillStyle_bk;
                    break;
                }
                case RECORD_SET_DIBITS_TO_DEVICE: {
                    break;
                }
                case RECORD_DIB_BIT_BLT: {
                    let isRop = false;

                    let rop = dv.getUint32(offset, true);
                    offset += 4;
                    let sy = dv.getInt16(offset, true);
                    offset += 2;
                    let sx = dv.getInt16(offset, true);
                    offset += 2;
                    let height = dv.getInt16(offset, true);
                    offset += 2;
                    if (height == 0) {
                        height = dv.getInt16(offset, true);
                        offset += 2;
                        isRop = true;
                    }
                    let width = dv.getInt16(offset, true);
                    offset += 2;
                    let dy = dv.getInt16(offset, true);
                    offset += 2;
                    let dx = dv.getInt16(offset, true);
                    offset += 2;

                    if (!isRop) {
                        let dib = new Uint8Array(dv.buffer, offset, size * 2 - 16);
                        let base64 = Uint8ArrayToBase64(dibToBmp(dib));
                        drawBmpImage(ctx, base64, sx, sy, width, height, dx, dy, width, height, rop);
                    }
                    break;
                }
                case RECORD_DIB_STRETCH_BLT: {
                    let rop = dv.getUint32(offset, true);
                    offset += 4;
                    let sh = dv.getInt16(offset, true);
                    offset += 2;
                    let sw = dv.getInt16(offset, true);
                    offset += 2;
                    let sx = dv.getInt16(offset, true);
                    offset += 2;
                    let sy = dv.getInt16(offset, true);
                    offset += 2;
                    let dh = dv.getInt16(offset, true);
                    offset += 2;
                    let dw = dv.getInt16(offset, true);
                    offset += 2;
                    let dy = dv.getInt16(offset, true);
                    offset += 2;
                    let dx = dv.getInt16(offset, true);
                    offset += 2;

                    let dib = new Uint8Array(dv.buffer, offset, size * 2 - 20);
                    let base64 = Uint8ArrayToBase64(dibToBmp(dib));

                    drawBmpImage(ctx, base64, sx, sy, sw, sh, dx, dy, dw, dh, rop);
                    break;
                }
                case RECORD_STRETCH_DIBITS: {
                    let rop = dv.getUint32(offset, true);
                    offset += 4;
                    let usage = dv.getUint16(offset, true);
                    offset += 2;
                    let sh = dv.getInt16(offset, true);
                    offset += 2;
                    let sw = dv.getInt16(offset, true);
                    offset += 2;
                    let sy = dv.getInt16(offset, true);
                    offset += 2;
                    let sx = dv.getInt16(offset, true);
                    offset += 2;
                    let dh = dv.getInt16(offset, true);
                    offset += 2;
                    let dw = dv.getInt16(offset, true);
                    offset += 2;
                    let dy = dv.getInt16(offset, true);
                    offset += 2;
                    let dx = dv.getInt16(offset, true);
                    offset += 2;

                    let dib = new Uint8Array(dv.buffer, offset, size * 2 - 22);
                    let base64 = Uint8ArrayToBase64(dibToBmp(dib));

                    drawBmpImage(ctx, base64, sx, sy, sw, sh, dx, dy, dw, dh, rop);

                    break;
                }
                case RECORD_DELETE_OBJECT: {
                    let objID = dv.getUint16(offset, true);
                    offset += 2;
                    objs[objID] = null;
                    break;
                }
                case RECORD_CREATE_PALETTE: {
                    let version = dv.getUint16(offset, true);
                    offset += 2;
                    let entries = new Array(dv.getUint16(offset, true));
                    offset += 2;
                    for (let i = 0; i < entries.length; i++) {
                        entries[i] = dv.getInt32(offset, true);
                        offset += 4;
                    }

                    insertObjToFirstNull(objs, {
                        type: "PALETTE",
                        entries: entries
                    });

                    break;
                }
                case RECORD_CREATE_PATTERN_BRUSH: {
                    let image = new Int8Array(dv.buffer, offset, size * 2);

                    insertObjToFirstNull(objs, {
                        type: "PATTERN_BRUSH",
                        image: image
                    });

                    break;
                }
                case RECORD_CREATE_PEN_INDIRECT: {
                    let style = dv.getUint16(offset, true);
                    offset += 2;
                    let width = dv.getInt16(offset, true);
                    offset += 2;
                    dv.getInt16(offset, true);
                    offset += 2;
                    let color = Int32ToHexColor(dv.getInt32(offset, true));
                    offset += 4;

                    insertObjToFirstNull(objs, {
                        type: "PEN",
                        style: style,
                        color: color,
                        width: width
                    });

                    break;
                }
                case RECORD_CREATE_FONT_INDIRECT: {
                    let height = dv.getInt16(offset, true);
                    offset += 2;
                    let width = dv.getInt16(offset, true);
                    offset += 2;
                    let escapement = dv.getInt16(offset, true);
                    offset += 2;
                    let orientation = dv.getInt16(offset, true);
                    offset += 2;
                    let weight = dv.getInt16(offset, true);
                    offset += 2;
                    let italic = dv.getInt8(offset, true) == 1;
                    offset++;
                    let underline = dv.getInt8(offset, true) == 1;
                    offset++;
                    let strikeout = dv.getInt8(offset, true) == 1;
                    offset++;
                    charset = dv.getUint8(offset, true);
                    offset++;
                    let outPrecision = dv.getInt8(offset, true);
                    offset++;
                    let clipPrecision = dv.getInt8(offset, true);
                    offset++;
                    let quality = dv.getInt8(offset, true);
                    offset++;
                    let pitchAndFamily = dv.getInt8(offset, true);
                    offset++;

                    let count = size * 2 - 18;
                    let buffer = new Uint8Array(count);

                    for (let i = 0; i < count; i++) {
                        let c = dv.getInt8(offset++, true);
                        if (c == 0) {
                            break;
                        }
                        buffer[i] = c;
                    }
                    charset = getCharset(charset);
                    let faceName = await decode(buffer, charset);
                    faceName = faceName.replace(/\u0000/g, "");
                    let obj = {
                        type: "FONT",
                        faceName: faceName,
                        height: height,
                        width: width,
                        escapement: escapement,
                        orientation: orientation,
                        weight: weight,
                        italic: italic,
                        underline: underline,
                        strikeout: strikeout,
                        charset: charset,
                        outPrecision: outPrecision,
                        clipPrecision: clipPrecision,
                        quality: quality,
                        pitchAndFamily: pitchAndFamily
                    };

                    insertObjToFirstNull(objs, obj);
                    break;
                }
                case RECORD_CREATE_BRUSH_INDIRECT: {
                    let style = dv.getUint16(offset, true);
                    offset += 2;
                    let color = Int32ToHexColor(dv.getInt32(offset, true));
                    offset += 4;
                    let hatch = dv.getUint16(offset, true);
                    offset += 2;

                    insertObjToFirstNull(objs, {
                        type: "BRUSH",
                        style: style,
                        color: color,
                        hatch: hatch
                    });

                    break;
                }
                case RECORD_CREATE_RECT_RGN: {
                    let ey = dv.getInt16(offset, true);
                    offset += 2;
                    let ex = dv.getInt16(offset, true);
                    offset += 2;
                    let sy = dv.getInt16(offset, true);
                    offset += 2;
                    let sx = dv.getInt16(offset, true);
                    offset += 2;

                    insertObjToFirstNull(objs, {
                        type: "RECT_RGN",
                        sx: sx,
                        sy: sy,
                        ex: ex,
                        ey: ey
                    });

                    break;
                }
                default: {
                    console.info("unsuppored id find: " + id + " (size=" + size + ")");
                }
            }

            offset = offset_bk + size * 2;
        }
    }
}

function myDecode(codes, charset) {
    const charsetMap = {
        CP936: "GBK",
        CP1252: "windows-1252"
        //big5: 'big5',
        //['utf-8']: 'utf-8',
    };
    return new Promise(async function(resolve, reject) {
        let chars;
        let codeStrs;
        if (charsetMap[charset]) charset = charsetMap[charset];
        else {
            console.log("尚未知字符集", charset);
            charset = getCharset(charset);
        }
        codeStrs = toHexString(codes);
        chars = await decodeByBrowser(codeStrs, charset);
        resolve(chars || "");
    });

    function toHexString(uint8Array) {
        let result = "";
        uint8Array.forEach(function(value) {
            if (value) {
                result += "%" + value.toString(16);
            }
        });
        return result;
    }

    // 以cp开头的未知的字符集
    function getCharset(str) {
        if (str.match(/^CP/)) return "windows-" + str.match(/\d+/)[0];
        else return str;
    }
}

