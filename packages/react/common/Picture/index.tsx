import React from "react";
import clsx from "clsx";
import {jss} from "../jss";
import { useRefBound } from "../hooks/useRefBound";

const jssSheet = jss.createStyleSheet({
    root: {
        position: "relative",
        height: "100%",
        width: "100%",
        flexGrow: 1,
        userSelect: "none",
        textAlign: "center",
        boxSizing: "border-box",
    },
    container: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: "auto",
        overflow: "hidden",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 0,
        "& img": {
            margin: "-100%",
            verticalAlign: "middle",
            width: "auto",
            height: "auto",
        },
    },
    img_normal: {
        maxWidth: "100%",
        maxHeight: "100%",
        cursor: "zoom-in",
    },
    img_disable: {
        cursor: "inherit",
    },
    img_zoom: {
        cursor: "move",
    },
    fixed: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1000,
        backgroundColor: "rgba(0,0,0, 0.8)",
    },
});

const classes = jssSheet.classes;

interface Picture extends React.HTMLAttributes<HTMLDivElement> {
    src: string;
    mode: "absolute" | "fixed" | null;
    fixedStyle?: React.CSSProperties;
    fixedClassName?: string;
    fixedMaskStyle?: React.CSSProperties;
    fixedMaskClassName?: string;
}

export function Picture(props: Picture) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }
    const { src, mode, fixedStyle, fixedClassName, fixedMaskStyle, fixedMaskClassName, className, ...rest } = props;

    const [isFixed, setIsFixed] = React.useState(false);

    return (
        <div {...rest} className={clsx(classes.root, className)}>
            <ZoomableImage
                key={mode}
                src={src}
                disable={mode !== "absolute"}
                onImgClick={
                    mode === "fixed"
                        ? (e) => {
                              setIsFixed(true);
                          }
                        : null
                }
            />
            {isFixed && mode === "fixed" ? (
                <div
                    style={fixedMaskStyle}
                    onClick={(e) => {
                        setIsFixed(false);
                    }}
                    className={clsx(classes.fixed, fixedMaskClassName)}
                >
                    <ZoomableImage
                        className={fixedClassName}
                        style={fixedStyle}
                        src={src}
                        initZoom={true}
                        onImgClick={(e) => {
                            setIsFixed(false);
                        }}
                    />
                </div>
            ) : null}
        </div>
    );
}

interface Attr {
    img: HTMLImageElement;
    current: HTMLDivElement;

    is: boolean;
    point: [number, number];
    w: number;

    imgLoaded: boolean;

    // 拖拽辅助
    isDrag: boolean;
    initX: number;
    initY: number;
}

interface ZoomableImage extends React.HTMLAttributes<HTMLDivElement> {
    src: string;
    initZoom?: boolean;
    disable?: boolean;
    onImgClick?;
}

export function ZoomableImage(props: ZoomableImage) {
    const { src, initZoom, disable, onImgClick, className, ...rest } = props;

    const attr = React.useRef({} as Attr).current;

    const [is, setIs] = React.useState(null);
    const style = useImgStyle(attr, is);

    React.useEffect(() => {
        if (initZoom) {
            setZoomStart(attr, setIs, [0.5, 0.5]);
        }
    }, []);

    return (
        <div ref={(r) => (attr.current = r)} className={clsx(classes.container, className)} {...rest}>
            <div>
                <img
                    draggable={"false"}
                    ref={(r) => (attr.img = r)}
                    style={style}
                    className={clsx(is ? classes.img_zoom : classes.img_normal, disable ? classes.img_disable : null)}
                    src={src}
                    onClick={disable ? onImgClick : (e) => handleClick(e, attr, is, setIs, onImgClick)}
                    onWheel={is ? (e) => handleWheel(e, attr) : null}
                    onMouseDown={is ? (e) => handleMousedown(e, attr) : null}
                    onMouseMove={is ? (e) => handleMouseMove(e, attr) : null}
                    onLoad={(e) => (attr.imgLoaded = true)}
                />
            </div>
        </div>
    );
}

function useImgStyle(attr, is) {
    let style = null;
    attr.is = is;
    const rect = useRefBound(attr, () => attr.is);

    if (is) {
        if (rect && attr.img) {
            getVaildPoint(rect.width, rect.height, attr.w || attr.img.clientWidth, attr.img, attr.point);
            let translate = getTranslate(attr.point);
            style = {
                width: attr.w,
                transform: `translate(${translate.join(",")})`,
            };
        } else {
            style = { width: "auto", transform: null };
        }
    }

    return style;
}

function setZoomStart(attr: Attr, setIs, point) {
    if (!attr?.imgLoaded) return;

    attr.point = point;
    attr.w = getImgInitWidth(attr.img, attr.current);
    getVaildPoint(attr.current.clientWidth, attr.current.clientHeight, attr.w, attr.img, attr.point);

    const translate = getTranslate(attr.point);
    attr.img.style.width = attr.w + "px";
    attr.img.style.transform = `translate(${translate.join(",")})`;

    setIs(true);
}

function handleClick(e, attr, is, setIs, onImgClick) {
    e.preventDefault();
    e.stopPropagation();

    if (!is) {
        const rect = e.currentTarget.getBoundingClientRect();
        setZoomStart(attr, setIs, [(e.clientX - rect.x) / rect.width, (e.clientY - rect.y) / rect.height]);
    } else {
        if (!attr.isDrag) {
            setIs(null);
            onImgClick && onImgClick(e);
        }
    }
    attr.isDrag = null;
}

function handleMousedown(e, attr) {
    e.preventDefault();
    e.stopPropagation();
    attr.isDrag = false;
    attr.initX = e.pageX;
    attr.initY = e.pageY;
}

function handleWheel(e, attr) {
    e.stopPropagation();
    attr.w = getImgScaleWidth(attr.img, attr.current, e.deltaY > 0);
    attr.point = getVaildPoint(attr.current.clientWidth, attr.current.clientHeight, attr.w, attr.img, attr.point);

    let translate = getTranslate(attr.point);
    attr.img.style.width = attr.w + "px";
    attr.img.style.transform = `translate(${translate.join(",")})`;
}

function handleMouseMove(e, attr) {
    if (e.buttons === 1) {
        if (attr.isDrag) {
            let p_0 = attr.point[0] + (e.movementX * -1) / attr.img.clientWidth;
            let p_1 = attr.point[1] + (e.movementY * -1) / attr.img.clientHeight;

            attr.point = getVaildPoint(attr.current.clientWidth, attr.current.clientHeight, attr.img.clientWidth, attr.img.clientHeight, [p_0, p_1]);

            const translate = getTranslate(attr.point);
            attr.img.style.transform = `translate(${translate.join(",")})`;
        } else if (attr.isDrag === false) {
            let move = Math.abs(attr.initX - e.pageX) + Math.abs(attr.initY - e.pageY);
            if (move > 5) {
                attr.isDrag = true;
            }
        }
    }
}

// calculation 计算

function getImgInitWidth(img: HTMLImageElement, content: HTMLDivElement) {
    if (img.naturalWidth > content.clientWidth) {
        return img.naturalWidth;
    }
    if (img.naturalWidth > content.clientWidth / 2) {
        return content.clientWidth;
    }
    return img.naturalWidth * 2;
}

function getImgScaleWidth(img: HTMLImageElement, content: HTMLDivElement, isOut?) {
    if (!isOut) {
        let w = img.clientWidth * 1.2;
        if (w > img.naturalWidth * 1000) {
            return img.naturalWidth * 1000;
        }
        return w;
    } else {
        let w = img.clientWidth * 0.8;
        if (w < img.naturalWidth / 20) {
            return img.naturalWidth / 20;
        }
        return w;
    }
}

function getTranslate(point) {
    let x = 0.5 - point[0];
    let y = 0.5 - point[1];
    return [`${x * 100}%`, `${y * 100}%`];
}

function getVaildPoint(w_wrap, h_wrap, width, img: HTMLImageElement | number, point) {
    const height = typeof img === "number" ? img : (width * img.clientHeight) / img.clientWidth;
    point[0] = getVaildPos(w_wrap, width, point[0]);
    point[1] = getVaildPos(h_wrap, height, point[1]);

    return point;
}

function getVaildPos(wrap, img, tarPos) {
    const diff = img - wrap;
    if (diff <= 0) return 0.5;
    const maxRate = diff / 2 / img;

    if (tarPos >= 0.5) {
        return tarPos > 0.5 + maxRate ? 0.5 + maxRate : tarPos;
    } else {
        return tarPos < 0.5 - maxRate ? 0.5 - maxRate : tarPos;
    }
}
