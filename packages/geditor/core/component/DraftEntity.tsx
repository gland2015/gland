import React from "react";
import { EditorContext } from "../public/context";

export function DraftEntity(props) {
    const context = React.useContext(EditorContext);
    const { contentState, entityKey } = props;

    const { name, data } = contentState.getEntity(entityKey).getData();

    const Comp = context.entityComponent[name];
    return <Comp {...props} context={context} data={data} />;
}
