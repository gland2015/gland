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

import EditorState from '../../model/immutable/EditorState';
import  SelectionState from '../../model/immutable/SelectionState';

import DraftOffsetKey from './DraftOffsetKey';

import nullthrows from 'fbjs/lib/nullthrows';

function getUpdatedSelectionState(
  editorState: EditorState,
  anchorKey: string,
  anchorOffset: number,
  focusKey: string,
  focusOffset: number,
): SelectionState {
  const selection: SelectionState = nullthrows(editorState.getSelection());
  if (window['__DEV__']) {
    if (!anchorKey || !focusKey) {
      /* eslint-disable-next-line */
      console.warn('Invalid selection state.', arguments, editorState.toJS());
      return selection;
    }
  }

  const anchorPath = DraftOffsetKey.decode(anchorKey);
  const anchorBlockKey = anchorPath.blockKey;
  const anchorLeaf = editorState
    .getBlockTree(anchorBlockKey)
    .getIn([anchorPath.decoratorKey, 'leaves', anchorPath.leafKey]);

  const focusPath = DraftOffsetKey.decode(focusKey);
  const focusBlockKey = focusPath.blockKey;
  const focusLeaf = editorState
    .getBlockTree(focusBlockKey)
    .getIn([focusPath.decoratorKey, 'leaves', focusPath.leafKey]);

  if (!anchorLeaf || !focusLeaf) {
    // If we cannot make sense of the updated selection state, stick to the current one.
    if (window['__DEV__']) {
      /* eslint-disable-next-line */
      console.warn('Invalid selection state.', arguments, editorState.toJS());
    }
    return selection;
  }

  const anchorLeafStart: number = anchorLeaf.get('start');
  const focusLeafStart: number = focusLeaf.get('start');

  const anchorBlockOffset = anchorLeaf ? anchorLeafStart + anchorOffset : null;
  const focusBlockOffset = focusLeaf ? focusLeafStart + focusOffset : null;

  const areEqual =
    selection.getAnchorKey() === anchorBlockKey &&
    selection.getAnchorOffset() === anchorBlockOffset &&
    selection.getFocusKey() === focusBlockKey &&
    selection.getFocusOffset() === focusBlockOffset;

  if (areEqual) {
    return selection;
  }

  let isBackward = false;
  if (anchorBlockKey === focusBlockKey) {
    const anchorLeafEnd: number = anchorLeaf.get('end');
    const focusLeafEnd: number = focusLeaf.get('end');
    if (focusLeafStart === anchorLeafStart && focusLeafEnd === anchorLeafEnd) {
      isBackward = focusOffset < anchorOffset;
    } else {
      isBackward = focusLeafStart < anchorLeafStart;
    }
  } else {
    const startKey = editorState
      .getCurrentContent()
      .getBlockMap()
      .keySeq()
      .skipUntil(v => v === anchorBlockKey || v === focusBlockKey)
      .first();
    isBackward = startKey === focusBlockKey;
  }

  return selection.merge({
    anchorKey: anchorBlockKey,
    anchorOffset: anchorBlockOffset,
    focusKey: focusBlockKey,
    focusOffset: focusBlockOffset,
    isBackward,
  }) as any;
}

export default  getUpdatedSelectionState;
