import {
    Emoticon,
    Link,
    Code,
    Formula,
    InlineFormula,
    HorizontalRule,
    Image,
    InlineImage,
    Video,
    Audio,
    File,
    ListOl,
    ListUl,
    ExpandableList,
    Table,
    Comment,
    Iframe,
} from "./RichComp";
import { richClasses as classes } from "./style";

export const config = {
    classNames: {
        root: classes.root,
        div: classes.div,
        h1: classes.h1,
        h2: classes.h2,
        h3: classes.h3,
        h4: classes.h4,
        blockquote: classes.blockquote,
    },
    noFollowBlocks: ["h1", "h2", "h3", "h4", "h5", "h6", "blockquote"],
    entitys: {
        Emoticon,
        Link,
        InlineFormula,
        InlineImage,
        Comment,
    },
    nonTexts: { Code, Formula, HorizontalRule, Image, Video, Audio, File, Iframe },
    wrappers: {
        ListOl,
        ListUl,
    },
    subBlocks: {
        ExpandableList,
        Table,
    },
};
