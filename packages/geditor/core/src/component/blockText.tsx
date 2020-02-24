import React from 'react';
import { IDefaultConfigContext } from '../model/context';

/**文本块有三个类名：编辑器自带类，基础类，自身类。前两个由块类型决定，最后一个由自身决定。还有自己的style
 * 类名组成：编辑器默认+ 类型默认 + 块样式
 * @param props
 */
function BlockText(props) {
    const { htmlType, style, className, children, context, block } = props;

    return React.createElement(
        htmlType,
        {
            style,
            className,
            'data-type': 'text'
        },
        children // 若无文本，在上层包装
    );
}

export { BlockText };
