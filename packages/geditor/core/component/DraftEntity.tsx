import React from "react";
import { EditorContext, TargetContext } from "../public/context";

export function DraftEntity(props) {
    const context = React.useContext(EditorContext);
    const { contentState, entityKey } = props;
    const entity = contentState.getEntity(entityKey);
    const { name, data } = entity.getData();
    const Comp = context.entitys[name];
    if (context.readOnly) {
        return <Comp {...props} context={context} data={data} />;
    }
    const isIMMu = entity.getMutability() === "IMMUTABLE";
    if (isIMMu) {
        return <Comp {...props} context={context} data={data} />;
    }

    return <EntityWithIsSelected props={props} context={context} data={data} Comp={Comp} />;
}

function EntityWithIsSelected(props) {
    const target = React.useContext(TargetContext);
    const { blockKey, start, end } = props.props;

    let isSelected = target.hasFocus && target.key === blockKey && target.offset >= start && target.offset < end;

    return <EntityRender props={props} isSelected={isSelected} />;
}

const EntityRender = React.memo(function (props: any) {
    let { context, data, Comp } = props.props;
    return <Comp {...props.props.props} context={context} data={data} isSelected={props.isSelected} />;
});
