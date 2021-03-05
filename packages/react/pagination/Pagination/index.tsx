import React from "react";
import clsx from "clsx";

import { jss } from "../../common/jss";
import { fluentIcon } from "../../common/asset";
import { TextInput } from "../../input/TextInput";
import { Dropdown } from "../../dropdown/Dropdown";

const jssSheet = jss.createStyleSheet({
    root: {
        display: "flex",
        alignItems: "center",
        userSelect: "none",
        whiteSpace: "nowrap",
        fontSize: 14,
        color: "#3b3a39",
        textAlign: "left",
    },
    pageItem: {
        minWidth: "2.286em",
        height: "2.286em",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 6px",
        marginRight: 8,
        color: "#3b3a39",
        textAlign: "center",
        backgroundColor: "#fff",
        borderRadius: 2,
        cursor: "pointer",
        border: "1px solid #c8c6c4",
        "&:hover": {
            color: "#0078d4",
            borderColor: "#0078d4",
        },
        "&:active": {
            backgroundColor: "#edebe9",
            color: "#201f1e",
        },
        "& svg": {
            fill: "currentcolor",
            width: "1em",
            height: "1em",
        },
    },
    pageItem_cur: {
        color: "#0078d4",
        borderColor: "#0078d4",
        transition: "color 0.3s",
    },
    jumpItem: {
        marginRight: 8,
        minWidth: "2.286em",
        height: "2.286em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#323130",
        cursor: "pointer",
        "& svg": {
            fill: "currentcolor",
            width: "1em",
            height: "1em",
        },
        "&:active": {
            backgroundColor: "#edebe9",
            color: "#201f1e",
        },
        "&:hover": {
            color: "#0078d4",
            "& $jumpMore": {
                display: "none",
            },
            "& $jumpDir": {
                display: "block",
            },
        },
    },
    jumpMore: {},
    jumpDir: {
        display: "none",
    },
    dropDown: {
        fontSize: "inherit",
        marginRight: "8px !important",
        marginLeft: "12px !important",
        borderColor: "#c8c6c4 !important",
    },
    jumpInput: {
        fontSize: 15,
        display: "flex",
        alignItems: "center",
    },
    textInput: {
        width: "3em",
        margin: "0 4px",
        "--neutralSecondary": "#c8c6c4",
    },
});

const { classes } = jssSheet;

interface PaginationProps {
    total: number;
    pageSize?: number;
    current: number;
    onChange?: (page: number, pageSize: number) => any;
    showTotal?: (total, range) => string | JSX.Element;

    style?: React.CSSProperties;
    className?: string;

    pageSizeOptions?: Array<{ key: number; label: string }>;
    disableQuickJumper?: boolean;
    disableSizeChanger?: boolean;
}

export function Pagination(props: PaginationProps) {
    if (!jssSheet.attached) {
        jssSheet.attach();
    }
    let { total, pageSize, current, pageSizeOptions, disableQuickJumper, disableSizeChanger, onChange, showTotal } = props;
    if (!pageSize) {
        pageSize = 10;
    }
    if (!pageSizeOptions) {
        pageSizeOptions = [
            {
                key: 10,
                label: "10条/页",
            },
            {
                key: 20,
                label: "20条/页",
            },
            {
                key: 50,
                label: "50条/页",
            },
            {
                key: 100,
                label: "100条/页",
            },
        ];
    }

    let pageTotalNum = Math.ceil(total / pageSize) || 1;
    let curPage = current;
    if (curPage < 1) {
        curPage = 1;
    }

    if (curPage > pageTotalNum) {
        curPage = pageTotalNum;
    }

    // 1
    let totalRender = null;
    if (showTotal) {
        let ragStart = pageSize * (curPage - 1) + 1;

        let ragEnd = pageSize * curPage;
        if (ragEnd > total) {
            ragEnd = total;
        }

        totalRender = showTotal(total, [pageSize * (curPage - 1) + 1, ragEnd]);
    }

    // 2
    const items: Array<number | "last" | "prev"> = [];

    if (pageTotalNum <= 7) {
        for (let i = 1; i <= pageTotalNum; i++) {
            items.push(i);
        }
    } else {
        items.push(1);

        if (curPage < 4) {
            items.push(2, 3, 4, 5, "last", pageTotalNum);
        } else if (curPage > pageTotalNum - 3) {
            items.push("prev", pageTotalNum - 4, pageTotalNum - 3, pageTotalNum - 2, pageTotalNum - 1, pageTotalNum);
        } else {
            if (curPage > 4) {
                items.push("prev");
            }

            for (let i = curPage - 2; i <= curPage + 2; i++) {
                if (i > 1 && i < pageTotalNum) {
                    items.push(i);
                }
            }
            if (curPage < pageTotalNum - 3) {
                items.push("last");
            }
            items.push(pageTotalNum);
        }
    }

    return (
        <div className={clsx(classes.root, props.className)} style={props.style}>
            {totalRender}
            <div
                className={classes.pageItem}
                onClick={() => {
                    if (current === 1) return;
                    let n = curPage - 1;
                    if (n < 0) {
                        n = 1;
                    }
                    onChange && onChange(n, pageSize);
                }}
            >
                <fluentIcon.ChevronLeftIcon />
            </div>
            {items.map(function (item) {
                if (item === "prev") {
                    return (
                        <div
                            key={item}
                            className={classes.jumpItem}
                            title="向前5页"
                            onClick={() => {
                                let n = curPage - 5;
                                if (n < 0) {
                                    n = 1;
                                }
                                onChange && onChange(n, pageSize);
                            }}
                        >
                            <fluentIcon.MoreIcon className={classes.jumpMore} />
                            <fluentIcon.DoubleChevronLeftIcon className={classes.jumpDir} />
                        </div>
                    );
                }
                if (item === "last") {
                    return (
                        <div
                            key={item}
                            className={classes.jumpItem}
                            title="向后5页"
                            onClick={() => {
                                let n = curPage + 5;
                                if (n > pageTotalNum) {
                                    n = pageTotalNum;
                                }
                                onChange && onChange(n, pageSize);
                            }}
                        >
                            <fluentIcon.MoreIcon className={classes.jumpMore} />
                            <fluentIcon.DoubleChevronRightIcon className={classes.jumpDir} />
                        </div>
                    );
                }

                return (
                    <div
                        key={item}
                        className={clsx(classes.pageItem, item === current ? classes.pageItem_cur : null)}
                        onClick={() => {
                            onChange && onChange(item, pageSize);
                        }}
                    >
                        {item}
                    </div>
                );
            })}
            <div
                className={classes.pageItem}
                onClick={() => {
                    if (current === pageTotalNum) return;
                    let n = curPage + 1;
                    if (n > pageTotalNum) {
                        n = pageTotalNum;
                    }
                    onChange && onChange(n, pageSize);
                }}
            >
                <fluentIcon.ChevronRightIcon />
            </div>
            {disableSizeChanger ? null : (
                <Dropdown
                    className={classes.dropDown}
                    list={pageSizeOptions}
                    selecedKey={pageSize}
                    width={"7em" as any}
                    onChange={(item) => {
                        let key = item?.key;
                        if (key && typeof key === "number" && key !== pageSize) {
                            let nextPage = curPage;
                            if (pageSize < key) {
                                let nextTotal = Math.ceil(total / key) || 1;
                                if (nextPage > nextTotal) {
                                    nextPage = nextTotal;
                                }
                            }
                            onChange && onChange(nextPage, key);
                        }
                    }}
                />
            )}
            {disableQuickJumper || pageTotalNum < 8 ? null : (
                <div className={classes.jumpInput}>
                    <span>跳至</span>
                    <TextInput
                        className={classes.textInput}
                        onEntry={(value, event) => {
                            let n = parseInt(value);
                            if (!isNaN(n)) {
                                if (n < 1) {
                                    n = 1;
                                }
                                if (n > pageTotalNum) {
                                    n = pageTotalNum;
                                }
                                if (n !== current) {
                                    onChange && onChange(n, pageSize);
                                }
                            }
                            event.target.blur();
                        }}
                        onBlur={(event) => {
                            event.target.value = null;
                        }}
                    />
                    <span>页</span>
                </div>
            )}
        </div>
    );
}
