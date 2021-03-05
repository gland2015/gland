import { Editor } from "../core";
import { Toolbar } from "./Toolbar";
import { editEvent } from "./editEvent";
import { attachStyle, rootClasses as classes, richClasses } from "./style";
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

attachStyle();

export { Editor, Toolbar, editEvent };
export const config = {
    classNames: {
        root: richClasses.root,
        div: richClasses.div,
        h1: richClasses.h1,
        h2: richClasses.h2,
        h3: richClasses.h3,
        h4: richClasses.h4,
        blockquote: richClasses.blockquote,
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
