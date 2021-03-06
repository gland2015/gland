import React from "react";

import { icons } from "../../icons";
import { toolNormalBtn } from "../style";
import { ToolAttr } from "../utils";
import { BtnTip } from "./widget";

export function Image(props: { attr: ToolAttr }) {
    const [state, setState] = React.useState(null);
    const lang = props.attr.lang;

    return (
        <React.Fragment>
            <BtnTip tip={lang.tip.image} disable={state}>
                <div
                    className={toolNormalBtn}
                    onClick={() => {
                        let value = state === null ? false : null;
                        setState(value);
                        props.attr.event.emit(props.attr.editEvent.openEditImage, {});
                    }}
                >
                    <icons.Image />
                </div>
            </BtnTip>
        </React.Fragment>
    );
}
