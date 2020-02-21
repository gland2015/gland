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
import React, { KeyboardEvent} from 'react'
import EditorState from '../../../../model/immutable/EditorState';

import expandRangeToStartOfLine from '../../../selection/expandRangeToStartOfLine';
import getDraftEditorSelectionWithNodes from '../../../selection/getDraftEditorSelectionWithNodes';
import moveSelectionBackward from './moveSelectionBackward';
import removeTextWithStrategy from './removeTextWithStrategy';

function keyCommandBackspaceToStartOfLine(
  editorState: EditorState,
  e: KeyboardEvent<HTMLElement>,
): EditorState {
  const afterRemoval = removeTextWithStrategy(
    editorState,
    strategyState => {
      const selection = strategyState.getSelection();
      if (selection.isCollapsed() && selection.getAnchorOffset() === 0) {
        return moveSelectionBackward(strategyState, 1);
      }
      const {ownerDocument} = e.currentTarget;
      const domSelection = ownerDocument.defaultView.getSelection();
      let range = domSelection.getRangeAt(0);
      range = expandRangeToStartOfLine(range);

      return getDraftEditorSelectionWithNodes(
        strategyState,
        null,
        range.endContainer,
        range.endOffset,
        range.startContainer,
        range.startOffset,
      ).selectionState;
    },
    'backward',
  );

  if (afterRemoval === editorState.getCurrentContent()) {
    return editorState;
  }

  return EditorState.push(editorState, afterRemoval, 'remove-range');
}

export default  keyCommandBackspaceToStartOfLine;
