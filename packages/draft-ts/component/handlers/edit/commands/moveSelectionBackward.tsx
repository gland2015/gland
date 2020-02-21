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
 * Given a collapsed selection, move the focus `maxDistance` backward within
 * the selected block. If the selection will go beyond the start of the block,
 * move focus to the end of the previous block, but no further.
 *
 * This function is not Unicode-aware, so surrogate pairs will be treated
 * as having length 2.
 */
function moveSelectionBackward(
  editorState: EditorState,
  maxDistance: number,
): SelectionState {
  const selection = editorState.getSelection();
  // Should eventually make this an invariant
  warning(
    selection.isCollapsed(),
    'moveSelectionBackward should only be called with a collapsed SelectionState',
  );
  const content = editorState.getCurrentContent();
  const key = selection.getStartKey();
  const offset = selection.getStartOffset();

  let focusKey = key;
  let focusOffset = 0;

  if (maxDistance > offset) {
    const keyBefore = content.getKeyBefore(key);
    if (keyBefore == null) {
      focusKey = key;
    } else {
      focusKey = keyBefore;
      const blockBefore = content.getBlockForKey(keyBefore);
      focusOffset = blockBefore.getText().length;
    }
  } else {
    focusOffset = offset - maxDistance;
  }

  return selection.merge({
    focusKey,
    focusOffset,
    isBackward: true,
  }) as any;
}

export default  moveSelectionBackward;
