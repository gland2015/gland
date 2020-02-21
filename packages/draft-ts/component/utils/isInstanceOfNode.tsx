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

function isInstanceOfNode(target: EventTarget): boolean {
  // we changed the name because of having duplicate module provider (fbjs)
  if (!target || !('ownerDocument' in target)) {
    return false;
  }
  if ('ownerDocument' in target) {
    const node: Node = (target as any);
    if (!node.ownerDocument.defaultView) {
      return node instanceof Node;
    }
    // $FlowFixMe https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11508#issuecomment-256045682
    if (node instanceof (node.ownerDocument.defaultView as any).Node) {
      return true;
    }
  }
  return false;
}

export default  isInstanceOfNode;
