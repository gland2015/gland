/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 * @emails oncall+draft_js
 */

'use strict';

import BlockMapBuilder from '../immutable/BlockMapBuilder';
import CharacterMetadata from '../immutable/CharacterMetadata';
import ContentBlock from '../immutable/ContentBlock';
import ContentState from '../immutable/ContentState';
import EditorState from '../immutable/EditorState';
import SampleDraftInlineStyle from '../immutable/SampleDraftInlineStyle';
import SelectionState from '../immutable/SelectionState';

import { List, Repeat, OrderedMap  } from 'immutable';

const {BOLD, ITALIC} = SampleDraftInlineStyle;
const ENTITY_KEY = '1';

const BLOCKS = [
  new ContentBlock({
    key: 'a',
    type: 'unstyled',
    text: 'Alpha',
    characterList: List(Repeat(CharacterMetadata.EMPTY, 5)),
  }),
  new ContentBlock({
    key: 'b',
    type: 'unordered-list-item',
    text: 'Bravo',
    characterList: List(
      Repeat(
        CharacterMetadata.create({style: BOLD, entity: ENTITY_KEY}),
        5,
      ),
    ),
  }),
  new ContentBlock({
    key: 'c',
    type: 'code-block',
    text: 'Test',
    characterList: List(Repeat(CharacterMetadata.EMPTY, 4)),
  }),
  new ContentBlock({
    key: 'd',
    type: 'code-block',
    text: '',
    characterList: List(),
  }),
  new ContentBlock({
    key: 'e',
    type: 'code-block',
    text: '',
    characterList: List(),
  }),
  new ContentBlock({
    key: 'f',
    type: 'blockquote',
    text: 'Charlie',
    characterList: List(
      Repeat(
        CharacterMetadata.create({style: ITALIC, entity: null}),
        7,
      ),
    ),
  }),
];

const selectionState = new SelectionState({
  anchorKey: 'a',
  anchorOffset: 0,
  focusKey: 'a',
  focusOffset: 0,
  isBackward: false,
  hasFocus: true,
});

const blockMap = BlockMapBuilder.createFromArray(BLOCKS);
const contentState = new ContentState({
  blockMap,
  entityMap: OrderedMap(),
  selectionBefore: selectionState,
  selectionAfter: selectionState,
  // @ts-ignore
}).createEntity({
  type: 'IMAGE',
  mutability: 'IMMUTABLE',
  data: null,
});

let editorState = EditorState.createWithContent(contentState);
editorState = EditorState.forceSelection(editorState, selectionState);

const getSampleStateForTesting = (): Object => {
  return {editorState, contentState, selectionState};
};

export default  getSampleStateForTesting;
