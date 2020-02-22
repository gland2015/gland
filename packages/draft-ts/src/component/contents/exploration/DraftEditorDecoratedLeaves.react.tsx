/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 * @emails oncall+draft_js
 *
 * This is unstable and not part of the public API and should not be used by
 * production systems. This file may be update/removed without notice.
 */

'use strict';

import  {BlockNodeRecord} from '../../../model/immutable/BlockNodeRecord';
import  ContentState from '../../../model/immutable/ContentState';
import {DraftDecoratorType} from '../../../model/decorators/DraftDecoratorType';
import  {BidiDirection} from 'fbjs/lib/UnicodeBidiDirection';
import  {Set} from 'immutable';

import DraftOffsetKey from '../../selection/DraftOffsetKey';
import React, {ReactNode} from 'react'
import UnicodeBidi from 'fbjs/lib/UnicodeBidi';
import UnicodeBidiDirection from 'fbjs/lib/UnicodeBidiDirection';

type Props = {
  block: BlockNodeRecord,
  children: Array<ReactNode>,
  contentState: ContentState,
  decorator: DraftDecoratorType,
  decoratorKey: string,
  direction: BidiDirection,
  text: string,
  leafSet: Set<any>,
};

class DraftEditorDecoratedLeaves extends React.Component<Props> {
  render(): ReactNode {
    const {
      block,
      children,
      contentState,
      decorator,
      decoratorKey,
      direction,
      leafSet,
      text,
    } = this.props;

    const blockKey = block.getKey();
    const leavesForLeafSet = leafSet.get('leaves');
    const DecoratorComponent = decorator.getComponentForKey(decoratorKey);
    const decoratorProps = decorator.getPropsForKey(decoratorKey);
    const decoratorOffsetKey = DraftOffsetKey.encode(
      blockKey,
      parseInt(decoratorKey, 10),
      0,
    );

    const decoratedText = text.slice(
      leavesForLeafSet.first().get('start'),
      leavesForLeafSet.last().get('end'),
    );

    // Resetting dir to the same value on a child node makes Chrome/Firefox
    // confused on cursor movement. See http://jsfiddle.net/d157kLck/3/
    const dir = UnicodeBidiDirection.getHTMLDirIfDifferent(
      UnicodeBidi.getDirection(decoratedText),
      direction,
    );

    return (
      <DecoratorComponent
        {...decoratorProps}
        contentState={contentState}
        decoratedText={decoratedText}
        dir={dir}
        key={decoratorOffsetKey}
        entityKey={block.getEntityAt(leafSet.get('start'))}
        offsetKey={decoratorOffsetKey}>
        {children}
      </DecoratorComponent>
    );
  }
}

export default  DraftEditorDecoratedLeaves;
