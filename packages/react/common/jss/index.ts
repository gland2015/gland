import { CSSProperties } from "react";
import * as css from "csstype";

import { create, Jss, StyleSheetFactoryOptions, StyleSheet } from "jss";
import preset from "jss-preset-default";

// 添加React的CSSProperties类型，以便提示
type Func<R> = (data: any) => R;
type JssValue = string | number | Array<string | number | Array<string | number> | "!important"> | null | false;
type NormalCssProperties = css.Properties<string | number>;
type NormalCssValues<K> = K extends keyof NormalCssProperties ? NormalCssProperties[K] | JssValue : JssValue;
type JssStyle = {
    [K in keyof NormalCssProperties | string]: NormalCssValues<K> | CSSProperties | JssStyle | Func<NormalCssValues<K> | JssStyle | undefined>;
};

type Styles<Name extends string | number | symbol = string> = Record<
    Name,
    CSSProperties | JssStyle | string | Func<JssStyle | string | null | undefined>
>;

interface MyJss extends Jss {
    createStyleSheet<Name extends string | number | symbol>(styles: Partial<Styles<Name>>, options?: StyleSheetFactoryOptions): StyleSheet<Name>;
}

const jss: MyJss = create(preset() as any);

export { jss };
