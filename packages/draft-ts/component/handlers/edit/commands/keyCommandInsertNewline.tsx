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

import DraftModifier from '../../../../model/modifier/DraftModifier';
import EditorState from '../../../../model/immutable/EditorState';

function keyCommandInsertNewline(editorState: EditorState): EditorState {
  const contentState = DraftModifier.splitBlock(
    editorState.getCurrentContent(),
    editorState.getSelection(),
  );
  return EditorState.push(editorState, contentState, 'split-block');
}

export default  keyCommandInsertNewline;
