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

import  ContentState from './ContentState';
import {DraftDecoratorType} from '../decorators/DraftDecoratorType';
import  SelectionState from './SelectionState';

export type EditorStateCreationConfig = {
  allowUndo: boolean,
  currentContent: ContentState,
  decorator: DraftDecoratorType,
  selection: SelectionState,
};
