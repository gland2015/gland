import React from 'react';
import { editorConfigContext, IDefaultConfigContext } from '../model';
import { BlockText } from './blockText';
import { getClassName } from '../model';
import { getStyleObj } from '../model';
/**
 * 统一的的块，再下发文本块和非文本块
 */
class DraftBlockElement extends React.Component<any, any> {
    static contextType = editorConfigContext;
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { toUpdateKeys, mode } = this.context;
        if (mode !== 'editor') return true;
        let key;
        if (toUpdateKeys) {
            key = nextProps.children.props.block.getKey();
            if (toUpdateKeys.indexOf(key) === -1) {
                return false;
            }
        }
        return true;
    }

    render() {
        const identifier = this.context.identifier
        let children: any = this.props.children;
        const block = children.props.block;
        const blockData = block.getData();
        const isTextBlock = blockData.get('isTextBlock');
        if (isTextBlock) {
            //const { blockData, children, block, context } = props;
            const { textBlockDefaultClassName } = this.context;
            const type = blockData.get('type');
            const htmlType = type.split('_')[0];
            let defaultClassName = textBlockDefaultClassName[type] || '';
            if (defaultClassName) defaultClassName += ' ';

            const className = defaultClassName + getClassName(blockData.get('type'), block.getKey(), identifier);
            const style = getStyleObj(blockData.get('style').toJS(), identifier, false);

            const textLength = block.getText().length;
            if (!textLength) children = <div>{children}</div>;
            return <BlockText block={block} children={children} context={this.context} className={className} style={style} htmlType={htmlType} />;
        } else {
            const ComponentName = blockData.get('ComponentName');
            const Component = this.context['nonTextComponent'][ComponentName];
            return <Component blockData={blockData} block={block} context={this.context} />;
        }
    }
}

export { DraftBlockElement };
