import React from "react";

import { icons } from "../../icons";
import { DropButton } from "./widget";
import { ToolAttr } from "../utils";

export function More(props: { attr: ToolAttr }) {
    const lang = props.attr.lang;

    return (
        <DropButton
            mode="narrower"
            tip={lang.tip.more}
            list={[
                {
                    label: (
                        <React.Fragment>
                            <icons.Video />
                            <span>{lang.other.addVideo}</span>
                        </React.Fragment>
                    ),
                    value: "video",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.PlayCircle />
                            <span>{lang.other.addAudio}</span>
                        </React.Fragment>
                    ),
                    value: "audio",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.FuJian />
                            <span>{lang.other.addFile}</span>
                        </React.Fragment>
                    ),
                    value: "file",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.CommentAltDots />
                            <span>{lang.other.addComment}</span>
                        </React.Fragment>
                    ),
                    value: "comment",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.PuzzlePiece />
                            <span>{lang.other.insertIframe}</span>
                        </React.Fragment>
                    ),
                    value: "iframe",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.HorizontalRule />
                            <span>{lang.other.insertRule}</span>
                        </React.Fragment>
                    ),
                    value: "horizontalRule",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.Table />
                            <span>{lang.other.insertTable}</span>
                        </React.Fragment>
                    ),
                    value: "table",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.AngleDoubleDown />
                            <span>{lang.other.expandableList}</span>
                        </React.Fragment>
                    ),
                    value: "expandableList",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.Redo />
                            <span>{lang.base.redo}</span>
                        </React.Fragment>
                    ),
                    value: "redo",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.Undo />
                            <span>{lang.base.undo}</span>
                        </React.Fragment>
                    ),
                    value: "undo",
                },
            ]}
            getCurValue={() => {
                return 1;
            }}
            onSelect={(item) => {
                const attr = props.attr;
                if (item.value === "horizontalRule") {
                    attr.event.emit(attr.editEvent.addHorizontalRule);
                } else if (item.value === "expandableList") {
                    attr.event.emit(attr.editEvent.expandableList);
                } else if (item.value === "table") {
                    attr.event.emit(attr.editEvent.openEditTable, {
                        key: null,
                        data: {
                            column: 4,
                            row: 4,
                            widthType: "auto",
                            width: 500,
                            align: "center",
                        },
                    });
                } else if (item.value === "video") {
                    attr.event.emit(attr.editEvent.openEditVideo, {});
                } else if (item.value === "audio") {
                    attr.event.emit(attr.editEvent.openEditAudio, {});
                } else if (item.value === "file") {
                    attr.event.emit(attr.editEvent.openEditFile, {});
                } else if (item.value === "comment") {
                    attr.event.emit(attr.editEvent.openEditComment, {});
                } else if (item.value === "iframe") {
                    attr.event.emit(attr.editEvent.openEditIframe, {});
                } else if (item.value === "redo") {
                    attr.event.emit(attr.editEvent.redo);
                } else if (item.value === "undo") {
                    attr.event.emit(attr.editEvent.undo);
                }
            }}
            style={{ minWidth: 130, maxHeight: 350 }}
        >
            <icons.More />
        </DropButton>
    );
}
