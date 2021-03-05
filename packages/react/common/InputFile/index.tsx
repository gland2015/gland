import React from "react";

export const InputFile = React.forwardRef<any, any>(function ({ onChange }, ref) {
    let attr = React.useRef({
        input: null,
    }).current;

    React.useImperativeHandle(ref, () => ({
        show() {
            console.log("click");
            attr.input.value = null;
            attr.input.click();
        },
    }));

    return (
        <input
            ref={(r) => (attr.input = r)}
            style={{ display: "none" }}
            type="file"
            onChange={(e) => {
                let file = e.target.files[0];
                onChange && onChange(file);
            }}
        />
    );
});
