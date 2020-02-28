import React from 'react';

// notice 删除和插入有bug，如尾部无法删除，初次插入光标错位，可能需要有效的手动控制
export function Link(props) {
    const { data, offsetKey, context, children } = props;

    return <a href={data.url}>{children}</a>;
}
