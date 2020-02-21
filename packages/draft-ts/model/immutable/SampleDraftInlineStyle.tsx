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

import {OrderedSet} from 'immutable';

export default  {
  BOLD: (OrderedSet.of('BOLD')as  OrderedSet<string>),
  BOLD_ITALIC: (OrderedSet.of('BOLD', 'ITALIC') as OrderedSet<string>),
  BOLD_ITALIC_UNDERLINE: (OrderedSet.of(
    'BOLD',
    'ITALIC',
    'UNDERLINE',
  ) as OrderedSet<string>),
  BOLD_UNDERLINE: (OrderedSet.of('BOLD', 'UNDERLINE') as OrderedSet<string>),
  CODE: (OrderedSet.of('CODE') as OrderedSet<string>),
  ITALIC: (OrderedSet.of('ITALIC') as OrderedSet<string>),
  ITALIC_UNDERLINE: (OrderedSet.of('ITALIC', 'UNDERLINE') as OrderedSet<string>),
  NONE: (OrderedSet() as OrderedSet<string>),
  STRIKETHROUGH: (OrderedSet.of('STRIKETHROUGH') as OrderedSet<string>),
  UNDERLINE: (OrderedSet.of('UNDERLINE') as OrderedSet<string>),
};
