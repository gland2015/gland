import React from "react";

import { icons } from "../../icons";
import { toolNormalBtn } from "../style";
import { ToolAttr } from "../utils";
import { BtnTip } from "./widget";

export function Code(props: { attr: ToolAttr }) {
    const [state, setState] = React.useState(null);

    return (
        <React.Fragment>
            <BtnTip tip={"代码"} disable={state}>
                <div
                    className={toolNormalBtn}
                    onClick={() => {
                        let value = state === null ? false : null;
                        setState(value);
                        props.attr.event.emit(props.attr.editEvent.openEditCode, {
                            key: null,
                            data: {
                                mode: "javascript",
                                value: "",
                                theme: "atomDark",
                            },
                        });
                    }}
                >
                    <icons.Code />
                </div>
            </BtnTip>
        </React.Fragment>
    );
}
