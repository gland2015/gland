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

import {BlockNodeRecord} from '../immutable/BlockNodeRecord';
import  {EntityRange} from './EntityRange';

import DraftStringKey  from './DraftStringKey';
import UnicodeUtils from 'fbjs/lib/UnicodeUtils';

const {strlen} = UnicodeUtils;

/**
 * Convert to UTF-8 character counts for storage.
 */
function encodeEntityRanges(
  block: BlockNodeRecord,
  storageMap: Object,
): Array<EntityRange> {
  const encoded = [];
  block.findEntityRanges(
    character => !!character.getEntity(),
    (/*number*/ start, /*number*/ end) => {
      const text = block.getText();
      const key = block.getEntityAt(start);
      encoded.push({
        offset: strlen(text.slice(0, start)),
        length: strlen(text.slice(start, end)),
        // Encode the key as a number for range storage.
        key: Number(storageMap[DraftStringKey.stringify(key)]),
      });
    },
  );
  return encoded;
}

export default  encodeEntityRanges;
