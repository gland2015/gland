import React from "react";
import { editorConfigContext } from "../public/context";

class DraftWrapperElement extends React.Component<any, any> {
    static contextType = editorConfigContext;
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let { toUpdateKeys, mode, editor } = this.context;
        if (mode !== "editor") return true;
        if (toUpdateKeys) {
            if (toUpdateKeys.length === 0) return false;
            return true;
        }
        // 编辑器选择发生变化时的处理
        let sel = editor.state.editorState.getSelection();
        if (sel.anchorKey === sel.focusKey) {
            toUpdateKeys = [sel.anchorKey];
        } else {
            let content = editor.state.editorState.getCurrentContent();
            let start = sel.anchorKey,
                end = sel.focusKey;
            if (sel.isBackward) {
                [start, end] = [end, start];
            }
            let nextKey = start;
            toUpdateKeys = [end];
            do {
                toUpdateKeys.push(nextKey);
                nextKey = content.getKeyAfter(nextKey);
            } while (nextKey && nextKey !== end);
        }

        this.context.toUpdateKeys = toUpdateKeys;
        return true;
    }

    render() {
        //  分块策略

        return <div>{this.props.children}</div>;
    }
}

export { DraftWrapperElement };
