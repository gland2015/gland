import React from "react";
import loadable from "@loadable/component";
import { Spinner } from "../../spin/Spinner";

const options = {
    fallback: <Spinner style={{ fontSize: 30 }} />,
};

export const Markdown = loadable(() => import("./Markdown"), options);
