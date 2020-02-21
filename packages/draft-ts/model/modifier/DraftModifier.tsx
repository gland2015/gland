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
import  {DraftBlockType} from '../constants/DraftBlockType';
import  {DraftInlineStyle} from '../immutable/DraftInlineStyle';
import  {DraftRemovalDirection} from '../constants/DraftRemovalDirection';
import  SelectionState from '../immutable/SelectionState';
import  {BlockDataMergeBehavior} from '../transaction/insertFragmentIntoContentState';

import CharacterMetadata from '../immutable/CharacterMetadata';
import ContentStateInlineStyle from '../transaction/ContentStateInlineStyle';

import applyEntityToContentState from '../transaction/applyEntityToContentState';
import getCharacterRemovalRange from './getCharacterRemovalRange';
import getContentStateFragment from '../transaction/getContentStateFragment';
import{OrderedSet, Map}from 'immutable';
import insertFragmentIntoContentState from '../transaction/insertFragmentIntoContentState';
import insertTextIntoContentState from '../transaction/insertTextIntoContentState';
import invariant from 'fbjs/lib/invariant';
import modifyBlockForContentState from '../transaction/modifyBlockForContentState';
import removeEntitiesAtEdges from '../transaction/removeEntitiesAtEdges';
import removeRangeFromContentState from '../transaction/removeRangeFromContentState';
import splitBlockInContentState from '../transaction/splitBlockInContentState';


/**
 * `DraftModifier` provides a set of convenience methods that apply
 * modifications to a `ContentState` object based on a target `SelectionState`.
 *
 * Any change to a `ContentState` should be decomposable into a series of
 * transaction functions that apply the re quired changes and return output
 * `ContentState` objects.
 *
 * These functions encapsulate some of the most common transaction sequences.
 */
const DraftModifier = {
  replaceText: function(
    contentState: ContentState,
    rangeToReplace: SelectionState,
    text: string,
    inlineStyle?: DraftInlineStyle,
    entityKey?: string,
  ): ContentState {
    const withoutEntities = removeEntitiesAtEdges(contentState, rangeToReplace);
    const withoutText = removeRangeFromContentState(
      withoutEntities,
      rangeToReplace,
    );

    const character = CharacterMetadata.create({
      style: inlineStyle || OrderedSet(),
      entity: entityKey || null,
    });

    return insertTextIntoContentState(
      withoutText,
      withoutText.getSelectionAfter(),
      text,
      character,
    );
  },

  insertText: function(
    contentState: ContentState,
    targetRange: SelectionState,
    text: string,
    inlineStyle?: DraftInlineStyle,
    entityKey?: string,
  ): ContentState {
    invariant(
      targetRange.isCollapsed(),
      'Target range must be collapsed for `insertText`.',
    );
    return DraftModifier.replaceText(
      contentState,
      targetRange,
      text,
      inlineStyle,
      entityKey,
    );
  },

  moveText: function(
    contentState: ContentState,
    removalRange: SelectionState,
    targetRange: SelectionState,
  ): ContentState {
    const movedFragment = getContentStateFragment(contentState, removalRange);

    const afterRemoval = DraftModifier.removeRange(
      contentState,
      removalRange,
      'backward',
    );

    return DraftModifier.replaceWithFragment(
      afterRemoval,
      targetRange,
      movedFragment,
    );
  },

  replaceWithFragment: function(
    contentState: ContentState,
    targetRange: SelectionState,
    fragment: BlockMap,
    mergeBlockData: BlockDataMergeBehavior = 'REPLACE_WITH_NEW_DATA',
  ): ContentState {
    const withoutEntities = removeEntitiesAtEdges(contentState, targetRange);
    const withoutText = removeRangeFromContentState(
      withoutEntities,
      targetRange,
    );

    return insertFragmentIntoContentState(
      withoutText,
      withoutText.getSelectionAfter(),
      fragment,
      mergeBlockData,
    );
  },

  removeRange: function(
    contentState: ContentState,
    rangeToRemove: SelectionState,
    removalDirection: DraftRemovalDirection,
  ): ContentState {
    let startKey, endKey, startBlock, endBlock;
    if (rangeToRemove.getIsBackward()) {
      rangeToRemove = rangeToRemove.merge({
        anchorKey: rangeToRemove.getFocusKey(),
        anchorOffset: rangeToRemove.getFocusOffset(),
        focusKey: rangeToRemove.getAnchorKey(),
        focusOffset: rangeToRemove.getAnchorOffset(),
        isBackward: false,
      }) as any;
    }
    startKey = rangeToRemove.getAnchorKey();
    endKey = rangeToRemove.getFocusKey();
    startBlock = contentState.getBlockForKey(startKey);
    endBlock = contentState.getBlockForKey(endKey);
    const startOffset = rangeToRemove.getStartOffset();
    const endOffset = rangeToRemove.getEndOffset();

    const startEntityKey = startBlock.getEntityAt(startOffset);
    const endEntityKey = endBlock.getEntityAt(endOffset - 1);

    // Check whether the selection state overlaps with a single entity.
    // If so, try to remove the appropriate substring of the entity text.
    if (startKey === endKey) {
      if (startEntityKey && startEntityKey === endEntityKey) {
        const adjustedRemovalRange = getCharacterRemovalRange(
          contentState.getEntityMap(),
          startBlock,
          endBlock,
          rangeToRemove,
          removalDirection,
        );
        return removeRangeFromContentState(contentState, adjustedRemovalRange);
      }
    }

    const withoutEntities = removeEntitiesAtEdges(contentState, rangeToRemove);
    return removeRangeFromContentState(withoutEntities, rangeToRemove);
  },

  splitBlock: function(
    contentState: ContentState,
    selectionState: SelectionState,
  ): ContentState {
    const withoutEntities = removeEntitiesAtEdges(contentState, selectionState);
    const withoutText = removeRangeFromContentState(
      withoutEntities,
      selectionState,
    );

    return splitBlockInContentState(
      withoutText,
      withoutText.getSelectionAfter(),
    );
  },

  applyInlineStyle: function(
    contentState: ContentState,
    selectionState: SelectionState,
    inlineStyle: string,
  ): ContentState {
    return ContentStateInlineStyle.add(
      contentState,
      selectionState,
      inlineStyle,
    );
  },

  removeInlineStyle: function(
    contentState: ContentState,
    selectionState: SelectionState,
    inlineStyle: string,
  ): ContentState {
    return ContentStateInlineStyle.remove(
      contentState,
      selectionState,
      inlineStyle,
    );
  },

  setBlockType: function(
    contentState: ContentState,
    selectionState: SelectionState,
    blockType: DraftBlockType,
  ): ContentState {
    return modifyBlockForContentState(contentState, selectionState, block =>
      block.merge({type: blockType, depth: 0}) as any,
    );
  },

  setBlockData: function(
    contentState: ContentState,
    selectionState: SelectionState,
    blockData: Map<any, any>,
  ): ContentState {
    return modifyBlockForContentState(contentState, selectionState, block =>
      block.merge({data: blockData}) as any,
    );
  },

  mergeBlockData: function(
    contentState: ContentState,
    selectionState: SelectionState,
    blockData: Map<any, any>,
  ): ContentState {
    return modifyBlockForContentState(contentState, selectionState, block =>
      block.merge({data: block.getData().merge(blockData)}) as any,
    );
  },

  applyEntity: function(
    contentState: ContentState,
    selectionState: SelectionState,
    entityKey: string,
  ): ContentState {
    const withoutEntities = removeEntitiesAtEdges(contentState, selectionState);
    return applyEntityToContentState(
      withoutEntities,
      selectionState,
      entityKey,
    );
  },
};

export default  DraftModifier;
