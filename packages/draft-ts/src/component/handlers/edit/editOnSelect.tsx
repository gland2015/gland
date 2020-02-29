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

import  DraftEditor from '../../base/DraftEditor.react';

import DraftJsDebugLogging from '../../../stubs/DraftJsDebugLogging';
import EditorState from '../../../model/immutable/EditorState';


import getContentEditableContainer from '../../utils/getContentEditableContainer';
import getDraftEditorSelection from '../../selection/getDraftEditorSelection';
// @ts-ignore
function editOnSelect(editor: DraftEditor, event): void {
  if (
    editor._blockSelectEvents ||
    editor._latestEditorState !== editor.props.editorState
  ) {
    if (editor._blockSelectEvents) {
      const editorState = editor.props.editorState;
      const selectionState = editorState.getSelection();
      DraftJsDebugLogging.logBlockedSelectionEvent({
        // For now I don't think we need any other info
        anonymizedDom: 'N/A',
        extraParams: JSON.stringify({stacktrace: new Error().stack}),
        selectionState: JSON.stringify(selectionState.toJS()),
      });
    }
    return;
  }

  let editorState = editor.props.editorState;
  const documentSelection = getDraftEditorSelection(
    editorState,
    getContentEditableContainer(editor),
  );
  const updatedSelectionState = documentSelection.selectionState;

    event.persist()
  //  console.log('selectionState', editorState.getSelection().toJS(), event)

  if (updatedSelectionState !== editorState.getSelection()) {
    if (documentSelection.needsRecovery) {
      editorState = EditorState.forceSelection(
        editorState,
        updatedSelectionState,
      );
    } else {
      editorState = EditorState.acceptSelection(
        editorState,
        updatedSelectionState,
      );
    }
 
    editor.update(editorState);
  }
}

export default  editOnSelect;
