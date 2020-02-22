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

import  DraftEntityInstance from '../entity/DraftEntityInstance';
import {OrderedMap} from 'immutable';
// TODO: when removing the deprecated API update this to use the EntityMap type
// instead of OrderedMap

let key = 0;

function addEntityToEntityMap(
  entityMap: OrderedMap<any, any>,
  instance: DraftEntityInstance,
): OrderedMap <any, any>{
  return entityMap.set(`${++key}`, instance);
}

export default  addEntityToEntityMap;
