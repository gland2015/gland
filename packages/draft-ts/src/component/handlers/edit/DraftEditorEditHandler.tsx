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

import UserAgent from 'fbjs/lib/UserAgent'

import onBeforeInput from './editOnBeforeInput';
import onBlur from './editOnBlur';
import onCompositionStart from './editOnCompositionStart';
import onCopy from './editOnCopy';
import onCut from './editOnCut';
import onDragOver from './editOnDragOver';
import onDragStart from './editOnDragStart';
import onFocus from './editOnFocus';
import onInput from './editOnInput';
import onKeyDown from './editOnKeyDown';
import onPaste from './editOnPaste';
import onSelect from './editOnSelect';

const isChrome = UserAgent.isBrowser('Chrome');

// gland 火狐有时也需要，在插入链接之后，可能不会提交onSelect事件
const selectionHandler: (e: DraftEditor, event?) => void = isChrome
  ? onSelect:onSelect
 // : e => {};

const DraftEditorEditHandler = {
  onBeforeInput,
  onBlur,
  onCompositionStart,
  onCopy,
  onCut,
  onDragOver,
  onDragStart,
  onFocus,
  onInput,
  onKeyDown,
  onPaste,
  onSelect,
  // In certain cases, contenteditable on chrome does not fire the onSelect
  // event, causing problems with cursor positioning. Therefore, the selection
  // state update handler is added to more events to ensure that the selection
  // state is always synced with the actual cursor positions.
  onMouseUp: selectionHandler,
  onKeyUp: selectionHandler,
};

export default  DraftEditorEditHandler;
