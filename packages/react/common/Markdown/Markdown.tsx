import React from "react";
import ReactMarkdown from "react-markdown";
import math from "remark-math";
import gfm from "remark-gfm";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import clsx from "clsx";
import "./github.css";

import { SyntaxHighlighter, styles as syntaxStyles } from "../SyntaxHighlighter";

const plugins = [math, gfm];

const renderers = {
    inlineMath: ({ value }) => <InlineMath math={value} />,
    math: ({ value }) => <BlockMath math={value} />,
    code: ({ language, value }) => {
        return <SyntaxHighlighter style={syntaxStyles.atomDark} language={language} children={value} />;
    },
};

function Markdown(props: { className?; children }) {
    return (
        <div className={clsx("markdown-body", props.className)}>
            <ReactMarkdown allowDangerousHtml plugins={plugins} renderers={renderers} children={props.children} />
        </div>
    );
}

export default Markdown;
