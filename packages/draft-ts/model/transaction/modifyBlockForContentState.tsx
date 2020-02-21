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

import  {BlockNodeRecord} from '../immutable/BlockNodeRecord';
import  ContentState from '../immutable/ContentState';
import  SelectionState from '../immutable/SelectionState';

import { Map } from 'immutable';


function modifyBlockForContentState(
  contentState: ContentState,
  selectionState: SelectionState,
  operation: (block: BlockNodeRecord) => BlockNodeRecord,
): ContentState {
  const startKey = selectionState.getStartKey();
  const endKey = selectionState.getEndKey();
  const blockMap = contentState.getBlockMap();
  const newBlocks = blockMap
    .toSeq()
    .skipUntil((_, k) => k === startKey)
    .takeUntil((_, k) => k === endKey)
    .concat(Map([[endKey, blockMap.get(endKey)]]))
    .map(operation);

  return contentState.merge({
    blockMap: blockMap.merge(newBlocks),
    selectionBefore: selectionState,
    selectionAfter: selectionState,
  }) as any ;
}

export default  modifyBlockForContentState;
