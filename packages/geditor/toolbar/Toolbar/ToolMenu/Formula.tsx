import React from "react";

import { icons } from "../../icons";
import { toolNormalBtn, toolClasses as classes } from "../style";
import { ToolAttr } from "../utils";
import { BtnTip } from "./widget";

export function Formula(props: { attr: ToolAttr }) {
    const [state, setState] = React.useState(null);
    const lang = props.attr.lang;

    return (
        <React.Fragment>
            <BtnTip tip={lang.tip.formula} disable={state}>
                <div
                    className={toolNormalBtn}
                    onClick={() => {
                        let value = state === null ? false : null;
                        setState(value);
                        props.attr.event.emit(props.attr.editEvent.openEditFormula, {
                            key: null,
                            data: {
                                value: "",
                            },
                        });
                    }}
                >
                    <icons.Variable />
                </div>
            </BtnTip>
        </React.Fragment>
    );
}
