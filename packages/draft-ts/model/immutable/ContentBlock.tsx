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

import  {BlockNode, BlockNodeConfig, BlockNodeKey} from './BlockNode';
import {DraftBlockType} from '../constants/DraftBlockType';
import {DraftInlineStyle} from './DraftInlineStyle';

import CharacterMetadata from  './CharacterMetadata';

import findRangesImmutable from './findRangesImmutable';
import Immutable, { List, Map, OrderedSet, Record, Repeat  } from 'immutable';

const EMPTY_SET = OrderedSet<string>();

const defaultRecord: BlockNodeConfig = {
  key: '',
  type: 'unstyled',
  text: '',
  characterList: List(),
  depth: 0,
  data: Map(),
};

const ContentBlockRecord = Record(defaultRecord);

const decorateCharacterList = (config: BlockNodeConfig): BlockNodeConfig => {
  if (!config) {
    return config;
  }

  const {characterList, text} = config;

  if (text && !characterList) {
    config.characterList = List(Repeat(CharacterMetadata.EMPTY, text.length));
  }

  return config;
};

class ContentBlock extends ContentBlockRecord implements BlockNode {
  constructor(config: BlockNodeConfig) {
    super(decorateCharacterList(config));
  }

  getParentKey
  getNextSiblingKey
  getPrevSiblingKey

  getKey(): BlockNodeKey {
    return this.get('key');
  }

  getType(): DraftBlockType {
    return this.get('type');
  }

  getText(): string {
    return this.get('text');
  }

  getCharacterList(): List<CharacterMetadata> {
    return this.get('characterList');
  }

  getLength(): number {
    return this.getText().length;
  }

  getDepth(): number {
    return this.get('depth');
  }

  getData(): Map<any, any> {
    return this.get('data');
  }

  getInlineStyleAt(offset: number): DraftInlineStyle {
    const character = this.getCharacterList().get(offset);
    return character ? character.getStyle() : EMPTY_SET;
  }

  getEntityAt(offset: number): string {
    const character = this.getCharacterList().get(offset);
    return character ? character.getEntity() : null;
  }

  /**
   * Execute a callback for every contiguous range of styles within the block.
   */
  findStyleRanges(
    filterFn: (value: CharacterMetadata) => boolean,
    callback: (start: number, end: number) => void,
  ): void {
    findRangesImmutable(
      this.getCharacterList(),
      haveEqualStyle,
      filterFn,
      callback,
    );
  }

  /**
   * Execute a callback for every contiguous range of entities within the block.
   */
  findEntityRanges(
    filterFn: (value: CharacterMetadata) => boolean,
    callback: (start: number, end: number) => void,
  ): void {
    findRangesImmutable(
      this.getCharacterList(),
      haveEqualEntity,
      filterFn,
      callback,
    );
  }
}

function haveEqualStyle(
  charA: CharacterMetadata,
  charB: CharacterMetadata,
): boolean {
  return charA.getStyle() === charB.getStyle();
}

function haveEqualEntity(
  charA: CharacterMetadata,
  charB: CharacterMetadata,
): boolean {
  return charA.getEntity() === charB.getEntity();
}

export default  ContentBlock;
