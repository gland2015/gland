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

function isHTMLElement(node: Node): boolean {
  if (!node || !node.ownerDocument) {
    return false;
  }
  if (!node.ownerDocument.defaultView) {
    return node instanceof HTMLElement;
  }
  if (node instanceof (node.ownerDocument.defaultView as any).HTMLElement) {
    return true;
  }
  return false;
}

export default  isHTMLElement;
