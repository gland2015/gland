import React from 'react';
import { OrderedSet } from 'immutable';
import { isPromiseInstance } from '../../../core/model/helper';

// notice 在行空白处尾部点击，最后是不可编辑的，无论多长少不可编辑元素，会将焦点移到第二个不可编辑元素前；这是谷歌的一个bug行为
export function EntityTest(props) {
    const { data, offsetKey, children, context } = props;
    const ele = React.cloneElement(children[0], {
        text: <img src={url} />,
        // custom: (
        //     <span>
        //         <img src={url} />
        //         555
        //         <img src={url} />
        //     </span>
        // ),
        styleSet: OrderedSet([]) //
    });
    return ele
    console.log(props);
    let ele2 = null;
    if (children[0].props.isLast) {
        ele2 = React.cloneElement(children[0], {
            text: ' ',
            styleSet: OrderedSet(['display:inline-block;width:1px']), //
            key: '343',
            role: 'lastFill'
        });
    }
    return (
        <>
            {ele}
            {ele2}
        </>
    );
}

const url = 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/pcmoren_tian_org.png';
