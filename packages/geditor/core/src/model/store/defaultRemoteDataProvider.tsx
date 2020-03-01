import React from "react";
import { editorConfigContext } from "../../public/context";
import { blobToDataURL } from "@gland/function/dataTransform";

class RemoteDataProvider extends React.Component<any, any> {
    static contextType = editorConfigContext;
    constructor(props) {
        super(props);
        props.onRef(this);
    }

    render() {
        return null;
    }

    addContentAsset = async file => {
        const url = await blobToDataURL(file);
        return {
            isRemote: false,
            url,
            size: file.size,
            type: file.type,
            filename: file.name,
            lastModified: file.lastModified
        };
    };

    getContentAsset = async (data, setState) => {
        return data.url;
    };
}

export { RemoteDataProvider }