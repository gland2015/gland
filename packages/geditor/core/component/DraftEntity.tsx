import React from 'react';
import { editorConfigContext } from '../public/context';

export function DraftEntity(props) {
    const context = React.useContext(editorConfigContext);
    const { name, data } = props.contentState.getEntity(props.entityKey).getData();
    const Component = context.entityComponent[name];
    return <Component {...props} context={context} data={data} />;
}
