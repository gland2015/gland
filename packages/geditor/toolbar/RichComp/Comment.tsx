import React from "react";
import clsx from "clsx";
import { Tooltip } from "@/components/fluent";
import { icons } from "../icons";
import { richClasses as classes } from "../style";
import { editEvent } from "../editEvent";

export function Comment(props) {
    const ele = React.cloneElement(props.children[0], {
        custom: <CommentContent props={props} />,
    });
    return ele;
}

function CommentContent(props) {
    const { data, context, entityKey, children } = props.props;

    const { title, description } = data;

    return (
        <Tooltip
            directionalHint="rightTop"
            tip={
                <div className={clsx(classes.commentCt, "smallScroll")}>
                    {title ? <div className="title">{title}</div> : null}
                    <div className="des">{description}</div>
                </div>
            }
            beakWidth={10}
        >
            <div
                className={classes.comment}
                onClick={
                    context.readOnly
                        ? null
                        : () => {
                              context.event.emit(editEvent.openEditComment, { key: entityKey, data });
                          }
                }
            >
                <icons.CommentAltLines />
            </div>
        </Tooltip>
    );
}
