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
import { SyntheticEvent } from 'react'
import  {BlockNodeRecord} from '../../model/immutable/BlockNodeRecord';
import  {DraftBlockRenderMap} from '../../model/immutable/DraftBlockRenderMap';
import  {DraftDragType} from '../../model/constants/DraftDragType';
import  DraftEditor from './DraftEditor.react';
import  {DraftEditorCommand} from '../../model/constants/DraftEditorCommand';
import  {DraftHandleValue} from '../../model/constants/DraftHandleValue';
import  {DraftInlineStyle} from '../../model/immutable/DraftInlineStyle';
import  {DraftTextAlignment} from './DraftTextAlignment';
import  EditorState from '../../model/immutable/EditorState';
import  SelectionState from '../../model/immutable/SelectionState';
import  {BidiDirection} from 'fbjs/lib/UnicodeBidiDirection';

export type DraftEditorProps = {
  /**
   * The two most critical props are `editorState` and `onChange`.
   *
   * The `editorState` prop defines the entire state of the editor, while the
   * `onChange` prop is the method in which all state changes are propagated
   * upward to higher-level components.
   *
   * These props are analogous to `value` and `onChange` in controlled React
   * text inputs.
   */
  editorState: EditorState,
  onChange: (editorState: EditorState) => void,

  // specify editorKey when rendering serverside. If you do not set this prop
  // react will complain that there is a server/client mismatch because Draft
  // will generate a random editorKey when rendering in each context. The key
  // is used to figure out if content is being pasted within a draft block to
  // better apply formatting and styles.  If two editors share the same key &
  // `stripPastedStyles` is false, draft will assume both editors share their
  // styling and formatting when re-applying styles.
  editorKey?: string,

  placeholder?: string,

  // Specify whether text alignment should be forced in a direction
  // regardless of input characters.
  textAlignment?: DraftTextAlignment,

  // Specify whether text directionality should be forced in a direction
  // regardless of input characters.
  textDirectionality?: BidiDirection,

  // For a given `ContentBlock` object, return an object that specifies
  // a custom block component and/or props. If no object is returned,
  // the default `DraftEditorBlock` is used.
  blockRendererFn: (block: BlockNodeRecord) => Object,

  // Function that returns a cx map corresponding to block-level styles.
  blockStyleFn: (block: BlockNodeRecord) => string,

  // A function that accepts a synthetic key event and returns
  // the matching DraftEditorCommand constant, or a custom string,
  // or null if no command should be invoked.
  keyBindingFn: (e: KeyboardEvent) => string,

  // Set whether the `DraftEditor` component should be editable. Useful for
  // temporarily disabling edit behavior or allowing `DraftEditor` rendering
  // to be used for consumption purposes.
  readOnly: boolean,

  // Note: spellcheck is always disabled for IE. If enabled in Safari, OSX
  // autocorrect is enabled as well.
  spellCheck: boolean,

  // Set whether to remove all style information from pasted content. If your
  // use case should not have any block or inline styles, it is recommended
  // that you set this to `true`.
  stripPastedStyles: boolean,

  tabIndex?: number,

  // exposed especially to help improve mobile web behaviors
  autoCapitalize?: string,
  autoComplete?: string,
  autoCorrect?: string,

  ariaActiveDescendantID?: string,
  ariaAutoComplete?: string,
  ariaControls?: string,
  ariaDescribedBy?: string,
  ariaExpanded?: boolean,
  ariaLabel?: string,
  ariaLabelledBy?: string,
  ariaMultiline?: boolean,
  ariaOwneeID?: string,

  webDriverTestID?: string,

  /**
   * Cancelable event handlers, handled from the top level down. A handler
   * that returns `handled` will be the last handler to execute for that event.
   */

  // Useful for managing special behavior for pressing the `Return` key. E.g.
  // removing the style from an empty list item.
  handleReturn?: (
    e: KeyboardEvent,
    editorState: EditorState,
  ) => DraftHandleValue,

  // Map a key command string provided by your key binding function to a
  // specified behavior.
  handleKeyCommand?: (
    command: DraftEditorCommand | string,
    editorState: EditorState,
    eventTimeStamp: number,
  ) => DraftHandleValue,

  // Handle intended text insertion before the insertion occurs. This may be
  // useful in cases where the user has entered characters that you would like
  // to trigger some special behavior. E.g. immediately converting `:)` to an
  // emoji Unicode character, or replacing ASCII quote characters with smart
  // quotes.
  handleBeforeInput?: (
    chars: string,
    editorState: EditorState,
    eventTimeStamp: number,
  ) => DraftHandleValue,

  handlePastedText?: (
    text: string,
    html?: string,
    editorState?: EditorState,
  ) => DraftHandleValue,

  handlePastedFiles?: (files: Array<Blob>) => DraftHandleValue,

  // Handle dropped files
  handleDroppedFiles?: (
    selection: SelectionState,
    files: Array<Blob>,
  ) => DraftHandleValue,

  // Handle other drops to prevent default text movement/insertion behaviour
  handleDrop?: (
    selection: SelectionState,
    dataTransfer: Object,
    isInternal: DraftDragType,
  ) => DraftHandleValue,

  /**
   * Deprecated event triggers.
   */
  onEscape?: (e: KeyboardEvent) => void,
  onTab?: (e: KeyboardEvent) => void,
  onUpArrow?: (e: KeyboardEvent) => void,
  onRightArrow?: (e: KeyboardEvent) => void,
  onDownArrow?: (e: KeyboardEvent) => void,
  onLeftArrow?: (e: KeyboardEvent) => void,

  onBlur?: (e: SyntheticEvent) => void,
  onFocus?: (e: SyntheticEvent) => void,

  // Provide a map of inline style names corresponding to CSS style objects
  // that will be rendered for matching ranges.
  customStyleMap?: Object,

  // Provide a function that will construct CSS style objects given inline
  // style names.
  customStyleFn?: (style: DraftInlineStyle, block: BlockNodeRecord) => Object,

  // Provide a map of block rendering configurations. Each block type maps to
  // an element tag and an optional react element wrapper. This configuration
  // is used for both rendering and paste processing.
  blockRenderMap: DraftBlockRenderMap,

  // When the Editor loses focus (blurs) text selections are cleared
  // by default to mimic <textarea> behaviour, however in some situations
  // users may wish to preserve native behaviour.
  preserveSelectionOnBlur?: boolean,

  // Overrides for cut, copy & paste, which can be used to implement custom
  // behavior like entity cut/copy/paste (see PR #1784)."
  onPaste?: (DraftEditor, SyntheticClipboardEvent) => (void | Promise<void>),
  onCut?: (DraftEditor, SyntheticClipboardEvent) => void,
  onCopy?: (DraftEditor, SyntheticClipboardEvent) => void,
};

export type DraftEditorDefaultProps = {
  blockRenderMap: DraftBlockRenderMap,
  blockRendererFn: (block: BlockNodeRecord) => Object,
  blockStyleFn: (block: BlockNodeRecord) => string,
  keyBindingFn: (e: KeyboardEvent) => string,
  readOnly: boolean,
  spellCheck: boolean,
  stripPastedStyles: boolean,
};
