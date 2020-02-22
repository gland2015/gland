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

import EditorState from '../../../../model/immutable/EditorState';
import UnicodeUtils from 'fbjs/lib/UnicodeUtils';

import moveSelectionBackward from './moveSelectionBackward';
import removeTextWithStrategy from './removeTextWithStrategy';

/**
 * Remove the selected range. If the cursor is collapsed, remove the preceding
 * character. This operation is Unicode-aware, so removing a single character
 * will remove a surrogate pair properly as well.
 */
function keyCommandPlainBackspace(editorState: EditorState): EditorState {
  const afterRemoval = removeTextWithStrategy(
    editorState,
    strategyState => {
      const selection = strategyState.getSelection();
      const content = strategyState.getCurrentContent();
      const key = selection.getAnchorKey();
      const offset = selection.getAnchorOffset();
      const charBehind = content.getBlockForKey(key).getText()[offset - 1];
      return moveSelectionBackward(
        strategyState,
        charBehind ? UnicodeUtils.getUTF16Length(charBehind, 0) : 1,
      );
    },
    'backward',
  );

  if (afterRemoval === editorState.getCurrentContent()) {
    return editorState;
  }

  const selection = editorState.getSelection();
  return EditorState.push(
    editorState,
    afterRemoval.set('selectionBefore', selection) as any,
    selection.isCollapsed() ? 'backspace-character' : 'remove-range',
  );
}

export default  keyCommandPlainBackspace;
