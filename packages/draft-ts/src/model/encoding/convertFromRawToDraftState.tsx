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
import {BlockNodeConfig} from '../immutable/BlockNode';
import  CharacterMetadata from '../immutable/CharacterMetadata';
import  {RawDraftContentBlock} from './RawDraftContentBlock';
import  {RawDraftContentState} from './RawDraftContentState';

import ContentBlock from '../immutable/ContentBlock';
import ContentBlockNode from '../immutable/ContentBlockNode';
import ContentState from '../immutable/ContentState';
import DraftEntity from '../entity/DraftEntity';
import DraftTreeAdapter from '../../component/utils/exploration/DraftTreeAdapter';
import DraftTreeInvariants from '../../component/utils/exploration/DraftTreeInvariants';
import SelectionState from '../immutable/SelectionState';

import createCharacterList from './createCharacterList';
import decodeEntityRanges from './decodeEntityRanges';
import decodeInlineStyleRanges from './decodeInlineStyleRanges';
import generateRandomKey from '../keys/generateRandomKey';
import gkx from '../../stubs/gkx';
import {List, Map, OrderedMap} from 'immutable';
import invariant from 'fbjs/lib/invariant';

const experimentalTreeDataSupport = gkx('draft_tree_data_support');

const decodeBlockNodeConfig = (
  block: RawDraftContentBlock,
  entityMap: any,
): BlockNodeConfig => {
  const {key, type, data, text, depth} = block;

  const blockNodeConfig: BlockNodeConfig = {
    text,
    depth: depth || 0,
    type: type || 'unstyled',
    key: key || generateRandomKey(),
    data: Map(data),
    characterList: decodeCharacterList(block, entityMap),
  };

  return blockNodeConfig;
};

const decodeCharacterList = (
  block: RawDraftContentBlock,
  entityMap: any,
): List<CharacterMetadata> => {
  const {
    text,
    entityRanges: rawEntityRanges,
    inlineStyleRanges: rawInlineStyleRanges,
  } = block;

  const entityRanges = rawEntityRanges || [];
  const inlineStyleRanges = rawInlineStyleRanges || [];

  // Translate entity range keys to the DraftEntity map.
  return createCharacterList(
    decodeInlineStyleRanges(text, inlineStyleRanges),
    decodeEntityRanges(
      text,
      entityRanges
        .filter(range => entityMap.hasOwnProperty(range.key))
        .map(range => ({...range, key: entityMap[range.key]})),
    ),
  );
};

const addKeyIfMissing = (block: RawDraftContentBlock): RawDraftContentBlock => {
  return {
    ...block,
    key: block.key || generateRandomKey(),
  };
};

/**
 * Node stack is responsible to ensure we traverse the tree only once
 * in depth order, while also providing parent refs to inner nodes to
 * construct their links.
 */
const updateNodeStack = (
  stack: Array<any>,
  nodes: Array<any>,
  parentRef: ContentBlockNode,
): Array<any> => {
  const nodesWithParentRef = nodes.map(block => {
    return {
      ...block,
      parentRef,
    };
  });

  // since we pop nodes from the stack we need to insert them in reverse
  return stack.concat(nodesWithParentRef.reverse());
};

/**
 * This will build a tree draft content state by creating the node
 * reference links into a single tree walk. Each node has a link
 * reference to "parent", "children", "nextSibling" and "prevSibling"
 * blockMap will be created using depth ordering.
 */
const decodeContentBlockNodes = (
  blocks: Array<RawDraftContentBlock>,
  entityMap: any,
): BlockMap => {
  return (
    blocks
      // ensure children have valid keys to enable sibling links
      .map(addKeyIfMissing)
      .reduce(
        (blockMap: BlockMap, block: RawDraftContentBlock, index: number) => {
          invariant(
            Array.isArray(block.children),
            'invalid RawDraftContentBlock can not be converted to ContentBlockNode',
          );

          // ensure children have valid keys to enable sibling links
          const children = block.children.map(addKeyIfMissing);

          // root level nodes
          const contentBlockNode = new ContentBlockNode({
            ...decodeBlockNodeConfig(block, entityMap),
            prevSibling: index === 0 ? null : blocks[index - 1].key,
            nextSibling:
              index === blocks.length - 1 ? null : blocks[index + 1].key,
            children: List(children.map((child: any) => child.key)),
          });

          // push root node to blockMap
          blockMap = blockMap.set(contentBlockNode.getKey(), contentBlockNode);

          // this stack is used to ensure we visit all nodes respecting depth ordering
          let stack = updateNodeStack([], children, contentBlockNode);

          // start computing children nodes
          while (stack.length > 0) {
            // we pop from the stack and start processing this node
            const node: any = stack.pop();

            // parentRef already points to a converted ContentBlockNode
            const parentRef: ContentBlockNode = node.parentRef;
            const siblings = parentRef.getChildKeys();
            const index = siblings.indexOf(node.key);
            const isValidBlock = Array.isArray(node.children);

            if (!isValidBlock) {
              invariant(
                isValidBlock,
                'invalid RawDraftContentBlock can not be converted to ContentBlockNode',
              );
              break;
            }

            // ensure children have valid keys to enable sibling links
            const children = node.children.map(addKeyIfMissing);

            const contentBlockNode = new ContentBlockNode({
              ...decodeBlockNodeConfig(node, entityMap),
              parent: parentRef.getKey(),
              children: List(children.map((child: any) => child.key)),
              prevSibling: index === 0 ? null : siblings.get(index - 1),
              nextSibling:
                index === siblings.size - 1 ? null : siblings.get(index + 1),
            });

            // push node to blockMap
            blockMap = blockMap.set(
              contentBlockNode.getKey(),
              contentBlockNode,
            );

            // this stack is used to ensure we visit all nodes respecting depth ordering
            stack = updateNodeStack(stack, children, contentBlockNode);
          }

          return blockMap;
        },
        OrderedMap(),
      )
  );
};

const decodeContentBlocks = (
  blocks: Array<RawDraftContentBlock>,
  entityMap: any,
): BlockMap => {
  return OrderedMap(
    blocks.map((block: RawDraftContentBlock) => {
      const contentBlock = new ContentBlock(
        decodeBlockNodeConfig(block, entityMap),
      );
      return [contentBlock.getKey(), contentBlock];
    }),
  );
};

const decodeRawBlocks = (
  rawState: RawDraftContentState,
  entityMap: any,
): BlockMap => {
  const isTreeRawBlock = rawState.blocks.find(
    block => Array.isArray(block.children) && block.children.length > 0,
  );
  const rawBlocks =
    experimentalTreeDataSupport && !isTreeRawBlock
      ? DraftTreeAdapter.fromRawStateToRawTreeState(rawState).blocks
      : rawState.blocks;

  if (!experimentalTreeDataSupport) {
    return decodeContentBlocks(
      isTreeRawBlock
        ? DraftTreeAdapter.fromRawTreeStateToRawState(rawState).blocks
        : rawBlocks,
      entityMap,
    );
  }

  const blockMap = decodeContentBlockNodes(rawBlocks, entityMap);
  // in dev mode, check that the tree invariants are met
  if (window['__DEV__']) {
    invariant(
      DraftTreeInvariants.isValidTree(blockMap),
      'Should be a valid tree',
    );
  }
  return blockMap;
};

const decodeRawEntityMap = (rawState: RawDraftContentState): any => {
  const {entityMap: rawEntityMap} = rawState;
  const entityMap = {};

  // TODO: Update this once we completely remove DraftEntity
  Object.keys(rawEntityMap).forEach(rawEntityKey => {
    const {type, mutability, data} = rawEntityMap[rawEntityKey];

    // get the key reference to created entity
    entityMap[rawEntityKey] = DraftEntity.__create(
      type,
      mutability,
      data || {},
    );
  });

  return entityMap;
};

const convertFromRawToDraftState = (
  rawState: RawDraftContentState,
): ContentState => {
  invariant(Array.isArray(rawState.blocks), 'invalid RawDraftContentState');

  // decode entities
  const entityMap = decodeRawEntityMap(rawState);

  // decode blockMap
  const blockMap = decodeRawBlocks(rawState, entityMap);

  // create initial selection
  const selectionState = blockMap.isEmpty()
    ? new SelectionState()
    : SelectionState.createEmpty(blockMap.first().getKey());

  return new ContentState({
    blockMap,
    entityMap,
    selectionBefore: selectionState,
    selectionAfter: selectionState,
  });
};

export default  convertFromRawToDraftState;
