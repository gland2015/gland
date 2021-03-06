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

import UserAgent from 'fbjs/lib/UserAgent'

import invariant from 'fbjs/lib/invariant';

const isOldIE = UserAgent.isBrowser('IE <= 9');

// Provides a dom node that will not execute scripts
// https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation.createHTMLDocument
// https://developer.mozilla.org/en-US/Add-ons/Code_snippets/HTML_to_DOM

function getSafeBodyFromHTML(html: string):  Element {
  let doc;
  let root = null;
  // Provides a safe context
  if (
    !isOldIE &&
    document.implementation &&
    document.implementation.createHTMLDocument
  ) {
    doc = document.implementation.createHTMLDocument('foo');
    invariant(doc.documentElement, 'Missing doc.documentElement');
    doc.documentElement.innerHTML = html;
    root = doc.getElementsByTagName('body')[0];
  }
  return root;
}

export default  getSafeBodyFromHTML;
