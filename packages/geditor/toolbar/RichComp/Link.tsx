import React from "react";
import { Callout } from "@gland/react/popover";
import { FabricLink } from "@gland/react/link";
import { icons } from "../icons";
import { richClasses as classes } from "../style";
import { editEvent } from "../editEvent";

export function Link(props) {
    const { data, entityKey, context, children, isSelected, blockKey, start, end } = props;
    const { readOnly, lang } = context;

    const attr = React.useMemo(
        () => ({
            root: null,
        }),
        []
    );

    return (
        <React.Fragment>
            <a ref={(r) => (attr.root = r)} href={data.url} className={classes.link} target="__blank">
                {children}
            </a>
            {readOnly ? null : (
                <Callout
                    target={attr.root}
                    directionalHint="bottom"
                    gapSpace={0}
                    beakWidth={10}
                    hidden={!isSelected}
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                >
                    <div className={classes.linkBar}>
                        <FabricLink className={classes.linkBarA} target="__blank" href={data.url}>
                            {data.url}
                        </FabricLink>
                        <div
                            className={classes.linBtn}
                            title={lang.base.edit}
                            onClick={() => {
                                context.event.emit(editEvent.openEditLink, { key: entityKey, data });
                            }}
                        >
                            <icons.Edit />
                        </div>
                        <div
                            className={classes.linBtn}
                            title={lang.other.linkRemove}
                            onClick={() => {
                                context.event.emit(editEvent.removeLink, { key: blockKey, start, end });
                            }}
                        >
                            <icons.Unlink />
                        </div>
                    </div>
                </Callout>
            )}
        </React.Fragment>
    );
}
