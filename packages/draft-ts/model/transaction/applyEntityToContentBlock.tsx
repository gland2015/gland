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

import  {BlockNodeRecord} from '../immutable/BlockNodeRecord';

import CharacterMetadata from '../immutable/CharacterMetadata';

function applyEntityToContentBlock(
  contentBlock: BlockNodeRecord,
  start: number,
  end: number,
  entityKey: string,
): BlockNodeRecord {
  let characterList = contentBlock.getCharacterList();
  while (start < end) {
    characterList = characterList.set(
      start,
      CharacterMetadata.applyEntity(characterList.get(start), entityKey),
    );
    start++;
  }
  return contentBlock.set('characterList', characterList) as BlockNodeRecord;
}

export default  applyEntityToContentBlock;
