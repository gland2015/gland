import React from "react";
import { icons } from "../../icons";
import { DropButton } from "./widget";
import { ToolAttr } from "../utils";

export function FontFamily(props: { attr: ToolAttr }) {
    return (
        <DropButton
            tip="字体"
            list={[
                {
                    label: <span>默认字体</span>,
                    value: null,
                },
                {
                    label: <span style={{ fontFamily: "KaiTi" }}>楷体</span>,
                    value: "KaiTi",
                },
                {
                    label: <span style={{ fontFamily: "STXingkai" }}>华文行楷</span>,
                    value: "STXingkai",
                },
                {
                    label: <span style={{ fontFamily: "STXinwei" }}>华文新魏</span>,
                    value: "STXinwei",
                },
                {
                    label: <span style={{ fontFamily: "YouYuan" }}>幼圆</span>,
                    value: "YouYuan",
                },
                {
                    label: <span style={{ fontFamily: "LiSu" }}>隶书</span>,
                    value: "LiSu",
                },
                {
                    label: <span style={{ fontFamily: "Microsoft YaHei" }}>微软雅黑</span>,
                    value: "Microsoft YaHei",
                },
                {
                    label: <span style={{ fontFamily: "STCaiyun" }}>华文彩云</span>,
                    value: "STCaiyun",
                },
                {
                    label: <span style={{ fontFamily: "Times New Roman" }}>Times New Roman</span>,
                    value: "Times New Roman",
                },
                {
                    label: <span style={{ fontFamily: "Tahoma" }}>Tahoma</span>,
                    value: "Tahoma",
                },
            ]}
            getCurValue={() => {
                const attr = props.attr;
                return attr.currentState.inlineStyle?.fontFamily;
            }}
            onSelect={(item) => {
                const attr = props.attr;
                attr.event.emit(attr.editEvent.fontFamily, item.value);
            }}
        >
            <icons.FontFamily />
        </DropButton>
    );
}
