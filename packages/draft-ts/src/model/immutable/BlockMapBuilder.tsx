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

"use strict";

import { BlockMap } from "./BlockMap";
import { BlockNodeRecord } from "./BlockNodeRecord";

import { OrderedMap } from "immutable";

const BlockMapBuilder = {
    createFromArray: function(blocks: Array<BlockNodeRecord>): BlockMap {
        return OrderedMap(blocks.map(block => [block.getKey(), block]));
    }
};

export default BlockMapBuilder;
