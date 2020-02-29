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

import  {DOMDerivedSelection} from './DOMDerivedSelection';
import  EditorState from '../../model/immutable/EditorState';

import getDraftEditorSelectionWithNodes from './getDraftEditorSelectionWithNodes';

/**
 * Convert the current selection range to an anchor/focus pair of offset keys
 * and values that can be interpreted by components.
 */
function getDraftEditorSelection(
  editorState: EditorState,
  root: HTMLElement,
): DOMDerivedSelection {
  const selection = root.ownerDocument.defaultView.getSelection();
  // console.log('selection', selection)
  // No active selection.
  if (selection.rangeCount === 0) {
    return {
      selectionState: editorState.getSelection().set('hasFocus', false) as any,
      needsRecovery: false,
    };
  }
  return getDraftEditorSelectionWithNodes(
    editorState,
    root,
    selection.anchorNode,
    selection.anchorOffset,
    selection.focusNode,
    selection.focusOffset,
  );
}

export default  getDraftEditorSelection;
