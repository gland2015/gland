import React from "react";

import { icons } from "../../icons";
import { DropButton } from "./widget";
import { ToolAttr } from "../utils";

export function More(props: { attr: ToolAttr }) {
    return (
        <DropButton
            mode="narrower"
            tip="更多"
            list={[
                {
                    label: (
                        <React.Fragment>
                            <icons.Video />
                            <span>添加视频</span>
                        </React.Fragment>
                    ),
                    value: "video",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.PlayCircle />
                            <span>添加音频</span>
                        </React.Fragment>
                    ),
                    value: "audio",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.FuJian />
                            <span>添加附件</span>
                        </React.Fragment>
                    ),
                    value: "file",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.CommentAltDots />
                            <span>添加注释</span>
                        </React.Fragment>
                    ),
                    value: "comment",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.PuzzlePiece />
                            <span>插入iframe</span>
                        </React.Fragment>
                    ),
                    value: "iframe",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.HorizontalRule />
                            <span>插入水平线</span>
                        </React.Fragment>
                    ),
                    value: "horizontalRule",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.Table />
                            <span>插入表格</span>
                        </React.Fragment>
                    ),
                    value: "table",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.AngleDoubleDown />
                            <span>可展开列表</span>
                        </React.Fragment>
                    ),
                    value: "expandableList",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.Redo />
                            <span>重做</span>
                        </React.Fragment>
                    ),
                    value: "redo",
                },
                {
                    label: (
                        <React.Fragment>
                            <icons.Undo />
                            <span>撤销</span>
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
