import React from "react";
import { Editor, RemoteDataProvider } from "@gland/geditor/core";
import { Toolbar, entityComponent } from "@gland/geditor/simpleToolbar";

const config = {
    entityComponent,
    RemoteDataProvider
};

export default function GEditor() {
    return <Editor Toolbar={Toolbar} config={config} />;
}
