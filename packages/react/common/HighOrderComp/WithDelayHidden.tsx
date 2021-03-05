import React from "react";

export function WithDelayHidden(Comp) {
    return function (props) {
        const [isHide, setHide] = React.useState(props.hidden);

        React.useEffect(() => {
            if (!props.hidden && isHide) {
                setHide(false);
            }
        }, [props.hidden]);

        const attr = React.useRef({}).current as any;

        attr.hidden = props.hidden;

        if (isHide) return null;

        return (
            <Comp
                {...props}
                hide={() => {
                    if (attr.hidden) {
                        setHide(true);
                    }
                }}
            />
        );
    };
}
