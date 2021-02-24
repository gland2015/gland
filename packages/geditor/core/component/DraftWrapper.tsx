import React from "react";
import { EditorContext } from "../public/context";

function DraftWrapper(props) {
    const ctx = React.useContext(EditorContext);

    return <div>{packBlocks(props.children, ctx.wrappers, ctx.subBlocks)}</div>;
}

export { DraftWrapper };

type Target = {
    attr: { wrapper_name: string; wrapper_depth: number; subblock: string };
    list: Array<any>;
};
type IStack = Array<Target>;

function packBlocks(childrens: Array<any>, wrappers, subBlocks) {
    const result = [];
    const stack: IStack = [];

    loopChild: for (let i = 0; i < childrens.length; i++) {
        const item = childrens[i];
        const key = item.key;
        const data = item.props.children.props.block.getData();

        const data_wrap = data.get("wrapper") || null;
        const data_head = data.get("head") || null;
        const data_pkey = data.get("pKey") || null;

        let wrapper_name = data_wrap?.name || null;
        let wrapper_depth = data_wrap?.depth || 0;

        loopStack: while (stack.length) {
            let target = stack[stack.length - 1];

            if (target.attr.subblock !== data_pkey) {
                stack.pop();
                continue loopStack;
            }

            if (target.attr.wrapper_name) {
                if (wrapper_name !== target.attr.wrapper_name) {
                    stack.pop();
                    continue loopStack;
                }
            } else {
                if (wrapper_name) {
                    const list = [];
                    let Comp_wrap = wrappers[data_wrap.name];
                    target.list.push(<Comp_wrap key={key} childs={list} depth={data_wrap.depth} diff={data_wrap.depth} />);
                    stack.push({
                        attr: { wrapper_name, wrapper_depth, subblock: target.attr.subblock },
                        list,
                    });
                    continue loopStack;
                }
            }

            if (wrapper_name) {
                if (wrapper_depth > target.attr.wrapper_depth) {
                    const list = [];
                    let Comp_wrap = wrappers[data_wrap.name];
                    target.list.push(
                        <Comp_wrap
                            key={key}
                            childs={list}
                            depth={data_wrap.depth}
                            diff={wrapper_depth - 1 - target.attr.wrapper_depth}
                            subwrapper={true}
                        />
                    );
                    stack.push({
                        attr: { wrapper_name, wrapper_depth, subblock: target.attr.subblock },
                        list,
                    });
                    continue loopStack;
                } else if (wrapper_depth < target.attr.wrapper_depth) {
                    stack.pop();
                    continue loopStack;
                }
            }

            if (data_head) {
                const Comp_sub = subBlocks[data_head.name];
                const list = [];

                target.list.push(<Comp_sub key={key} childs={list} head={item} />);
                stack.push({
                    attr: {
                        wrapper_name: null,
                        wrapper_depth: 0,
                        subblock: key,
                    },
                    list,
                });
                continue loopChild;
            } else {
                target.list.push(item);
                continue loopChild;
            }
        }

        let target: Target = null;
        if (wrapper_name) {
            const Comp_wrap = wrappers[data_wrap.name];
            const list = [];

            result.push(<Comp_wrap key={key} childs={list} depth={data_wrap.depth} diff={data_wrap.depth} />);

            target = {
                attr: { wrapper_name, wrapper_depth, subblock: null },
                list,
            };
            stack.push(target);
        }

        if (data_head) {
            const Comp_sub = subBlocks[data_head.name];
            const list = [];

            const ele = <Comp_sub key={key} childs={list} head={item} />;

            if (target) {
                target.list.push(ele);
            } else {
                result.push(ele);
            }

            stack.push({
                attr: {
                    wrapper_name: null,
                    wrapper_depth: 0,
                    subblock: key,
                },
                list,
            });
        } else if (target) {
            target.list.push(item);
        } else {
            result.push(item);
        }
    }

    return result;
}

/*
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

*/
