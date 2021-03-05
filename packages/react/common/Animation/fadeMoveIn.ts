import { jss } from "../jss";

const current = {};

export function createFadeMoveIn(props?: {
    timeout?;
    scale?;
    translateX?;
    translateY?;
    translateX_exit?;
    translateY_exit?;
}): { classNames; timeout; unmountOnExit } {
    let key = JSON.stringify(props);
    if (current[key]) {
        return current[key];
    }

    const { sheet, timeout } = getSheetTime(props);

    // cache
    let { classes } = jss.createStyleSheet(sheet).attach();
    let r = { classNames: classes, timeout, unmountOnExit: true };
    current[key] = r;

    return r;
}

function getSheetTime(props: any = {}) {
    let { timeout, scale, translateX, translateY, translateX_exit, translateY_exit } = props;
    timeout = timeout || 300;
    scale = scale || 1;
    translateX = translateX ? (typeof translateX === "number" ? `${translateX}px` : translateX) : "0px";
    translateY = translateY ? (typeof translateY === "number" ? `${translateY}px` : translateY) : "0px";

    translateX_exit = translateX_exit ? (typeof translateX_exit === "number" ? `${translateX_exit}px` : translateX_exit) : translateX;
    translateY_exit = translateY_exit ? (typeof translateY_exit === "number" ? `${translateY_exit}px` : translateY_exit) : translateY;

    let sheet = {
        enter: {
            opacity: 0,
            transform: `scale(${scale}) translate(${translateX}, ${translateY})`, // opacity 225ms  0ms
        },
        enterActive: {
            opacity: 1,
            transform: "none",
            transition: `opacity ${timeout}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${timeout}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        },
        appear: {
            opacity: 0,
            transform: `scale(${scale}) translate(${translateX}, ${translateY})`,
        },
        appearActive: {
            opacity: 1,
            transform: "none",
            transition: `opacity ${timeout}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${timeout}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        },
        exit: {
            opacity: 1,
        },
        exitActive: {
            opacity: 0,
            transform: `scale(${scale}) translate(${translateX_exit}, ${translateY_exit})`,
            transition: `opacity ${timeout}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${timeout}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        },
    };

    return { timeout, sheet };
}
