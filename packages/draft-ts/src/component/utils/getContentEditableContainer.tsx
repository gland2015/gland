/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 * @emails oncall+draft_js
 */

'use strict';

import  DraftEditor from '../base/DraftEditor.react';

import ReactDOM from 'react-dom'

import invariant from 'fbjs/lib/invariant';
import isHTMLElement from './isHTMLElement';

function getContentEditableContainer(editor: DraftEditor): HTMLElement {
  const editorNode = ReactDOM.findDOMNode(editor.editorContainer);
  invariant(editorNode, 'Missing editorNode');
  invariant(
    isHTMLElement(editorNode.firstChild),
    'editorNode.firstChild is not an HTMLElement',
  );
  const htmlElement = (editorNode.firstChild as any);
  return htmlElement;
}

export default  getContentEditableContainer;
