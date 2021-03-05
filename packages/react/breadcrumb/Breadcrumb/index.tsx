import React from "react";
import clsx from "clsx";

import { Link } from "react-router-dom";
import { FabricButton } from "../../button/FabricButton";

import { jss } from "../../common/jss";
import { fluentIcon } from "../../common/asset";

const jssSheet = jss.createStyleSheet({
    root: {
        whiteSpace: "nowrap",
        padding: 0,
        margin: 0,
        display: "flex",
        alignItems: "stretch",
        listStyle: "none",
        color: "#323130",
        userSelect: "none",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: 400,
        "&>li": {
            position: "relative",
            display: "flex",
            alignItems: "center",
        },
    },
    item: {
        fontWeight: 400,
        color: "rgb(96, 94, 92)",
        outline: "transparent",
        textDecoration: "none",
        background: "none transparent",
        borderTop: "none",
        borderRight: "none",
        borderLeft: "none",
        borderImage: "initial",
        cursor: "pointer",
        display: "inline",
        margin: 0,
        overflow: "hidden",
        padding: "0px 0.5em",
        textAlign: "left",
        textOverflow: "ellipsis",
        borderBottom: "1px solid transparent",
        position: "relative",
        whiteSpace: "nowrap",
        lineHeight: "2em",
        userSelect: "none",
        fontSize: "inherit",
    },
    normalItem: {
        "&:hover": {
            color: "rgb(50, 49, 48)",
            textDecoration: "none",
            backgroundColor: "rgb(243, 242, 241)",
            cursor: "pointer",
        },
        "&:active": {
            color: "rgb(50, 49, 48)",
            textDecoration: "none",
            backgroundColor: "rgb(237, 235, 233)",
        },
    },
    currentItem: {
        fontWeight: 600,
        color: "rgb(50, 49, 48)",
    },
    rthIcon: {
        display: "flex",
        alignItems: "center",
        "& svg": {
            width: "0.667em",
            height: "0.667em",
        },
    },
});
const classes = jssSheet.classes;

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLOListElement> {
    items: Array<{
        key: string | number;
        text: any;
        isCurrentItem?: boolean;
        href?: string;
        hrefTarget?: string;
    }>;
    onBreadClick?: (item, event) => any;
    maxDisplayedItems?: number;
    overflowIndex?: number;
}

export function Breadcrumb(props: BreadcrumbProps) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }

    const { className, items, maxDisplayedItems, overflowIndex, onBreadClick, ...rest } = props;

    const data = React.useMemo(() => {
        let list = [];
        if (!items?.length) return list;

        let oi = overflowIndex || 0;
        if (maxDisplayedItems && maxDisplayedItems < items.length && oi < items.length) {
            let normalItems = items.concat();

            let overItems = normalItems.splice(oi, items.length - maxDisplayedItems, null);
            list = normalItems.map(function (item, index) {
                if (index === oi) {
                    return {
                        type: "over",
                        data: overItems,
                        isEnd: index === normalItems.length - 1,
                        key: overItems[0].key,
                    };
                }

                return {
                    type: "normal",
                    data: item,
                    isEnd: index === normalItems.length - 1,
                    key: item.key,
                };
            });
        } else {
            list = items.map((o, i) => ({
                type: "normal",
                data: o,
                isEnd: i === items.length - 1,
                key: o.key,
            }));
        }

        return list;
    }, [items, maxDisplayedItems, overflowIndex]);

    return (
        <ol className={clsx(classes.root, className)} {...rest}>
            {data.map(function (item) {
                const handleClick = (event) => {
                    props.onBreadClick && props.onBreadClick(item.data, event);
                };
                const itemCls = clsx(classes.item, classes.normalItem, item.data?.isCurrentItem ? classes.currentItem : null);

                return (
                    <li key={item.key}>
                        {item.type === "over" ? (
                            <FabricButton
                                menuProps={{
                                    items: item.data,
                                    onMenuClick: props.onBreadClick,
                                }}
                                variant="icon"
                            >
                                <fluentIcon.MoreIcon />
                            </FabricButton>
                        ) : item.data.href ? (
                            <Link className={itemCls} to={item.data.href} target={item.hrefTarget} onClick={handleClick}>
                                {item.data.text}
                            </Link>
                        ) : (
                            <button className={itemCls} onClick={handleClick}>
                                {item.data.text}
                            </button>
                        )}
                        {item.isEnd ? null : (
                            <span className={classes.rthIcon}>
                                <fluentIcon.ChevronRightIcon />
                            </span>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}
