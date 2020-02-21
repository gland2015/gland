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

import  {DraftInlineStyle} from '../immutable/DraftInlineStyle';

import CharacterMetadata from '../immutable/CharacterMetadata';

import {List}from 'immutable';

function createCharacterList(
  inlineStyles: Array<DraftInlineStyle>,
  entities: Array<string>,
): List<CharacterMetadata> {
  const characterArray = inlineStyles.map((style, ii) => {
    const entity = entities[ii];
    return CharacterMetadata.create({style, entity});
  });
  return List(characterArray);
}

export default  createCharacterList;