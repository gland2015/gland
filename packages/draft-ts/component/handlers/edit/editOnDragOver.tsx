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

/**
 * Drag behavior has begun from outside the editor element.
 */
function editOnDragOver(editor: DraftEditor, e: any): void {
  editor.setMode('drag');
  e.preventDefault();
}

export default  editOnDragOver;
