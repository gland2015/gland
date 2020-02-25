import React from 'react';
import { OrderedSet } from 'immutable';

// notice 目前是非文本光标位置不正常
export function Image(props) {
    //console.log("Emoticon", props);
    const { data, offsetKey, children, context } = props;
    const ele = React.cloneElement(children[0], {
        text: ' ',
        styleSet: OrderedSet(['display:inline-block;width:1px']) //
    });
    const { isRemote } = data;
    const [state, setState] = React.useState();
    let url;
    if (isRemote) {
        url = context.editor.remoteDataProvider.getContentAsset(data, setState);
    } else {
        url = data.url;
    }

    // return ele
    return (
        <>
            <span data-offset-key={offsetKey} contentEditable={false}>
                <span data-text={true}>{typeof url === 'string' ? <img src={url} /> : 'loading'}</span>
            </span>
            {ele}
        </>
    );
}
