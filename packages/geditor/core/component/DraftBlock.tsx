import React from "react";
import { EditorContext } from "../public/context";
import { IEditorContext } from "../interface";

function DraftBlock(props) {
    const ctx = React.useContext(EditorContext);

    const children = props.children;
    const block = children.props.block;

    let isEqual = false;
    const { toUpdateKeys, readOnly } = ctx;
    if (!readOnly && toUpdateKeys) {
        const key = block.getKey();
        isEqual = toUpdateKeys.indexOf(key) === -1 ? true : false;
    }

    return (
        <BlockContent isEqual={isEqual} context={ctx} block={block}>
            {children}
        </BlockContent>
    );
}

interface BlockContent {
    context: IEditorContext;
    block: any;
    children: any;
    isEqual: boolean;
}

const BlockContent = React.memo(
    function (props: BlockContent) {
        const { context, block, children } = props;

        const blockData = block.getData();
        const isText = blockData.get("isText");

        if (isText) {
            const { classNames } = context;

            const name = blockData.get("name");
            const htmlType = name.split("_")[0];

            const className = classNames[name];
            const style = blockData.get("style");

            const textLength = block.getText().length;

            return React.createElement(
                htmlType,
                {
                    style,
                    className,
                    "data-type": "text",
                },
                textLength ? children : <div>{children}</div>
            );
        } else {
            const name = blockData.get("name");
            const Comp = context.nonTextComponent[name];
            return <Comp data={blockData.get("data")} block={block} context={context} />;
        }
    },
    function (prevProps, nextProps) {
        return nextProps.isEqual;
    }
);

export { DraftBlock };
