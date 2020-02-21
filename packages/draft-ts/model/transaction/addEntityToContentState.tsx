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

import  ContentState from '../immutable/ContentState';
import  DraftEntityInstance from '../entity/DraftEntityInstance';

import addEntityToEntityMap from './addEntityToEntityMap';

function addEntityToContentState(
  contentState: ContentState,
  instance: DraftEntityInstance,
): ContentState {
  return contentState.set(
    'entityMap',
    addEntityToEntityMap(contentState.getEntityMap(), instance),
  ) as ContentState;
}

export default  addEntityToContentState;
