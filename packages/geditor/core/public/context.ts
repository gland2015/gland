import React from "react";
import { IEditorContext, EditTarget } from "../interface";

export const EditorContext = React.createContext(null as IEditorContext);
export const TargetContext = React.createContext(null as EditTarget);
