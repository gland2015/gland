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

import  {BlockMap} from '../../../model/immutable/BlockMap';
import EditorState from '../../../model/immutable/EditorState';

import getContentStateFragment from '../../../model/transaction/getContentStateFragment';

function getFragmentFromSelection(editorState: EditorState): BlockMap {
  const selectionState = editorState.getSelection();

  if (selectionState.isCollapsed()) {
    return null;
  }

  return getContentStateFragment(
    editorState.getCurrentContent(),
    selectionState,
  );
}

export default  getFragmentFromSelection;
