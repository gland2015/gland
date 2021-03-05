import React from "react";
import ResizeObserver from "resize-observer-polyfill";

export function useRefBound(ref: React.MutableRefObject<any>, getNeedBound?) {
    const [bound, setBound] = React.useState(null);

    const attr = React.useRef({
        bound: null,
        getNeedBound,
    }).current;

    attr.getNeedBound = getNeedBound;

    React.useEffect(() => {
        function onResize([entry]: ResizeObserverEntry[]) {
            attr.bound = entry.contentRect;
            if (!bound || (attr.getNeedBound ? attr.getNeedBound() : true)) {
                setBound(attr.bound);
            }
        }

        const observer = new ResizeObserver(onResize);

        if (ref && ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [ref && ref.current]);

    return attr.bound;
}
