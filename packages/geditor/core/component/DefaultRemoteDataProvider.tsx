import React from "react";
import { EditorContext } from "../public/context";
import { blobToDataURL } from "@gland/function/dataTransform";

class DefaultRemoteDataProvider extends React.Component<any, any> {
    static contextType = EditorContext;
    constructor(props) {
        super(props);
        props.onRef(this);
    }

    render() {
        return null;
    }

    addContentAsset = async (file) => {
        const url = await blobToDataURL(file);
        return {
            isRemote: false,
            url,
            size: file.size,
            type: file.type,
            filename: file.name,
            lastModified: file.lastModified,
        };
    };

    getContentAsset = async (data, setState) => {
        return data.url;
    };
}

export { DefaultRemoteDataProvider };
