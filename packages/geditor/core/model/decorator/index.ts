import { CompositeDecorator } from "@gland/draft-ts";
import { identifier } from "../../public/constants";
import { DraftEntity } from "../../component";

export const editorDecorator = {
    strategy: findEditorEntities,
    component: DraftEntity,
};

function findEditorEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        if (!entityKey) return false;
        const type = contentState.getEntity(entityKey).getType();
        return type === identifier;
    }, callback);
}

/**
 * 获取编辑器的装饰器
 * @param decorators
 */
export function getDecorator(decorators?) {
    decorators = decorators || [];
    return new CompositeDecorator([editorDecorator, ...decorators]);
}
