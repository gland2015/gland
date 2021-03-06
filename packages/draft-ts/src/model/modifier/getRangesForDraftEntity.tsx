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
import  {DraftRange} from './DraftRange';

import invariant from 'fbjs/lib/invariant';

/**
 * Obtain the start and end positions of the range that has the
 * specified entity applied to it.
 *
 * Entity keys are applied only to contiguous stretches of text, so this
 * method searches for the first instance of the entity key and returns
 * the subsequent range.
 */
function getRangesForDraftEntity(
  block: BlockNodeRecord,
  key: string,
): Array<DraftRange> {
  const ranges = [];
  block.findEntityRanges(
    c => c.getEntity() === key,
    (start, end) => {
      ranges.push({start, end});
    },
  );

  invariant(!!ranges.length, 'Entity key not found in this range.');

  return ranges;
}

export default  getRangesForDraftEntity;
