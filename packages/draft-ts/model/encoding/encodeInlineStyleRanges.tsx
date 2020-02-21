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
import  {DraftInlineStyle} from '../immutable/DraftInlineStyle';
import  {InlineStyleRange} from './InlineStyleRange';
import  {List} from 'immutable';

import UnicodeUtils from 'fbjs/lib/UnicodeUtils';

import findRangesImmutable from '../immutable/findRangesImmutable';

const areEqual = (a, b) => a === b;
const isTruthy = a => !!a;
const EMPTY_ARRAY = [];

/**
 * Helper function for getting encoded styles for each inline style. Convert
 * to UTF-8 character counts for storage.
 */
function getEncodedInlinesForType(
  block: BlockNodeRecord,
  styleList: List<DraftInlineStyle>,
  styleToEncode: string,
): Array<InlineStyleRange> {
  const ranges = [];

  // Obtain an array with ranges for only the specified style.
  const filteredInlines = styleList
    .map(style => style.has(styleToEncode))
    .toList();

  findRangesImmutable(
    filteredInlines,
    areEqual,
    // We only want to keep ranges with nonzero style values.
    isTruthy,
    (start, end) => {
      const text = block.getText();
      ranges.push({
        offset: UnicodeUtils.strlen(text.slice(0, start)),
        length: UnicodeUtils.strlen(text.slice(start, end)),
        style: styleToEncode,
      });
    },
  );

  return ranges;
}

/*
 * Retrieve the encoded arrays of inline styles, with each individual style
 * treated separately.
 */
function encodeInlineStyleRanges(
  block: BlockNodeRecord,
): Array<InlineStyleRange> {
  const styleList = block
    .getCharacterList()
    .map(c => c.getStyle())
    .toList();
  const ranges = styleList
    .flatten()
    .toSet()
    .map(style => getEncodedInlinesForType(block, styleList, style));

  return Array.prototype.concat.apply(EMPTY_ARRAY, ranges.toJS());
}

export default  encodeInlineStyleRanges;
