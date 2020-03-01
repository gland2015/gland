import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { OrderedSet } from "immutable";

const useStyles = makeStyles({
    icon: (props: any) => {
        const { type } = props;
        let icon = fileIconMap[type];
        if (!icon) {
            icon = fileIconMap["file"];
        }

        return {
            fontFamily: "FontAwesome",
            "&:before": {
                content: icon
            }
        };
    }
});

const fileIconMap = {
    "application/pdf": `"\\f1c1"`,
    "image/jpeg": `"\\f1c5"`,
    file: `"\\f15b"`
};

export function File(props) {
    const { data, offsetKey, children, context } = props;
    const { size, filename, type, lastModified } = data;
    const classes = useStyles({ type });
    const { isRemote } = data;
    const [state, setState] = React.useState();
    let url;
    if (isRemote) {
        url = context.editor.remoteDataProvider.getContentAsset(data, setState);
    } else {
        url = data.url;
    }
    const ele = React.cloneElement(children[0], {
        custom: (
            <span className={classes.icon}>
                <a href={url} target="_blank" download>
                    {filename}文件一个,大小：{size}
                </a>
            </span>
        )
    });

    return ele;
}

//                 className: classes.icon

//  {filename}文件一个{size}
