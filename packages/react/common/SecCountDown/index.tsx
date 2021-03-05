import React from "react";

export function SecCountDown({ sec = 60, render = defaultRender, onEnd = null }) {
    const [restSec, setRestSec] = React.useState(sec);

    const attr = React.useRef({
        start: null,
    }).current;

    React.useEffect(() => {
        attr.start = Date.now();

        let timer = setInterval(() => {
            let t = Date.now();
            let diff = parseInt(((t - attr.start) / 1000) as any);

            let rest = sec - diff;

            if (rest <= 0) {
                clearInterval(timer);
                setRestSec(0);
                onEnd && onEnd();
            } else {
                setRestSec(rest);
            }
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return render(restSec);
}

function defaultRender(s) {
    return `${s}秒` as any;
}
