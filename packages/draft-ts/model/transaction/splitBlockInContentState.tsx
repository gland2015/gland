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

import  {BlockMap} from '../immutable/BlockMap';
import  ContentState from '../immutable/ContentState';
import  SelectionState from '../immutable/SelectionState';

import ContentBlockNode from '../immutable/ContentBlockNode';

import generateRandomKey from '../keys/generateRandomKey';
import {List, Map}from 'immutable';
import invariant from 'fbjs/lib/invariant';
import modifyBlockForContentState from './modifyBlockForContentState';


const transformBlock = (
  key: string,
  blockMap: BlockMap,
  func: (block: ContentBlockNode) => ContentBlockNode,
): void => {
  if (!key) {
    return;
  }

  const block:any = blockMap.get(key);

  if (!block) {
    return;
  }

  blockMap.set(key, func(block));
};

const updateBlockMapLinks = (
  blockMap: BlockMap,
  originalBlock: ContentBlockNode,
  belowBlock: ContentBlockNode,
): BlockMap => {
  return blockMap.withMutations(blocks => {
    const originalBlockKey = originalBlock.getKey();
    const belowBlockKey = belowBlock.getKey();

    // update block parent
    transformBlock(originalBlock.getParentKey(), blocks, (block:any) => {
      const parentChildrenList = block.getChildKeys();
      const insertionIndex = parentChildrenList.indexOf(originalBlockKey) + 1;
      const newChildrenArray = parentChildrenList.toArray();

      newChildrenArray.splice(insertionIndex, 0, belowBlockKey);

      return block.merge({
        children: List(newChildrenArray),
      });
    });

    // update original next block
    transformBlock(originalBlock.getNextSiblingKey(), blocks, block =>
      block.merge({
        prevSibling: belowBlockKey,
      }) as any,
    );

    // update original block
    transformBlock(originalBlockKey, blocks, block =>
      block.merge({
        nextSibling: belowBlockKey,
      }) as any,
    );

    // update below block
    transformBlock(belowBlockKey, blocks, block =>
      block.merge({
        prevSibling: originalBlockKey,
      }) as any,
    );
  });
};

const splitBlockInContentState = (
  contentState: ContentState,
  selectionState: SelectionState,
): ContentState => {
  invariant(selectionState.isCollapsed(), 'Selection range must be collapsed.');

  const key = selectionState.getAnchorKey();
  const blockMap = contentState.getBlockMap();
  const blockToSplit:any = blockMap.get(key);
  const text = blockToSplit.getText();

  if (!text) {
    const blockType = blockToSplit.getType();
    if (
      blockType === 'unordered-list-item' ||
      blockType === 'ordered-list-item'
    ) {
      return modifyBlockForContentState(contentState, selectionState, block =>
        block.merge({type: 'unstyled', depth: 0}) as any,
      );
    }
  }

  const offset = selectionState.getAnchorOffset();
  const chars = blockToSplit.getCharacterList();
  const keyBelow = generateRandomKey();
  const isExperimentalTreeBlock = blockToSplit instanceof ContentBlockNode;

  const blockAbove = blockToSplit.merge({
    text: text.slice(0, offset),
    characterList: chars.slice(0, offset),
  });
  const blockBelow = blockAbove.merge({
    key: keyBelow,
    text: text.slice(offset),
    characterList: chars.slice(offset),
    data: Map(),
  });

  const blocksBefore = blockMap.toSeq().takeUntil(v => v === blockToSplit);
  const blocksAfter = blockMap
    .toSeq()
    .skipUntil(v => v === blockToSplit)
    .rest();
  let newBlocks = blocksBefore
    .concat(
      [
        [key, blockAbove],
        [keyBelow, blockBelow],
      ],
      blocksAfter,
    )
    .toOrderedMap();

  if (isExperimentalTreeBlock) {
    invariant(
      blockToSplit.getChildKeys().isEmpty(),
      'ContentBlockNode must not have children',
    );

    newBlocks = updateBlockMapLinks(newBlocks, blockAbove, blockBelow);
  }

  return contentState.merge({
    blockMap: newBlocks,
    selectionBefore: selectionState,
    selectionAfter: selectionState.merge({
      anchorKey: keyBelow,
      anchorOffset: 0,
      focusKey: keyBelow,
      focusOffset: 0,
      isBackward: false,
    }) ,
  }) as any;
};

export default  splitBlockInContentState;
