import React from "react";

import { useHandleEdit } from "./useHandleEdit";
import { CodeEditModal } from "./CodeEditModal";
import { FormulaEditModal } from "./FormulaEditModal";
import { ImageEditModal } from "./ImageEditModal";
import { TableEditModal } from "./TableEditModal";
import { VideoEditModal } from "./VideoEditModal";
import { AudioEditModal } from "./AudioEditModal";
import { FileEditModal } from "./FileEditModal";
import { CommentEditModal } from "./CommentEditModal";
import { IframeEditModal } from "./IframeEditModal";
import { LinkEditModal } from "./LinkEditModal";

export const Edit = React.memo(function (props: any) {
    useHandleEdit(props.attr);

    return (
        <React.Fragment>
            <CodeEditModal attr={props.attr} />
            <FormulaEditModal attr={props.attr} />
            <ImageEditModal attr={props.attr} />
            <VideoEditModal attr={props.attr} />
            <AudioEditModal attr={props.attr} />
            <TableEditModal attr={props.attr} />
            <FileEditModal attr={props.attr} />
            <CommentEditModal attr={props.attr} />
            <IframeEditModal attr={props.attr} />
            <LinkEditModal attr={props.attr} />
        </React.Fragment>
    );
});
