import React from "react";
import { blobToDataURL } from "@gland/function/dataTransform";

class DefaultRemoteDataProvider extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        return null;
    }

    addContentAsset = async (file, from) => {
        const url = await blobToDataURL(file);
        return {
            mediaId: "",
            URL: url,
            isRemote: false,
        };
    };

    getContentAsset = async (data, setState) => {
        return data.url;
    };
}

export { DefaultRemoteDataProvider };
