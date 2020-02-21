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

import  {BlockNodeRecord} from './BlockNodeRecord';
import CharacterMetadata from './CharacterMetadata';
import ContentState from './ContentState';
import {DraftDecoratorType} from '../decorators/DraftDecoratorType';
import findRangesImmutable from './findRangesImmutable';
import {List, Repeat, Record, Map} from 'immutable';


const returnTrue = function() {
  return true;
};

const defaultLeafRange: {
  start: number,
  end: number,
} = {
  start: null,
  end: null,
};

const LeafRange = Record(defaultLeafRange);

const defaultDecoratorRange: {
  start: number,
  end: number,
  decoratorKey: string,
  leaves: List<typeof LeafRange>,
} = {
  start: null,
  end: null,
  decoratorKey: null,
  leaves: null,
};

const DecoratorRange = Record(defaultDecoratorRange);

const BlockTree = {
  /**
   * Generate a block tree for a given ContentBlock/decorator pair.
   */
  generate: function(
    contentState: ContentState,
    block: BlockNodeRecord,
    decorator:DraftDecoratorType,
  ): List<Map<string, any>> {
    const textLength = block.getLength();
    if (!textLength) {
      return List.of(
        new DecoratorRange({
          start: 0,
          end: 0,
          decoratorKey: null,
          leaves: List.of(new LeafRange({start: 0, end: 0})),
        }),
      );
    }

    const leafSets = [];
    const decorations = decorator
      ? decorator.getDecorations(block, contentState)
      : List(Repeat(null, textLength));

    const chars = block.getCharacterList();

    findRangesImmutable(decorations, areEqual, returnTrue, (start, end) => {
      leafSets.push(
        new DecoratorRange({
          start,
          end,
          decoratorKey: decorations.get(start),
          leaves: generateLeaves(chars.slice(start, end).toList(), start),
        }),
      );
    });

    return List(leafSets);
  },
};

/**
 * Generate LeafRange records for a given character list.
 */
function generateLeaves(
  characters: List<CharacterMetadata>,
  offset: number,
): List<typeof LeafRange> {
  const leaves = [];
  const inlineStyles = characters.map(c => c.getStyle()).toList();
  findRangesImmutable(inlineStyles, areEqual, returnTrue, (start, end) => {
    leaves.push(
      new LeafRange({
        start: start + offset,
        end: end + offset,
      }),
    );
  });
  return List(leaves);
}

function areEqual(a: any, b: any): boolean {
  return a === b;
}

export default  BlockTree;
