/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 * @preventMunge
 * @emails oncall+draft_js
 */

'use strict';

import  {BlockMap} from '../../model/immutable/BlockMap';
import  {DraftEditorModes} from '../handlers/DraftEditorModes';
import  {DraftEditorDefaultProps, DraftEditorProps} from './DraftEditorProps';
import  {DraftScrollPosition} from './DraftScrollPosition';

import DefaultDraftBlockRenderMap  from '../../model/immutable/DefaultDraftBlockRenderMap';
import DefaultDraftInlineStyle from '../../model/immutable/DefaultDraftInlineStyle';
import DraftEditorCompositionHandler from '../handlers/composition/DraftEditorCompositionHandler';
import DraftEditorContents from '../../stubs/DraftEditorContents.react';
import DraftEditorDragHandler from '../handlers/drag/DraftEditorDragHandler';
import DraftEditorEditHandler from '../handlers/edit/DraftEditorEditHandler';
import DraftEditorPlaceholder from './DraftEditorPlaceholder.react';
import DraftEffects from '../../stubs/DraftEffects';
import EditorState from '../../model/immutable/EditorState';
import React, {ReactNode} from 'react'
import ReactDOM from 'react-dom'
import Scroll from 'fbjs/lib/Scroll';
import Style from 'fbjs/lib/Style';
import UserAgent from 'fbjs/lib/UserAgent'

import cx from 'fbjs/lib/cx'
import generateRandomKey from '../../model/keys/generateRandomKey';
import getDefaultKeyBinding from '../utils/getDefaultKeyBinding';
import getScrollPosition from 'fbjs/lib/getScrollPosition';
import gkx from '../../stubs/gkx';
import invariant from 'fbjs/lib/invariant';
import isHTMLElement from '../utils/isHTMLElement';
import nullthrows from 'fbjs/lib/nullthrows';

const isIE = UserAgent.isBrowser('IE');

// IE does not support the `input` event on contentEditable, so we can't
// observe spellcheck behavior.
const allowSpellCheck = !isIE;

// Define a set of handler objects to correspond to each possible `mode`
// of editor behavior.
const handlerMap = {
  edit: DraftEditorEditHandler,
  composite: DraftEditorCompositionHandler,
  drag: DraftEditorDragHandler,
  cut: null,
  render: null,
};

type State = {
  contentsKey: number,
};

let didInitODS = false;

class UpdateDraftEditorFlags extends React.Component<{
  editor: DraftEditor,
  editorState: EditorState,
}> {
  render(): ReactNode {
    return null;
  }
  componentDidMount(): void {
    this._update();
  }
  componentDidUpdate(): void {
    this._update();
  }
  _update() {
    const editor = this.props.editor;
    /**
     * Sometimes a render triggers a 'focus' or other event, and that will
     * schedule a second render pass.
     * In order to make sure the second render pass gets the latest editor
     * state, we updat e it here.
     * Example:
     * render #1
     * +
     * |
     * | cWU -> Nothing ... latestEditorState = STALE_STATE :(
     * |
     * | render -> this.props.editorState = FRESH_STATE
     * | +         *and* set latestEditorState = FRESH_STATE
     *   |
     * | |
     * | +--> triggers 'focus' event, calling 'handleFocus' with latestEditorState
     * |                                                +
     * |                                                |
     * +>cdU -> latestEditorState = FRESH_STATE         | the 'handleFocus' call schedules render #2
     *                                                  | with latestEditorState, which is FRESH_STATE
     *                                                  |
     * render #2 <--------------------------------------+
     * +
     * |
     * | cwU -> nothing updates
     * |
     * | render -> this.props.editorState = FRESH_STATE which was passed in above
     * |
     * +>cdU fires and resets latestEditorState = FRESH_STATE
     * ---
     * Note that if we don't set latestEditorState in 'render' in the above
     * diagram, then STALE_STATE gets passed to render #2.
     */
    editor._latestEditorState = this.props.editorState;

    /**
     * The reason we set this 'blockSelectEvents' flag is that  IE will fire a
     * 'selectionChange' event when we programmatically change the selection,
     * meaning it would trigger a new select event while we are in the middle
     * of updating.
     * We found that the 'selection.addRange' was what triggered the stray
     * selectionchange event in IE.
     * To be clear - we have not been able to reproduce specific bugs related
     * to this stray selection event, but have recorded logs that some
     * conditions do cause it to get bumped into during editOnSelect.
     */
    editor._blockSelectEvents = true;
  }
}

/**
 * `DraftEditor` is the root editor component. It composes a `contentEditable`
 * div, and provides a wide variety of useful function props for managing the
 * state of the editor. See `DraftEditorProps` for details.
 */
class DraftEditor extends React.Component<DraftEditorProps, State> {
  static defaultProps: DraftEditorDefaultProps = {
    blockRenderMap: DefaultDraftBlockRenderMap,
    blockRendererFn: function() {
      return null;
    },
    blockStyleFn: function() {
      return '';
    },
    keyBindingFn: getDefaultKeyBinding as any,
    readOnly: false,
    spellCheck: false,
    stripPastedStyles: false,
  };

  _blockSelectEvents: boolean;
  _clipboard: BlockMap;
  _handler: Object;
  _dragCount: number;
  _internalDrag: boolean;
  _editorKey: string;
  _placeholderAccessibilityID: string;
  _latestEditorState: EditorState;
  _latestCommittedEditorState: EditorState;
  _pendingStateFromBeforeInput: void | EditorState;

  /**
   * Define proxies that can route events to the current handler.
   */
  _onBeforeInput: Function;
  _onBlur: Function;
  _onCharacterData: Function;
  _onCompositionEnd: Function;
  _onCompositionStart: Function;
  _onCopy: Function;
  _onCut: Function;
  _onDragEnd: Function;
  _onDragOver: Function;
  _onDragStart: Function;
  _onDrop: Function;
  _onInput: Function;
  _onFocus: Function;
  _onKeyDown: Function;
  _onKeyPress: Function;
  _onKeyUp: Function;
  _onMouseDown: Function;
  _onMouseUp: Function;
  _onPaste: Function;
  _onSelect: Function;

  editor: HTMLElement;
  editorContainer: HTMLElement;
 // focus: () => void;
 // blur: () => void;
  //setMode: (mode: DraftEditorModes) => void;
  // exitCurrentMode: () => void;
  // restoreEditorDOM: (scrollPosition?: DraftScrollPosition) => void;
  // setClipboard: (clipboard: ?BlockMap) => void;
  // getClipboard: () => ?BlockMap;
   getEditorKey: () => string;
  // updat e: (editorState: EditorState) => void;
  // onDragEnter: () => void;
  // onDragLeave: () => void;

  constructor(props: DraftEditorProps) {
    super(props);

    this._blockSelectEvents = false;
    this._clipboard = null;
    this._handler = null;
    this._dragCount = 0;
    this._editorKey = props.editorKey || generateRandomKey();
    this._placeholderAccessibilityID = 'placeholder-' + this._editorKey;
    this._latestEditorState = props.editorState;
    this._latestCommittedEditorState = props.editorState;

    this._onBeforeInput = this._buildHandler('onBeforeInput');
    this._onBlur = this._buildHandler('onBlur');
    this._onCharacterData = this._buildHandler('onCharacterData');
    this._onCompositionEnd = this._buildHandler('onCompositionEnd');
    this._onCompositionStart = this._buildHandler('onCompositionStart');
    this._onCopy = this._buildHandler('onCopy');
    this._onCut = this._buildHandler('onCut');
    this._onDragEnd = this._buildHandler('onDragEnd');
    this._onDragOver = this._buildHandler('onDragOver');
    this._onDragStart = this._buildHandler('onDragStart');
    this._onDrop = this._buildHandler('onDrop');
    this._onInput = this._buildHandler('onInput');
    this._onFocus = this._buildHandler('onFocus');
    this._onKeyDown = this._buildHandler('onKeyDown');
    this._onKeyPress = this._buildHandler('onKeyPress');
    this._onKeyUp = this._buildHandler('onKeyUp');
    this._onMouseDown = this._buildHandler('onMouseDown');
    this._onMouseUp = this._buildHandler('onMouseUp');
    this._onPaste = this._buildHandler('onPaste');
    this._onSelect = this._buildHandler('onSelect');

    this.getEditorKey = () => this._editorKey;

    if (window['__DEV__']) {
      [
        'onDownArrow',
        'onEscape',
        'onLeftArrow',
        'onRightArrow',
        'onTab',
        'onUpArrow',
      ].forEach(propName => {
        if (props.hasOwnProperty(propName)) {
          // eslint-disable-next-line no-console
          console.warn(
            `Supplying an \`${propName}\` prop to \`DraftEditor\` has ` +
              'been deprecated. If your handler needs access to the keyboard ' +
              'event, supply a custom `keyBindingFn` prop that falls back to ' +
              'the default one (eg. https://is.gd/RG31RJ).',
          );
        }
      });
    }

    // See `restoreEditorDOM()`.
    this.state = {contentsKey: 0};
  }

  /**
   * Build a method that will pass the event to the specified handler method.
   * This allows us to look up the correct handler function for the current
   * editor mode, if any has been specified.
   */
  _buildHandler(eventName: string): Function {
    const flushControlled: (fn: Function) => void =
      /* $FlowFixMe(>=0.79.1 site=www) This comment suppresses an error found
       * when Flow v0.79 was deployed. To see the error delete this comment and
       * run Flow. */
      // @ts-ignore
      ReactDOM.unstable_flushControlled;
    // Wrap event handlers in `flushControlled`. In sync mode, this is
    // effectively a no-op. In async mode, this ensures all updates scheduled
    // inside the handler are flushed before React yields to the browser.
    return e => {
      if (!this.props.readOnly) {
        const method = this._handler && this._handler[eventName];
        if (method) {
          if (flushControlled) {
            flushControlled(() => method(this, e));
          } else {
            method(this, e);
          }
        }
      }
    };
  }

  _showPlaceholder(): boolean {
    return (
      !!this.props.placeholder &&
      !this.props.editorState.isInCompositionMode() &&
      !this.props.editorState.getCurrentContent().hasText()
    );
  }

  _renderPlaceholder(): ReactNode {
    if (this._showPlaceholder()) {
      const placeHolderProps = {
        text: nullthrows(this.props.placeholder),
        editorState: this.props.editorState,
        textAlignment: this.props.textAlignment,
        accessibilityID: this._placeholderAccessibilityID,
      };

      /* $FlowFixMe(>=0.112.0 site=mobile) This comment suppresses an error
       * found when Flow v0.112 was deployed. To see the error delete this
       * comment and run Flow. */
      /* $FlowFixMe(>=0.112.0 site=www) This comment suppresses an error found
       * when Flow v0.112 was deployed. To see the error delete this comment
       * and run Flow. */
      /* $FlowFixMe(>=0.112.0 site=www,mobile) This comment suppresses an error
       * found when Flow v0.112 was deployed. To see the error delete this
       * comment and run Flow. */
      // @ts-ignore
      return <DraftEditorPlaceholder {...placeHolderProps} />;
    }
    return null;
  }

  render(): ReactNode {
    const {
      blockRenderMap,
      blockRendererFn,
      blockStyleFn,
      customStyleFn,
      customStyleMap,
      editorState,
      readOnly,
      textAlignment,
      textDirectionality,
    } = this.props;

    const rootClass = cx({
      'DraftEditor/root': true,
      'DraftEditor/alignLeft': textAlignment === 'left',
      'DraftEditor/alignRight': textAlignment === 'right',
      'DraftEditor/alignCenter': textAlignment === 'center',
    });

    const contentStyle = {
      outline: 'none',
      // fix parent-draggable Safari bug. #1326
      userSelect: 'text',
      WebkitUserSelect: 'text',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
    };

    // The aria-expanded and aria-haspopup properties should only be rendered
    // for a combobox.
    /* $FlowFixMe(>=0.68.0 site=www,mobile) This comment suppresses an error
     * found when Flow v0.68 was deployed. To see the error delete this comment
     * and run Flow. */
    const ariaRole = (this.props as any).role || 'textbox';
    const ariaExpanded =
      ariaRole === 'combobox' ? !!this.props.ariaExpanded : null;

    const editorContentsProps = {
      blockRenderMap,
      blockRendererFn,
      blockStyleFn,
      customStyleMap: {
        ...DefaultDraftInlineStyle,
        ...customStyleMap,
      },
      customStyleFn,
      editorKey: this._editorKey,
      editorState,
      textDirectionality,
    };

    return (
      <div className={rootClass}>
        {this._renderPlaceholder()}
        <div
          className={cx('DraftEditor/editorContainer')}
          ref={ref => (this.editorContainer = ref)}>
          {
            // @ts-ignore
            <div
            aria-activedescendant={
              readOnly ? null : this.props.ariaActiveDescendantID
            }
            aria-autocomplete={(readOnly ? null : this.props.ariaAutoComplete) as any}
            aria-controls={readOnly ? null : this.props.ariaControls}
            aria-describedby={
              this.props.ariaDescribedBy || this._placeholderAccessibilityID
            }
            aria-expanded={readOnly ? null : ariaExpanded}
            aria-label={this.props.ariaLabel}
            aria-labelledby={this.props.ariaLabelledBy}
            aria-multiline={this.props.ariaMultiline}
            aria-owns={readOnly ? null : this.props.ariaOwneeID}
            autoCapitalize={this.props.autoCapitalize}
            autoComplete={this.props.autoComplete}
            autoCorrect={this.props.autoCorrect}
            className={cx({
              // Chrome's built-in translation feature mutates the DOM in ways
              // that Draft doesn't expect (ex: adding <font> tags inside
              // DraftEditorLeaf spans) and causes problems. We add notranslate
              // here which makes its autotranslation skip over this subtree.
              notranslate: !readOnly,
              'public/DraftEditor/content': true,
            })}
            contentEditable={!readOnly}
            data-testid={this.props.webDriverTestID}
            onBeforeInput={this._onBeforeInput as any}
            onBlur={this._onBlur as any}
            onCompositionEnd={this._onCompositionEnd as any}
            onCompositionStart={this._onCompositionStart as any}
            onCopy={this._onCopy as any}
            onCut={this._onCut as any}
            onDragEnd={this._onDragEnd as any}
            onDragEnter={this.onDragEnter}
            onDragLeave={this.onDragLeave}
            onDragOver={this._onDragOver as any}
            onDragStart={this._onDragStart as any}
            onDrop={this._onDrop as any}
            onFocus={this._onFocus as any}
            onInput={this._onInput as any}
            onKeyDown={this._onKeyDown as any}
            onKeyPress={this._onKeyPress as any}
            onKeyUp={this._onKeyUp as any}
            onMouseUp={this._onMouseUp as any}
            onPaste={this._onPaste as any}
            onSelect={this._onSelect as any}
            ref={ref => (this.editor = ref)}
            role={readOnly ? null : ariaRole}
            spellCheck={allowSpellCheck && this.props.spellCheck}
            style={contentStyle as any}
            suppressContentEditableWarning
            tabIndex={this.props.tabIndex}>
            {/*
              Needs to come earlier in the tree as a sibling (not ancestor) of
              all DraftEditorLeaf nodes so it's first in postorder traversal.
            */}
              <UpdateDraftEditorFlags editor={this} editorState={editorState} />
            <DraftEditorContents
              {...editorContentsProps}
              key={'contents' + this.state.contentsKey}
            />
          </div>
          }
        </div>
      </div>
    );
  }

  componentDidMount(): void {
    this._blockSelectEvents = false;
    if (!didInitODS && gkx('draft_ods_enabled')) {
      didInitODS = true;
      DraftEffects.initODS();
    }
    this.setMode('edit');

    /**
     * IE has a hardcoded "feature" that attempts to convert link text into
     * anchors in contentEditable DOM. This breaks the editor's expectations of
     * the DOM, and control is lost. Disable it to make IE behave.
     * See: http://blogs.msdn.com/b/ieinternals/archive/2010/09/15/
     * ie9-beta-minor-change-list.aspx
     */
    if (isIE) {
      // editor can be null after mounting
      // https://stackoverflow.com/questions/44074747/componentdidmount-called-before-ref-callback
      if (!this.editor) {
        global['execCommand']('AutoUrlDetect', false, false);
      } else {
        this.editor.ownerDocument['execCommand']('AutoUrlDetect', false, false as any);
      }
    }
  }

  componentDidUpdate(): void {
    this._blockSelectEvents = false;
    this._latestEditorState = this.props.editorState;
    this._latestCommittedEditorState = this.props.editorState;
  }

  /**
   * Used via `this.focus()`.
   *
   * Force focus back onto the editor node.
   *
   * We attempt to preserve scroll position when focusing. You can also pass
   * a specified scroll position (for cases like `cut` behavior where it should
   * be restored to a known position).
   */
  focus: (scrollPosition?: DraftScrollPosition) => void = (
    scrollPosition?: DraftScrollPosition,
  ): void => {
    const {editorState} = this.props;
    const alreadyHasFocus = editorState.getSelection().getHasFocus();
    const editorNode = this.editor;

    if (!editorNode) {
      // once in a while people call 'focus' in a setTimeout, and the node has
      // been deleted, so it can be null in that case.
      return;
    }

    const scrollParent = Style.getScrollParent(editorNode);
    const {x, y} = scrollPosition || getScrollPosition(scrollParent);

    invariant(isHTMLElement(editorNode), 'editorNode is not an HTMLElement');

    editorNode.focus();

    // Restore scroll position
    if (scrollParent === window) {
      window.scrollTo(x, y);
    } else {
      Scroll.setTop(scrollParent, y);
    }

    // On Chrome and Safari, calling focus on contenteditable focuses the
    // cursor at the first character. This is something you don't expect when
    // you're clicking on an input element but not directly on a character.
    // Put the cursor back where it was before the blur.
    if (!alreadyHasFocus) {
      this.update(
        EditorState.forceSelection(editorState, editorState.getSelection()),
      );
    }
  };

  blur: () => void = (): void => {
    const editorNode = this.editor;
    if (!editorNode) {
      return;
    }
    invariant(isHTMLElement(editorNode), 'editorNode is not an HTMLElement');
    editorNode.blur();
  };

  /**
   * Used via `this.setMode(...)`.
   *
   * Set the behavior mode for the editor component. This switches the current
   * handler module to ensure that DOM events are managed appropriately for
   * the active mode.
   */
  setMode = (mode: DraftEditorModes): void => {
    const {onPaste, onCut, onCopy} = this.props;
    const editHandler = {...handlerMap.edit};

    if (onPaste) {
      /* $FlowFixMe(>=0.111.0) This comment suppresses an error found when Flow
       * v0.111.0 was deployed. To see the error, delete this comment and run
       * Flow. */
      editHandler.onPaste = onPaste;
    }

    if (onCut) {
      editHandler.onCut = onCut;
    }

    if (onCopy) {
      editHandler.onCopy = onCopy;
    }

    const handler = {
      ...handlerMap,
      edit: editHandler,
    };
    this._handler = handler[mode];
  };

  exitCurrentMode: () => void = (): void => {
    this.setMode('edit');
  };

  /**
   * Used via `this.restoreEditorDOM()`.
   *
   * Force a complete re-render of the DraftEditorContents based on the current
   * EditorState. This is useful when we know we are going to lose control of
   * the DOM state (cut command, IME) and we want to make sure that
   * reconciliation occurs on a version of the DOM that is synchronized with
   * our EditorState.
   */
  restoreEditorDOM: (scrollPosition?: DraftScrollPosition) => void = (
    scrollPosition?: DraftScrollPosition,
  ): void => {
    this.setState({contentsKey: this.state.contentsKey + 1}, () => {
      this.focus(scrollPosition);
    });
  };

  /**
   * Used via `this.setClipboard(...)`.
   *
   * Set the clipboard state for a cut/copy event.
   */
  setClipboard = (clipboard: BlockMap): void => {
    this._clipboard = clipboard;
  };

  /**
   * Used via `this.getClipboard()`.
   *
   * Retrieve the clipboard state for a cut/copy event.
   */
  getClipboard: () => BlockMap = (): BlockMap => {
    return this._clipboard;
  };

  /**
   * Used via `this.updat e(...)`.
   *
   * Propagate a new `EditorState` object to higher-level components. This is
   * the method by which event handlers inform the `DraftEditor` component of
   * state changes. A component that composes a `DraftEditor` **must** provide
   * an `onChange` prop to receive state updates passed along from this
   * function.
   */
  update = (editorState: EditorState) => {
    this._latestEditorState = editorState;
    this.props.onChange(editorState);
  };

  /**
   * Used in conjunction with `onDragLeave()`, by counting the number of times
   * a dragged element enters and leaves the editor (or any of its children),
   * to determine when the dragged element absolutely leaves the editor.
   */
  onDragEnter: () => void = (): void => {
    this._dragCount++;
  };

  /**
   * See `onDragEnter()`.
   */
  onDragLeave: () => void = (): void => {
    this._dragCount--;
    if (this._dragCount === 0) {
      this.exitCurrentMode();
    }
  };
}

export default  DraftEditor;
