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

import  {BlockMap} from '../immutable/BlockMap';
import  ContentState from '../immutable/ContentState';
import SelectionState from '../immutable/SelectionState';

import randomizeBlockMapKeys from './randomizeBlockMapKeys';
import removeEntitiesAtEdges from './removeEntitiesAtEdges';

const getContentStateFragment = (
  contentState: ContentState,
  selectionState: SelectionState,
): BlockMap => {
  const startKey = selectionState.getStartKey();
  const startOffset = selectionState.getStartOffset();
  const endKey = selectionState.getEndKey();
  const endOffset = selectionState.getEndOffset();

  // Edge entities should be stripped to ensure that we don't preserve
  // invalid partial entities when the fragment is reused. We do, however,
  // preserve entities that are entirely within the selection range.
  const contentWithoutEdgeEntities = removeEntitiesAtEdges(
    contentState,
    selectionState,
  );

  const blockMap = contentWithoutEdgeEntities.getBlockMap();
  const blockKeys = blockMap.keySeq();
  const startIndex = blockKeys.indexOf(startKey);
  const endIndex = blockKeys.indexOf(endKey) + 1;

  return randomizeBlockMapKeys(
    blockMap.slice(startIndex, endIndex).map((block, blockKey) => {
      const text = block.getText();
      const chars = block.getCharacterList();

      if (startKey === endKey) {
        return block.merge({
          text: text.slice(startOffset, endOffset),
          characterList: chars.slice(startOffset, endOffset),
        });
      }

      if (blockKey === startKey) {
        return block.merge({
          text: text.slice(startOffset),
          characterList: chars.slice(startOffset),
        });
      }

      if (blockKey === endKey) {
        return block.merge({
          text: text.slice(0, endOffset),
          characterList: chars.slice(0, endOffset),
        });
      }

      return block;
    }) as any,
  );
};

export default  getContentStateFragment;
