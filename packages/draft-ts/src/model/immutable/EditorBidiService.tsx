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

import  ContentState from './ContentState';

import UnicodeBidiService from 'fbjs/lib/UnicodeBidiService';

import {OrderedMap, is} from 'immutable';
import nullthrows from 'fbjs/lib/nullthrows';


let bidiService;

const EditorBidiService = {
  getDirectionMap: function(
    content: ContentState,
    prevBidiMap: OrderedMap<any, any>,
  ): OrderedMap<any, any> {
    if (!bidiService) {
      bidiService = new UnicodeBidiService();
    } else {
      bidiService.reset();
    }

    const blockMap = content.getBlockMap();
    const nextBidi = blockMap
      .valueSeq()
      .map(block => nullthrows(bidiService).getDirection(block.getText()));
    const bidiMap = OrderedMap(blockMap.keySeq().zip(nextBidi));

    if (prevBidiMap != null && is(prevBidiMap, bidiMap)) {
      return prevBidiMap;
    }

    return bidiMap;
  },
};

export default  EditorBidiService;
