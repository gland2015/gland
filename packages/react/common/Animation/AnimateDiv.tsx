import React from "react";
import { CSSTransition } from "react-transition-group";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";

export type AnimateDivProps = {
    style?: React.CSSProperties;
    className?: string;
    appear?: boolean;
    divProps?: any;
} & CSSTransitionProps;

export function AnimateDiv(props: AnimateDivProps) {
    const { className, style, children, divProps, ...restProps } = props;

    return (
        <CSSTransition {...restProps}>
            <div className={className} style={style} {...(divProps || {})}>
                {props.children}
            </div>
        </CSSTransition>
    );
}
