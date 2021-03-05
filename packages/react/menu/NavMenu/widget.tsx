import React from "react";
import { fluentIcon } from "@/asset/svg/icons";

export function FileProxyComp(props) {
    return (
        <React.Fragment>
            <div className={props.iconCls}>{props.data?.isGroupNode ? <fluentIcon.FabricFolderIcon /> : <fluentIcon.DocumentIcon />}</div>
            <div>{props.data?.doc?.name}</div>
        </React.Fragment>
    );
}
