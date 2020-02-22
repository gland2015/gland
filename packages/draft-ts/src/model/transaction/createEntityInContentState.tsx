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

import ContentState from '../immutable/ContentState';
import  {DraftEntityMutability} from '../entity/DraftEntityMutability';
import  {DraftEntityType} from '../entity/DraftEntityType';

import DraftEntityInstance from '../entity/DraftEntityInstance';

import addEntityToContentState from './addEntityToContentState';

function createEntityInContentState(
  contentState: ContentState,
  type: DraftEntityType,
  mutability: DraftEntityMutability,
  data?: Object,
): ContentState {
  return addEntityToContentState(
    contentState,
    new DraftEntityInstance({type, mutability, data: data || {}}),
  );
}

export default  createEntityInContentState;
