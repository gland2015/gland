import React from "react";
import { richClasses as classes } from "../style";
import clsx from "clsx";

export function HorizontalRule(props) {
    const { context, block, data, isSelected, blockKey } = props;

    return (
        <div
            contentEditable="false"
            suppressContentEditableWarning
            className={clsx(
                classes.nonTextBlock,
                classes.horizontalRule,
                context.readOnly ? null : classes.inEditor,
                !context.readOnly && isSelected ? classes.inFocus : null
            )}
            data-offset-key={blockKey + "-0-0"}
        >
            <div className={classes.horizontalLine} />
            {context.readOnly ? null : <div style={{ fontSize: 0 }}>{"\r"}</div>}
        </div>
    );
}
