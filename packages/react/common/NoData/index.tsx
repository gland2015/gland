import React from "react";
import clsx from "clsx";

import { jss } from "../jss";
import { img } from "../asset";

const jssSheet = jss.createStyleSheet({
    root: { textAlign: "center", marginTop: 20, fontSize: 40 },
});

interface NoDataProps extends React.HTMLAttributes<HTMLDivElement> {}

export function NoData(props: NoDataProps) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }

    const { className, ...rest } = props;

    return (
        <div className={clsx(jssSheet.classes.root, className)} {...rest}>
            <img.NoData />
        </div>
    );
}
