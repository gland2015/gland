import React from "react";
import { EditorContext } from "../public/context";

function DraftWrapper(props) {
    const context = React.useContext(EditorContext);
    const { toUpdateKeys, readOnly, editorState } = context;

    if (!readOnly && !toUpdateKeys) {
        let keys;
        let sel = editorState.getSelection();
        if (sel.anchorKey === sel.focusKey) {
            keys = [sel.anchorKey];
        } else {
            let content = editorState.getCurrentContent();
            let start = sel.anchorKey,
                end = sel.focusKey;
            if (sel.isBackward) {
                [start, end] = [end, start];
            }
            let nextKey = start;
            keys = [end];
            do {
                keys.push(nextKey);
                nextKey = content.getKeyAfter(nextKey);
            } while (nextKey && nextKey !== end);
        }

        context.toUpdateKeys = keys;
    }

    return <div>{props.children}</div>;
}

export { DraftWrapper };
