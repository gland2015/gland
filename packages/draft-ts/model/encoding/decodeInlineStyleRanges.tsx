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

import {DraftInlineStyle} from '../immutable/DraftInlineStyle';
import  {InlineStyleRange} from './InlineStyleRange';

import UnicodeUtils from 'fbjs/lib/UnicodeUtils';

import {OrderedSet} from 'immutable';
const {substr} = UnicodeUtils;

const EMPTY_SET = OrderedSet();

/**
 * Convert to native JavaScript string lengths to determine ranges.
 */
function decodeInlineStyleRanges(
  text: string,
  ranges?: Array<InlineStyleRange>,
): Array<DraftInlineStyle> {
  const styles = Array(text.length).fill(EMPTY_SET);
  if (ranges) {
    ranges.forEach(range => {
      let cursor = substr(text, 0, range.offset).length;
      const end = cursor + substr(text, range.offset, range.length).length;
      while (cursor < end) {
        styles[cursor] = styles[cursor].add(range.style);
        cursor++;
      }
    });
  }
  return styles;
}

export default  decodeInlineStyleRanges;
