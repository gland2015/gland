/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict
 * @emails oncall+draft_js
 */

'use strict';
import React, { KeyboardEvent } from 'react'

import UserAgent from 'fbjs/lib/UserAgent'

import isSoftNewlineEvent from './isSoftNewlineEvent';

const isOSX = UserAgent.isPlatform('Mac OS X');

const KeyBindingUtil = {
  /**
   * Check whether the ctrlKey modifier is *not* being used in conjunction with
   * the altKey modifier. If they are combined, the result is an `altGraph`
   * key modifier, which should not be handled by this set of key bindings.
   */
  isCtrlKeyCommand: function(e: KeyboardEvent): boolean {
    return !!e.ctrlKey && !e.altKey;
  },

  isOptionKeyCommand: function(e: KeyboardEvent): boolean {
    return isOSX && e.altKey;
  },

  usesMacOSHeuristics: function(): boolean {
    return isOSX;
  },

  hasCommandModifier: function(e: KeyboardEvent): boolean {
    return isOSX
      ? !!e.metaKey && !e.altKey
      : KeyBindingUtil.isCtrlKeyCommand(e);
  },

  isSoftNewlineEvent,
};

export default  KeyBindingUtil;
