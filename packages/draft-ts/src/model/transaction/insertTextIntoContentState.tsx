/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 * @emails oncall+draft_js
 */

'use strict';

import {  Repeat } from 'immutable';
import insertIntoList from './insertIntoList';
import invariant from 'fbjs/lib/invariant';


import  CharacterMetadata from '../immutable/CharacterMetadata';
import  ContentState from '../immutable/ContentState';
import  SelectionState from '../immutable/SelectionState';

function insertTextIntoContentState(
  contentState: ContentState,
  selectionState: SelectionState,
  text: string,
  characterMetadata: CharacterMetadata,
): ContentState {
  invariant(
    selectionState.isCollapsed(),
    '`insertText` should only be called with a collapsed range.',
  );

  let len: number = null;
  if (text != null) {
    len = text.length;
  }

  if (len == null || len === 0) {
    return contentState;
  }

  const blockMap = contentState.getBlockMap();
  const key = selectionState.getStartKey();
  const offset = selectionState.getStartOffset();
  const block = blockMap.get(key);
  const blockText = block.getText();

  const newBlock:any = block.merge({
    text:
      blockText.slice(0, offset) +
      text +
      blockText.slice(offset, block.getLength()),
    characterList: insertIntoList(
      block.getCharacterList(),
      Repeat(characterMetadata, len).toList(),
      offset,
    ),
  });

  const newOffset = offset + len;

  return contentState.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: selectionState.merge({
      anchorOffset: newOffset,
      focusOffset: newOffset,
    }),
  }) as any;
}

export default  insertTextIntoContentState;
