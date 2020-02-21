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

import  EditorState from '../../../../model/immutable/EditorState';
import  SelectionState from '../../../../model/immutable/SelectionState';

import warning from 'fbjs/lib/warning';

/**
 * Given a collapsed selection, move the focus `maxDistance` forward within
 * the selected block. If the selection will go beyond the end of the block,
 * move focus to the start of the next block, but no further.
 *
 * This function is not Unicode-aware, so surrogate pairs will be treated
 * as having length 2.
 */
function moveSelectionForward(
  editorState: EditorState,
  maxDistance: number,
): SelectionState {
  const selection = editorState.getSelection();
  // Should eventually make this an invariant
  warning(
    selection.isCollapsed(),
    'moveSelectionForward should only be called with a collapsed SelectionState',
  );
  const key = selection.getStartKey();
  const offset = selection.getStartOffset();
  const content = editorState.getCurrentContent();

  let focusKey = key;
  let focusOffset;

  const block = content.getBlockForKey(key);

  if (maxDistance > block.getText().length - offset) {
    focusKey = content.getKeyAfter(key);
    focusOffset = 0;
  } else {
    focusOffset = offset + maxDistance;
  }

  return selection.merge({focusKey, focusOffset}) as any;
}

export default  moveSelectionForward;
