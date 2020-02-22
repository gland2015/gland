import { OrderedMap, OrderedSet, Record, Map, List, Repeat, is, Stack } from 'immutable';
import invariant from 'fbjs/lib/invariant';
import UnicodeBidiService from 'fbjs/lib/UnicodeBidiService';
import nullthrows from 'fbjs/lib/nullthrows';
import React from 'react';
import cx from 'fbjs/lib/cx';
import UserAgent from 'fbjs/lib/UserAgent';
import Keys from 'fbjs/lib/Keys';
import ReactDOM from 'react-dom';
import UnicodeBidi from 'fbjs/lib/UnicodeBidi';
import UnicodeBidiDirection from 'fbjs/lib/UnicodeBidiDirection';
import containsNode from 'fbjs/lib/containsNode';
import getActiveElement from 'fbjs/lib/getActiveElement';
import Scroll from 'fbjs/lib/Scroll';
import Style from 'fbjs/lib/Style';
import getElementPosition from 'fbjs/lib/getElementPosition';
import getScrollPosition from 'fbjs/lib/getScrollPosition';
import getViewportDimensions from 'fbjs/lib/getViewportDimensions';
import joinClasses from 'fbjs/lib/joinClasses';
import DataTransfer from 'fbjs/lib/DataTransfer';
import setImmediate from 'fbjs/lib/setImmediate';
import UnicodeUtils from 'fbjs/lib/UnicodeUtils';
import warning from 'fbjs/lib/warning';
import TokenizeUtil from 'fbjs/lib/TokenizeUtil';
import URI from 'fbjs/lib/URI';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

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
var BlockMapBuilder = {
    createFromArray: function (blocks) {
        return OrderedMap(blocks.map(function (block) { return [block.getKey(), block]; }));
    }
};

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
var EMPTY_SET = OrderedSet();
var defaultRecord = {
    style: EMPTY_SET,
    entity: null,
};
var CharacterMetadataRecord = Record(defaultRecord);
var CharacterMetadata = /** @class */ (function (_super) {
    __extends(CharacterMetadata, _super);
    function CharacterMetadata() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CharacterMetadata.prototype.getStyle = function () {
        return this.get('style');
    };
    CharacterMetadata.prototype.getEntity = function () {
        return this.get('entity');
    };
    CharacterMetadata.prototype.hasStyle = function (style) {
        return this.getStyle().includes(style);
    };
    CharacterMetadata.applyStyle = function (record, style) {
        var withStyle = record.set('style', record.getStyle().add(style));
        return CharacterMetadata.create(withStyle);
    };
    CharacterMetadata.removeStyle = function (record, style) {
        var withoutStyle = record.set('style', record.getStyle().remove(style));
        return CharacterMetadata.create(withoutStyle);
    };
    CharacterMetadata.applyEntity = function (record, entityKey) {
        var withEntity = record.getEntity() === entityKey
            ? record
            : record.set('entity', entityKey);
        return CharacterMetadata.create(withEntity);
    };
    /**
     * Use this function instead of the `CharacterMetadata` constructor.
     * Since most content generally uses only a very small number of
     * style/entity permutations, we can reuse these objects as often as
     * possible.
     */
    CharacterMetadata.create = function (config) {
        if (!config) {
            return EMPTY;
        }
        var defaultConfig = {
            style: EMPTY_SET,
            entity: null,
        };
        // Fill in unspecified properties, if necessary.
        var configMap = Map(defaultConfig).merge(config);
        var existing = pool.get(configMap);
        if (existing) {
            return existing;
        }
        var newCharacter = new CharacterMetadata(configMap);
        pool = pool.set(configMap, newCharacter);
        return newCharacter;
    };
    return CharacterMetadata;
}(CharacterMetadataRecord));
var EMPTY = new CharacterMetadata();
var pool = Map([
    [Map(defaultRecord), EMPTY],
]);
CharacterMetadata.EMPTY = EMPTY;

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
/**
 * Search through an array to find contiguous stretches of elements that
 * match a specified filter function.
 *
 * When ranges are found, execute a specified `found` function to supply
 * the values to the caller.
 */
function findRangesImmutable(haystack, areEqualFn, filterFn, foundFn) {
    if (!haystack.size) {
        return;
    }
    var cursor = 0;
    haystack.reduce(function (value, nextValue, nextIndex) {
        if (!areEqualFn(value, nextValue)) {
            if (filterFn(value)) {
                foundFn(cursor, nextIndex);
            }
            cursor = nextIndex;
        }
        return nextValue;
    });
    filterFn(haystack.last()) && foundFn(cursor, haystack.count());
}

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
var EMPTY_SET$1 = OrderedSet();
var defaultRecord$1 = {
    key: '',
    type: 'unstyled',
    text: '',
    characterList: List(),
    depth: 0,
    data: Map(),
};
var ContentBlockRecord = Record(defaultRecord$1);
var decorateCharacterList = function (config) {
    if (!config) {
        return config;
    }
    var characterList = config.characterList, text = config.text;
    if (text && !characterList) {
        config.characterList = List(Repeat(CharacterMetadata.EMPTY, text.length));
    }
    return config;
};
var ContentBlock = /** @class */ (function (_super) {
    __extends(ContentBlock, _super);
    function ContentBlock(config) {
        return _super.call(this, decorateCharacterList(config)) || this;
    }
    ContentBlock.prototype.getKey = function () {
        return this.get('key');
    };
    ContentBlock.prototype.getType = function () {
        return this.get('type');
    };
    ContentBlock.prototype.getText = function () {
        return this.get('text');
    };
    ContentBlock.prototype.getCharacterList = function () {
        return this.get('characterList');
    };
    ContentBlock.prototype.getLength = function () {
        return this.getText().length;
    };
    ContentBlock.prototype.getDepth = function () {
        return this.get('depth');
    };
    ContentBlock.prototype.getData = function () {
        return this.get('data');
    };
    ContentBlock.prototype.getInlineStyleAt = function (offset) {
        var character = this.getCharacterList().get(offset);
        return character ? character.getStyle() : EMPTY_SET$1;
    };
    ContentBlock.prototype.getEntityAt = function (offset) {
        var character = this.getCharacterList().get(offset);
        return character ? character.getEntity() : null;
    };
    /**
     * Execute a callback for every contiguous range of styles within the block.
     */
    ContentBlock.prototype.findStyleRanges = function (filterFn, callback) {
        findRangesImmutable(this.getCharacterList(), haveEqualStyle, filterFn, callback);
    };
    /**
     * Execute a callback for every contiguous range of entities within the block.
     */
    ContentBlock.prototype.findEntityRanges = function (filterFn, callback) {
        findRangesImmutable(this.getCharacterList(), haveEqualEntity, filterFn, callback);
    };
    return ContentBlock;
}(ContentBlockRecord));
function haveEqualStyle(charA, charB) {
    return charA.getStyle() === charB.getStyle();
}
function haveEqualEntity(charA, charB) {
    return charA.getEntity() === charB.getEntity();
}

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
 * This file is a fork of ContentBlock adding support for nesting references by
 * providing links to children, parent, prevSibling, and nextSibling.
 *
 * This is unstable and not part of the public API and should not be used by
 * production systems. This file may be update/removed without notice.
 */
var EMPTY_SET$2 = OrderedSet();
var defaultRecord$2 = {
    parent: null,
    characterList: List(),
    data: Map(),
    depth: 0,
    key: "",
    text: "",
    type: "unstyled",
    children: List(),
    prevSibling: null,
    nextSibling: null
};
var haveEqualStyle$1 = function (charA, charB) { return charA.getStyle() === charB.getStyle(); };
var haveEqualEntity$1 = function (charA, charB) { return charA.getEntity() === charB.getEntity(); };
var decorateCharacterList$1 = function (config) {
    if (!config) {
        return config;
    }
    var characterList = config.characterList, text = config.text;
    if (text && !characterList) {
        config.characterList = List(Repeat(CharacterMetadata.EMPTY, text.length));
    }
    return config;
};
var ContentBlockNode = /** @class */ (function (_super) {
    __extends(ContentBlockNode, _super);
    function ContentBlockNode(props) {
        if (props === void 0) { props = defaultRecord$2; }
        /* eslint-disable-next-line constructor-super */
        return _super.call(this, decorateCharacterList$1(props)) || this;
    }
    ContentBlockNode.prototype.getKey = function () {
        return this.get("key");
    };
    ContentBlockNode.prototype.getType = function () {
        return this.get("type");
    };
    ContentBlockNode.prototype.getText = function () {
        return this.get("text");
    };
    ContentBlockNode.prototype.getCharacterList = function () {
        return this.get("characterList");
    };
    ContentBlockNode.prototype.getLength = function () {
        return this.getText().length;
    };
    ContentBlockNode.prototype.getDepth = function () {
        return this.get("depth");
    };
    ContentBlockNode.prototype.getData = function () {
        return this.get("data");
    };
    ContentBlockNode.prototype.getInlineStyleAt = function (offset) {
        var character = this.getCharacterList().get(offset);
        return character ? character.getStyle() : EMPTY_SET$2;
    };
    ContentBlockNode.prototype.getEntityAt = function (offset) {
        var character = this.getCharacterList().get(offset);
        return character ? character.getEntity() : null;
    };
    ContentBlockNode.prototype.getChildKeys = function () {
        return this.get("children");
    };
    ContentBlockNode.prototype.getParentKey = function () {
        return this.get("parent");
    };
    ContentBlockNode.prototype.getPrevSiblingKey = function () {
        return this.get("prevSibling");
    };
    ContentBlockNode.prototype.getNextSiblingKey = function () {
        return this.get("nextSibling");
    };
    ContentBlockNode.prototype.findStyleRanges = function (filterFn, callback) {
        findRangesImmutable(this.getCharacterList(), haveEqualStyle$1, filterFn, callback);
    };
    ContentBlockNode.prototype.findEntityRanges = function (filterFn, callback) {
        findRangesImmutable(this.getCharacterList(), haveEqualEntity$1, filterFn, callback);
    };
    return ContentBlockNode;
}(Record(defaultRecord$2)));

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
var ContentStateInlineStyle = {
    add: function (contentState, selectionState, inlineStyle) {
        return modifyInlineStyle(contentState, selectionState, inlineStyle, true);
    },
    remove: function (contentState, selectionState, inlineStyle) {
        return modifyInlineStyle(contentState, selectionState, inlineStyle, false);
    },
};
function modifyInlineStyle(contentState, selectionState, inlineStyle, addOrRemove) {
    var blockMap = contentState.getBlockMap();
    var startKey = selectionState.getStartKey();
    var startOffset = selectionState.getStartOffset();
    var endKey = selectionState.getEndKey();
    var endOffset = selectionState.getEndOffset();
    var newBlocks = blockMap
        .skipUntil(function (_, k) { return k === startKey; })
        .takeUntil(function (_, k) { return k === endKey; })
        .concat(Map([[endKey, blockMap.get(endKey)]]))
        .map(function (block, blockKey) {
        var sliceStart;
        var sliceEnd;
        if (startKey === endKey) {
            sliceStart = startOffset;
            sliceEnd = endOffset;
        }
        else {
            sliceStart = blockKey === startKey ? startOffset : 0;
            sliceEnd = blockKey === endKey ? endOffset : block.getLength();
        }
        var chars = block.getCharacterList();
        var current;
        while (sliceStart < sliceEnd) {
            current = chars.get(sliceStart);
            chars = chars.set(sliceStart, addOrRemove
                ? CharacterMetadata.applyStyle(current, inlineStyle)
                : CharacterMetadata.removeStyle(current, inlineStyle));
            sliceStart++;
        }
        return block.set('characterList', chars);
    });
    return contentState.merge({
        blockMap: blockMap.merge(newBlocks),
        selectionBefore: selectionState,
        selectionAfter: selectionState,
    });
}

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
function applyEntityToContentBlock(contentBlock, start, end, entityKey) {
    var characterList = contentBlock.getCharacterList();
    while (start < end) {
        characterList = characterList.set(start, CharacterMetadata.applyEntity(characterList.get(start), entityKey));
        start++;
    }
    return contentBlock.set('characterList', characterList);
}

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
function applyEntityToContentState(contentState, selectionState, entityKey) {
    var blockMap = contentState.getBlockMap();
    var startKey = selectionState.getStartKey();
    var startOffset = selectionState.getStartOffset();
    var endKey = selectionState.getEndKey();
    var endOffset = selectionState.getEndOffset();
    var newBlocks = blockMap
        .skipUntil(function (_, k) { return k === startKey; })
        .takeUntil(function (_, k) { return k === endKey; })
        .toOrderedMap()
        .merge(OrderedMap([[endKey, blockMap.get(endKey)]]))
        .map(function (block, blockKey) {
        var sliceStart = blockKey === startKey ? startOffset : 0;
        var sliceEnd = blockKey === endKey ? endOffset : block.getLength();
        return applyEntityToContentBlock(block, sliceStart, sliceEnd, entityKey);
    });
    return contentState.merge({
        blockMap: blockMap.merge(newBlocks),
        selectionBefore: selectionState,
        selectionAfter: selectionState,
    });
}

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
/**
 * Identify the range to delete from a segmented entity.
 *
 * Rules:
 *
 *  Example: 'John F. Kennedy'
 *
 *   - Deletion from within any non-whitespace (i.e. ['John', 'F.', 'Kennedy'])
 *     will return the range of that text.
 *
 *       'John F. Kennedy' -> 'John F.'
 *                  ^
 *
 *   - Forward deletion of whitespace will remove the following section:
 *
 *       'John F. Kennedy' -> 'John Kennedy'
 *            ^
 *
 *   - Backward deletion of whitespace will remove the previous section:
 *
 *       'John F. Kennedy' -> 'F. Kennedy'
 *            ^
 */
var DraftEntitySegments = {
    getRemovalRange: function (selectionStart, selectionEnd, text, entityStart, direction) {
        var segments = text.split(' ');
        segments = segments.map(function (/*string*/ segment, /*number*/ ii) {
            if (direction === 'forward') {
                if (ii > 0) {
                    return ' ' + segment;
                }
            }
            else if (ii < segments.length - 1) {
                return segment + ' ';
            }
            return segment;
        });
        var segmentStart = entityStart;
        var segmentEnd;
        var segment;
        var removalStart = null;
        var removalEnd = null;
        for (var jj = 0; jj < segments.length; jj++) {
            segment = segments[jj];
            segmentEnd = segmentStart + segment.length;
            // Our selection overlaps this segment.
            if (selectionStart < segmentEnd && segmentStart < selectionEnd) {
                if (removalStart !== null) {
                    removalEnd = segmentEnd;
                }
                else {
                    removalStart = segmentStart;
                    removalEnd = segmentEnd;
                }
            }
            else if (removalStart !== null) {
                break;
            }
            segmentStart = segmentEnd;
        }
        var entityEnd = entityStart + text.length;
        var atStart = removalStart === entityStart;
        var atEnd = removalEnd === entityEnd;
        if ((!atStart && atEnd) || (atStart && !atEnd)) {
            if (direction === 'forward') {
                if (removalEnd !== entityEnd) {
                    removalEnd++;
                }
            }
            else if (removalStart !== entityStart) {
                removalStart--;
            }
        }
        return {
            start: removalStart,
            end: removalEnd,
        };
    },
};

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
/**
 * Obtain the start and end positions of the range that has the
 * specified entity applied to it.
 *
 * Entity keys are applied only to contiguous stretches of text, so this
 * method searches for the first instance of the entity key and returns
 * the subsequent range.
 */
function getRangesForDraftEntity(block, key) {
    var ranges = [];
    block.findEntityRanges(function (c) { return c.getEntity() === key; }, function (start, end) {
        ranges.push({ start: start, end: end });
    });
    invariant(!!ranges.length, 'Entity key not found in this range.');
    return ranges;
}

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
/**
 * Given a SelectionState and a removal direction, determine the entire range
 * that should be removed from a ContentState. This is based on any entities
 * within the target, with their `mutability` values taken into account.
 *
 * For instance, if we are attempting to remove part of an "immutable" entity
 * range, the entire entity must be removed. The returned `SelectionState`
 * will be adjusted accordingly.
 */
function getCharacterRemovalRange(entityMap, startBlock, endBlock, selectionState, direction) {
    var start = selectionState.getStartOffset();
    var end = selectionState.getEndOffset();
    var startEntityKey = startBlock.getEntityAt(start);
    var endEntityKey = endBlock.getEntityAt(end - 1);
    if (!startEntityKey && !endEntityKey) {
        return selectionState;
    }
    var newSelectionState = selectionState;
    if (startEntityKey && startEntityKey === endEntityKey) {
        newSelectionState = getEntityRemovalRange(entityMap, startBlock, newSelectionState, direction, startEntityKey, true, true);
    }
    else if (startEntityKey && endEntityKey) {
        var startSelectionState = getEntityRemovalRange(entityMap, startBlock, newSelectionState, direction, startEntityKey, false, true);
        var endSelectionState = getEntityRemovalRange(entityMap, endBlock, newSelectionState, direction, endEntityKey, false, false);
        newSelectionState = newSelectionState.merge({
            anchorOffset: startSelectionState.getAnchorOffset(),
            focusOffset: endSelectionState.getFocusOffset(),
            isBackward: false,
        });
    }
    else if (startEntityKey) {
        var startSelectionState = getEntityRemovalRange(entityMap, startBlock, newSelectionState, direction, startEntityKey, false, true);
        newSelectionState = newSelectionState.merge({
            anchorOffset: startSelectionState.getStartOffset(),
            isBackward: false,
        });
    }
    else if (endEntityKey) {
        var endSelectionState = getEntityRemovalRange(entityMap, endBlock, newSelectionState, direction, endEntityKey, false, false);
        newSelectionState = newSelectionState.merge({
            focusOffset: endSelectionState.getEndOffset(),
            isBackward: false,
        });
    }
    return newSelectionState;
}
function getEntityRemovalRange(entityMap, block, selectionState, direction, entityKey, isEntireSelectionWithinEntity, isEntityAtStart) {
    var start = selectionState.getStartOffset();
    var end = selectionState.getEndOffset();
    var entity = entityMap.__get(entityKey);
    var mutability = entity.getMutability();
    var sideToConsider = isEntityAtStart ? start : end;
    // `MUTABLE` entities can just have the specified range of text removed
    // directly. No adjustments are needed.
    if (mutability === 'MUTABLE') {
        return selectionState;
    }
    // Find the entity range that overlaps with our removal range.
    var entityRanges = getRangesForDraftEntity(block, entityKey).filter(function (range) { return sideToConsider <= range.end && sideToConsider >= range.start; });
    invariant(entityRanges.length == 1, 'There should only be one entity range within this removal range.');
    var entityRange = entityRanges[0];
    // For `IMMUTABLE` entity types, we will remove the entire entity range.
    if (mutability === 'IMMUTABLE') {
        return selectionState.merge({
            anchorOffset: entityRange.start,
            focusOffset: entityRange.end,
            isBackward: false,
        });
    }
    // For `SEGMENTED` entity types, determine the appropriate segment to
    // remove.
    if (!isEntireSelectionWithinEntity) {
        if (isEntityAtStart) {
            end = entityRange.end;
        }
        else {
            start = entityRange.start;
        }
    }
    var removalRange = DraftEntitySegments.getRemovalRange(start, end, block.getText().slice(entityRange.start, entityRange.end), entityRange.start, direction);
    return selectionState.merge({
        anchorOffset: removalRange.start,
        focusOffset: removalRange.end,
        isBackward: false,
    });
}

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
var seenKeys = {};
var MULTIPLIER = Math.pow(2, 32);
function generateRandomKey() {
    var key;
    while (key === undefined || seenKeys.hasOwnProperty(key) || !isNaN(+key)) {
        key = Math.floor(Math.random() * MULTIPLIER).toString(32);
    }
    seenKeys[key] = true;
    return key;
}

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
var randomizeContentBlockNodeKeys = function (blockMap) {
    var newKeysRef = {};
    // we keep track of root blocks in order to update subsequent sibling links
    var lastRootBlock;
    return OrderedMap(blockMap
        .withMutations(function (blockMapState) {
        blockMapState.forEach(function (block, index) {
            var oldKey = block.getKey();
            var nextKey = block.getNextSiblingKey();
            var prevKey = block.getPrevSiblingKey();
            var childrenKeys = block.getChildKeys();
            var parentKey = block.getParentKey();
            // new key that we will use to build linking
            var key = generateRandomKey();
            // we will add it here to re-use it later
            newKeysRef[oldKey] = key;
            if (nextKey) {
                var nextBlock = blockMapState.get(nextKey);
                if (nextBlock) {
                    blockMapState.setIn([nextKey, 'prevSibling'], key);
                }
                else {
                    // this can happen when generating random keys for fragments
                    blockMapState.setIn([oldKey, 'nextSibling'], null);
                }
            }
            if (prevKey) {
                var prevBlock = blockMapState.get(prevKey);
                if (prevBlock) {
                    blockMapState.setIn([prevKey, 'nextSibling'], key);
                }
                else {
                    // this can happen when generating random keys for fragments
                    blockMapState.setIn([oldKey, 'prevSibling'], null);
                }
            }
            if (parentKey && blockMapState.get(parentKey)) {
                var parentBlock = blockMapState.get(parentKey);
                var parentChildrenList = parentBlock.getChildKeys();
                blockMapState.setIn([parentKey, 'children'], parentChildrenList.set(parentChildrenList.indexOf(block.getKey()), key));
            }
            else {
                // blocks will then be treated as root block nodes
                blockMapState.setIn([oldKey, 'parent'], null);
                if (lastRootBlock) {
                    blockMapState.setIn([lastRootBlock.getKey(), 'nextSibling'], key);
                    blockMapState.setIn([oldKey, 'prevSibling'], newKeysRef[lastRootBlock.getKey()]);
                }
                lastRootBlock = blockMapState.get(oldKey);
            }
            childrenKeys.forEach(function (childKey) {
                var childBlock = blockMapState.get(childKey);
                if (childBlock) {
                    blockMapState.setIn([childKey, 'parent'], key);
                }
                else {
                    blockMapState.setIn([oldKey, 'children'], block.getChildKeys().filter(function (child) { return child !== childKey; }));
                }
            });
        });
    })
        .toArray()
        .map(function (block) { return [
        newKeysRef[block.getKey()],
        block.set('key', newKeysRef[block.getKey()]),
    ]; }));
};
var randomizeContentBlockKeys = function (blockMap) {
    return OrderedMap(blockMap.toArray().map(function (block) {
        var key = generateRandomKey();
        return [key, block.set('key', key)];
    }));
};
var randomizeBlockMapKeys = function (blockMap) {
    var isTreeBasedBlockMap = blockMap.first() instanceof ContentBlockNode;
    if (!isTreeBasedBlockMap) {
        return randomizeContentBlockKeys(blockMap);
    }
    return randomizeContentBlockNodeKeys(blockMap);
};

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
function removeEntitiesAtEdges(contentState, selectionState) {
    var blockMap = contentState.getBlockMap();
    var entityMap = contentState.getEntityMap();
    var updatedBlocks = {};
    var startKey = selectionState.getStartKey();
    var startOffset = selectionState.getStartOffset();
    var startBlock = blockMap.get(startKey);
    var updatedStart = removeForBlock(entityMap, startBlock, startOffset);
    if (updatedStart !== startBlock) {
        updatedBlocks[startKey] = updatedStart;
    }
    var endKey = selectionState.getEndKey();
    var endOffset = selectionState.getEndOffset();
    var endBlock = blockMap.get(endKey);
    if (startKey === endKey) {
        endBlock = updatedStart;
    }
    var updatedEnd = removeForBlock(entityMap, endBlock, endOffset);
    if (updatedEnd !== endBlock) {
        updatedBlocks[endKey] = updatedEnd;
    }
    if (!Object.keys(updatedBlocks).length) {
        return contentState.set('selectionAfter', selectionState);
    }
    return contentState.merge({
        blockMap: blockMap.merge(updatedBlocks),
        selectionAfter: selectionState,
    });
}
/**
 * Given a list of characters and an offset that is in the middle of an entity,
 * returns the start and end of the entity that is overlapping the offset.
 * Note: This method requir es that the offset be in an entity range.
 */
function getRemovalRange(characters, entityKey, offset) {
    var removalRange;
    // Iterates through a list looking for ranges of matching items
    // based on the 'isEqual' callback.
    // Then instead of returning the result, call the 'found' callback
    // with each range.
    // Then filters those ranges based on the 'filter' callback
    //
    // Here we use it to find ranges of characters with the same entity key.
    findRangesImmutable(characters, // the list to iterate through
    function (a, b) { return a.getEntity() === b.getEntity(); }, // 'isEqual' callback
    function (// 'isEqual' callback
    element) { return element.getEntity() === entityKey; }, // 'filter' callback
    function (start, end) {
        // 'found' callback
        if (start <= offset && end >= offset) {
            // this entity overlaps the offset index
            removalRange = { start: start, end: end };
        }
    });
    invariant(typeof removalRange === 'object', 'Removal range must exist within character list.');
    return removalRange;
}
function removeForBlock(entityMap, block, offset) {
    var chars = block.getCharacterList();
    var charBefore = offset > 0 ? chars.get(offset - 1) : undefined;
    var charAfter = offset < chars.count() ? chars.get(offset) : undefined;
    var entityBeforeCursor = charBefore ? charBefore.getEntity() : undefined;
    var entityAfterCursor = charAfter ? charAfter.getEntity() : undefined;
    if (entityAfterCursor && entityAfterCursor === entityBeforeCursor) {
        var entity = entityMap.__get(entityAfterCursor);
        if (entity.getMutability() !== 'MUTABLE') {
            var _a = getRemovalRange(chars, entityAfterCursor, offset), start = _a.start, end = _a.end;
            var current = void 0;
            while (start < end) {
                current = chars.get(start);
                chars = chars.set(start, CharacterMetadata.applyEntity(current, null));
                start++;
            }
            return block.set('characterList', chars);
        }
    }
    return block;
}

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
var getContentStateFragment = function (contentState, selectionState) {
    var startKey = selectionState.getStartKey();
    var startOffset = selectionState.getStartOffset();
    var endKey = selectionState.getEndKey();
    var endOffset = selectionState.getEndOffset();
    // Edge entities should be stripped to ensure that we don't preserve
    // invalid partial entities when the fragment is reused. We do, however,
    // preserve entities that are entirely within the selection range.
    var contentWithoutEdgeEntities = removeEntitiesAtEdges(contentState, selectionState);
    var blockMap = contentWithoutEdgeEntities.getBlockMap();
    var blockKeys = blockMap.keySeq();
    var startIndex = blockKeys.indexOf(startKey);
    var endIndex = blockKeys.indexOf(endKey) + 1;
    return randomizeBlockMapKeys(blockMap.slice(startIndex, endIndex).map(function (block, blockKey) {
        var text = block.getText();
        var chars = block.getCharacterList();
        if (startKey === endKey) {
            return block.merge({
                text: text.slice(startOffset, endOffset),
                characterList: chars.slice(startOffset, endOffset),
            });
        }
        if (blockKey === startKey) {
            return block.merge({
                text: text.slice(startOffset),
                characterList: chars.slice(startOffset),
            });
        }
        if (blockKey === endKey) {
            return block.merge({
                text: text.slice(0, endOffset),
                characterList: chars.slice(0, endOffset),
            });
        }
        return block;
    }));
};

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
/**
 * Maintain persistence for target list when appending and prepending.
 */
function insertIntoList(targetListArg, toInsert, offset) {
    var targetList = targetListArg;
    if (offset === targetList.count()) {
        toInsert.forEach(function (c) {
            targetList = targetList.push(c);
        });
    }
    else if (offset === 0) {
        toInsert.reverse().forEach(function (c) {
            targetList = targetList.unshift(c);
        });
    }
    else {
        var head = targetList.slice(0, offset);
        var tail = targetList.slice(offset);
        targetList = head.concat(toInsert, tail).toList();
    }
    return targetList;
}

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
var updateExistingBlock = function (contentState, selectionState, blockMap, fragmentBlock, targetKey, targetOffset, mergeBlockData) {
    if (mergeBlockData === void 0) { mergeBlockData = 'REPLACE_WITH_NEW_DATA'; }
    var targetBlock = blockMap.get(targetKey);
    var text = targetBlock.getText();
    var chars = targetBlock.getCharacterList();
    var finalKey = targetKey;
    var finalOffset = targetOffset + fragmentBlock.getText().length;
    var data = null;
    switch (mergeBlockData) {
        case 'MERGE_OLD_DATA_TO_NEW_DATA':
            data = fragmentBlock.getData().merge(targetBlock.getData());
            break;
        case 'REPLACE_WITH_NEW_DATA':
            data = fragmentBlock.getData();
            break;
    }
    var newBlock = targetBlock.merge({
        text: text.slice(0, targetOffset) +
            fragmentBlock.getText() +
            text.slice(targetOffset),
        characterList: insertIntoList(chars, fragmentBlock.getCharacterList(), targetOffset),
        data: data,
    });
    return contentState.merge({
        blockMap: blockMap.set(targetKey, newBlock),
        selectionBefore: selectionState,
        selectionAfter: selectionState.merge({
            anchorKey: finalKey,
            anchorOffset: finalOffset,
            focusKey: finalKey,
            focusOffset: finalOffset,
            isBackward: false,
        }),
    });
};
/**
 * Appends text/characterList from the fragment first block to
 * target block.
 */
var updateHead = function (block, targetOffset, fragment) {
    var text = block.getText();
    var chars = block.getCharacterList();
    // Modify head portion of block.
    var headText = text.slice(0, targetOffset);
    var headCharacters = chars.slice(0, targetOffset);
    var appendToHead = fragment.first();
    return block.merge({
        text: headText + appendToHead.getText(),
        characterList: headCharacters.concat(appendToHead.getCharacterList()),
        type: headText ? block.getType() : appendToHead.getType(),
        data: appendToHead.getData(),
    });
};
/**
 * Appends offset text/characterList from the target block to the last
 * fragment block.
 */
var updateTail = function (block, targetOffset, fragment) {
    // Modify tail portion of block.
    var text = block.getText();
    var chars = block.getCharacterList();
    // Modify head portion of block.
    var blockSize = text.length;
    var tailText = text.slice(targetOffset, blockSize);
    var tailCharacters = chars.slice(targetOffset, blockSize);
    var prependToTail = fragment.last();
    return prependToTail.merge({
        text: prependToTail.getText() + tailText,
        characterList: prependToTail.getCharacterList().concat(tailCharacters),
        data: prependToTail.getData(),
    });
};
var getRootBlocks = function (block, blockMap) {
    var headKey = block.getKey();
    var rootBlock = block;
    var rootBlocks = [];
    // sometimes the fragment head block will not be part of the blockMap itself this can happen when
    // the fragment head is used to update the target block, however when this does not happen we need
    // to make sure that we include it on the rootBlocks since the first block of a fragment is always a
    // fragment root block
    if (blockMap.get(headKey)) {
        rootBlocks.push(headKey);
    }
    while (rootBlock && rootBlock.getNextSiblingKey()) {
        var lastSiblingKey = rootBlock.getNextSiblingKey();
        if (!lastSiblingKey) {
            break;
        }
        rootBlocks.push(lastSiblingKey);
        rootBlock = blockMap.get(lastSiblingKey);
    }
    return rootBlocks;
};
var updateBlockMapLinks = function (blockMap, originalBlockMap, targetBlock, fragmentHeadBlock) {
    return blockMap.withMutations(function (blockMapState) {
        var targetKey = targetBlock.getKey();
        var headKey = fragmentHeadBlock.getKey();
        var targetNextKey = targetBlock.getNextSiblingKey();
        var targetParentKey = targetBlock.getParentKey();
        var fragmentRootBlocks = getRootBlocks(fragmentHeadBlock, blockMap);
        var lastRootFragmentBlockKey = fragmentRootBlocks[fragmentRootBlocks.length - 1];
        if (blockMapState.get(headKey)) {
            // update the fragment head when it is part of the blockMap otherwise
            blockMapState.setIn([targetKey, 'nextSibling'], headKey);
            blockMapState.setIn([headKey, 'prevSibling'], targetKey);
        }
        else {
            // update the target block that had the fragment head contents merged into it
            blockMapState.setIn([targetKey, 'nextSibling'], fragmentHeadBlock.getNextSiblingKey());
            blockMapState.setIn([fragmentHeadBlock.getNextSiblingKey(), 'prevSibling'], targetKey);
        }
        // update the last root block fragment
        blockMapState.setIn([lastRootFragmentBlockKey, 'nextSibling'], targetNextKey);
        // update the original target next block
        if (targetNextKey) {
            blockMapState.setIn([targetNextKey, 'prevSibling'], lastRootFragmentBlockKey);
        }
        // update fragment parent links
        fragmentRootBlocks.forEach(function (blockKey) {
            return blockMapState.setIn([blockKey, 'parent'], targetParentKey);
        });
        // update targetBlock parent child links
        if (targetParentKey) {
            var targetParent = blockMap.get(targetParentKey);
            var originalTargetParentChildKeys = targetParent.getChildKeys();
            var targetBlockIndex = originalTargetParentChildKeys.indexOf(targetKey);
            var insertionIndex = targetBlockIndex + 1;
            var newChildrenKeysArray = originalTargetParentChildKeys.toArray();
            // insert fragment children
            newChildrenKeysArray.splice.apply(newChildrenKeysArray, __spreadArrays([insertionIndex, 0], fragmentRootBlocks));
            blockMapState.setIn([targetParentKey, 'children'], List(newChildrenKeysArray));
        }
    });
};
var insertFragment = function (contentState, selectionState, blockMap, fragment, targetKey, targetOffset) {
    var isTreeBasedBlockMap = blockMap.first() instanceof ContentBlockNode;
    var newBlockArr = [];
    var fragmentSize = fragment.size;
    var target = blockMap.get(targetKey);
    var head = fragment.first();
    var tail = fragment.last();
    var finalOffset = tail.getLength();
    var finalKey = tail.getKey();
    var shouldNotUpdateFromFragmentBlock = isTreeBasedBlockMap &&
        (!target.getChildKeys().isEmpty() || !head.getChildKeys().isEmpty());
    blockMap.forEach(function (block, blockKey) {
        if (blockKey !== targetKey) {
            newBlockArr.push(block);
            return;
        }
        if (shouldNotUpdateFromFragmentBlock) {
            newBlockArr.push(block);
        }
        else {
            newBlockArr.push(updateHead(block, targetOffset, fragment));
        }
        // Insert fragment blocks after the head and before the tail.
        fragment
            // when we are updating the target block with the head fragment block we skip the first fragment
            // head since its contents have already been merged with the target block otherwise we include
            // the whole fragment
            .slice(shouldNotUpdateFromFragmentBlock ? 0 : 1, fragmentSize - 1)
            .forEach(function (fragmentBlock) { return newBlockArr.push(fragmentBlock); });
        // update tail
        newBlockArr.push(updateTail(block, targetOffset, fragment));
    });
    var updatedBlockMap = BlockMapBuilder.createFromArray(newBlockArr);
    if (isTreeBasedBlockMap) {
        updatedBlockMap = updateBlockMapLinks(updatedBlockMap, blockMap, target, head);
    }
    return contentState.merge({
        blockMap: updatedBlockMap,
        selectionBefore: selectionState,
        selectionAfter: selectionState.merge({
            anchorKey: finalKey,
            anchorOffset: finalOffset,
            focusKey: finalKey,
            focusOffset: finalOffset,
            isBackward: false,
        }),
    });
};
var insertFragmentIntoContentState = function (contentState, selectionState, fragmentBlockMap, mergeBlockData) {
    if (mergeBlockData === void 0) { mergeBlockData = 'REPLACE_WITH_NEW_DATA'; }
    invariant(selectionState.isCollapsed(), '`insertFragment` should only be called with a collapsed selection state.');
    var blockMap = contentState.getBlockMap();
    var fragment = randomizeBlockMapKeys(fragmentBlockMap);
    var targetKey = selectionState.getStartKey();
    var targetOffset = selectionState.getStartOffset();
    var targetBlock = blockMap.get(targetKey);
    if (targetBlock instanceof ContentBlockNode) {
        invariant(targetBlock.getChildKeys().isEmpty(), '`insertFragment` should not be called when a container node is selected.');
    }
    // When we insert a fragment with a single block we simply update the target block
    // with the contents of the inserted fragment block
    if (fragment.size === 1) {
        return updateExistingBlock(contentState, selectionState, blockMap, fragment.first(), targetKey, targetOffset, mergeBlockData);
    }
    return insertFragment(contentState, selectionState, blockMap, fragment, targetKey, targetOffset);
};

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
function insertTextIntoContentState(contentState, selectionState, text, characterMetadata) {
    invariant(selectionState.isCollapsed(), '`insertText` should only be called with a collapsed range.');
    var len = null;
    if (text != null) {
        len = text.length;
    }
    if (len == null || len === 0) {
        return contentState;
    }
    var blockMap = contentState.getBlockMap();
    var key = selectionState.getStartKey();
    var offset = selectionState.getStartOffset();
    var block = blockMap.get(key);
    var blockText = block.getText();
    var newBlock = block.merge({
        text: blockText.slice(0, offset) +
            text +
            blockText.slice(offset, block.getLength()),
        characterList: insertIntoList(block.getCharacterList(), Repeat(characterMetadata, len).toList(), offset),
    });
    var newOffset = offset + len;
    return contentState.merge({
        blockMap: blockMap.set(key, newBlock),
        selectionAfter: selectionState.merge({
            anchorOffset: newOffset,
            focusOffset: newOffset,
        }),
    });
}

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
function modifyBlockForContentState(contentState, selectionState, operation) {
    var startKey = selectionState.getStartKey();
    var endKey = selectionState.getEndKey();
    var blockMap = contentState.getBlockMap();
    var newBlocks = blockMap
        .toSeq()
        .skipUntil(function (_, k) { return k === startKey; })
        .takeUntil(function (_, k) { return k === endKey; })
        .concat(Map([[endKey, blockMap.get(endKey)]]))
        .map(operation);
    return contentState.merge({
        blockMap: blockMap.merge(newBlocks),
        selectionBefore: selectionState,
        selectionAfter: selectionState,
    });
}

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
var getNextDelimiterBlockKey = function (block, blockMap) {
    var isExperimentalTreeBlock = block instanceof ContentBlockNode;
    if (!isExperimentalTreeBlock) {
        return null;
    }
    var nextSiblingKey = block.getNextSiblingKey();
    if (nextSiblingKey) {
        return nextSiblingKey;
    }
    var parent = block.getParentKey();
    if (!parent) {
        return null;
    }
    var nextNonDescendantBlock = blockMap.get(parent);
    while (nextNonDescendantBlock &&
        !nextNonDescendantBlock.getNextSiblingKey()) {
        var parentKey = nextNonDescendantBlock.getParentKey();
        nextNonDescendantBlock = parentKey ? blockMap.get(parentKey) : null;
    }
    if (!nextNonDescendantBlock) {
        return null;
    }
    return nextNonDescendantBlock.getNextSiblingKey();
};

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
var transformBlock = function (key, blockMap, func) {
    if (!key) {
        return;
    }
    var block = blockMap.get(key);
    if (!block) {
        return;
    }
    blockMap.set(key, func(block));
};
/**
 * Ancestors needs to be preserved when there are non selected
 * children to make sure we do not leave any orphans behind
 */
var getAncestorsKeys = function (blockKey, blockMap) {
    var parents = [];
    if (!blockKey) {
        return parents;
    }
    var blockNode = blockMap.get(blockKey);
    while (blockNode && blockNode.getParentKey()) {
        var parentKey = blockNode.getParentKey();
        if (parentKey) {
            parents.push(parentKey);
        }
        blockNode = parentKey ? blockMap.get(parentKey) : null;
    }
    return parents;
};
/**
 * Get all next delimiter keys until we hit a root delimiter and return
 * an array of key references
 */
var getNextDelimitersBlockKeys = function (block, blockMap) {
    var nextDelimiters = [];
    if (!block) {
        return nextDelimiters;
    }
    var nextDelimiter = getNextDelimiterBlockKey(block, blockMap);
    while (nextDelimiter && blockMap.get(nextDelimiter)) {
        var block_1 = blockMap.get(nextDelimiter);
        nextDelimiters.push(nextDelimiter);
        // we do not need to keep checking all root node siblings, just the first occurance
        nextDelimiter = block_1.getParentKey()
            ? getNextDelimiterBlockKey(block_1, blockMap)
            : null;
    }
    return nextDelimiters;
};
var getNextValidSibling = function (block, blockMap, originalBlockMap) {
    if (!block) {
        return null;
    }
    // note that we need to make sure we refer to the original block since this
    // function is called within a withMutations
    var nextValidSiblingKey = originalBlockMap
        .get(block.getKey())
        .getNextSiblingKey();
    while (nextValidSiblingKey && !blockMap.get(nextValidSiblingKey)) {
        nextValidSiblingKey =
            originalBlockMap.get(nextValidSiblingKey).getNextSiblingKey() || null;
    }
    return nextValidSiblingKey;
};
var getPrevValidSibling = function (block, blockMap, originalBlockMap) {
    if (!block) {
        return null;
    }
    // note that we need to make sure we refer to the original block since this
    // function is called within a withMutations
    var prevValidSiblingKey = originalBlockMap
        .get(block.getKey())
        .getPrevSiblingKey();
    while (prevValidSiblingKey && !blockMap.get(prevValidSiblingKey)) {
        prevValidSiblingKey =
            originalBlockMap.get(prevValidSiblingKey).getPrevSiblingKey() || null;
    }
    return prevValidSiblingKey;
};
var updateBlockMapLinks$1 = function (blockMap, startBlock, endBlock, originalBlockMap) {
    return blockMap.withMutations(function (blocks) {
        // update start block if its retained
        transformBlock(startBlock.getKey(), blocks, function (block) {
            return block.merge({
                nextSibling: getNextValidSibling(block, blocks, originalBlockMap),
                prevSibling: getPrevValidSibling(block, blocks, originalBlockMap),
            });
        });
        // update endblock if its retained
        transformBlock(endBlock.getKey(), blocks, function (block) {
            return block.merge({
                nextSibling: getNextValidSibling(block, blocks, originalBlockMap),
                prevSibling: getPrevValidSibling(block, blocks, originalBlockMap),
            });
        });
        // update start block parent ancestors
        getAncestorsKeys(startBlock.getKey(), originalBlockMap).forEach(function (parentKey) {
            return transformBlock(parentKey, blocks, function (block) {
                return block.merge({
                    children: block.getChildKeys().filter(function (key) { return blocks.get(key); }),
                    nextSibling: getNextValidSibling(block, blocks, originalBlockMap),
                    prevSibling: getPrevValidSibling(block, blocks, originalBlockMap),
                });
            });
        });
        // update start block next - can only happen if startBlock == endBlock
        transformBlock(startBlock.getNextSiblingKey(), blocks, function (block) {
            return block.merge({
                prevSibling: startBlock.getPrevSiblingKey(),
            });
        });
        // update start block prev
        transformBlock(startBlock.getPrevSiblingKey(), blocks, function (block) {
            return block.merge({
                nextSibling: getNextValidSibling(block, blocks, originalBlockMap),
            });
        });
        // update end block next
        transformBlock(endBlock.getNextSiblingKey(), blocks, function (block) {
            return block.merge({
                prevSibling: getPrevValidSibling(block, blocks, originalBlockMap),
            });
        });
        // update end block prev
        transformBlock(endBlock.getPrevSiblingKey(), blocks, function (block) {
            return block.merge({
                nextSibling: endBlock.getNextSiblingKey(),
            });
        });
        // update end block parent ancestors
        getAncestorsKeys(endBlock.getKey(), originalBlockMap).forEach(function (parentKey) {
            transformBlock(parentKey, blocks, function (block) {
                return block.merge({
                    children: block.getChildKeys().filter(function (key) { return blocks.get(key); }),
                    nextSibling: getNextValidSibling(block, blocks, originalBlockMap),
                    prevSibling: getPrevValidSibling(block, blocks, originalBlockMap),
                });
            });
        });
        // update next delimiters all the way to a root delimiter
        getNextDelimitersBlockKeys(endBlock, originalBlockMap).forEach(function (delimiterKey) {
            return transformBlock(delimiterKey, blocks, function (block) {
                return block.merge({
                    nextSibling: getNextValidSibling(block, blocks, originalBlockMap),
                    prevSibling: getPrevValidSibling(block, blocks, originalBlockMap),
                });
            });
        });
        // if parent (startBlock) was deleted
        if (blockMap.get(startBlock.getKey()) == null &&
            blockMap.get(endBlock.getKey()) != null &&
            endBlock.getParentKey() === startBlock.getKey() &&
            endBlock.getPrevSiblingKey() == null) {
            var prevSiblingKey_1 = startBlock.getPrevSiblingKey();
            // endBlock becomes next sibling of parent's prevSibling
            transformBlock(endBlock.getKey(), blocks, function (block) {
                return block.merge({
                    prevSibling: prevSiblingKey_1,
                });
            });
            transformBlock(prevSiblingKey_1, blocks, function (block) {
                return block.merge({
                    nextSibling: endBlock.getKey(),
                });
            });
            // Update parent for previous parent's children, and children for that parent
            var prevSibling = prevSiblingKey_1 ? blockMap.get(prevSiblingKey_1) : null;
            var newParentKey_1 = prevSibling ? prevSibling.getParentKey() : null;
            startBlock.getChildKeys().forEach(function (childKey) {
                transformBlock(childKey, blocks, function (block) {
                    return block.merge({
                        parent: newParentKey_1,
                    });
                });
            });
            if (newParentKey_1 != null) {
                var newParent_1 = blockMap.get(newParentKey_1);
                transformBlock(newParentKey_1, blocks, function (block) {
                    return block.merge({
                        children: newParent_1
                            .getChildKeys()
                            .concat(startBlock.getChildKeys()),
                    });
                });
            }
            // last child of deleted parent should point to next sibling
            transformBlock(startBlock.getChildKeys().find(function (key) {
                var block = blockMap.get(key);
                return block.getNextSiblingKey() === null;
            }), blocks, function (block) {
                return block.merge({
                    nextSibling: startBlock.getNextSiblingKey(),
                });
            });
        }
    });
};
var removeRangeFromContentState = function (contentState, selectionState) {
    if (selectionState.isCollapsed()) {
        return contentState;
    }
    var blockMap = contentState.getBlockMap();
    var startKey = selectionState.getStartKey();
    var startOffset = selectionState.getStartOffset();
    var endKey = selectionState.getEndKey();
    var endOffset = selectionState.getEndOffset();
    var startBlock = blockMap.get(startKey);
    var endBlock = blockMap.get(endKey);
    // we assume that ContentBlockNode and ContentBlocks are not mixed together
    var isExperimentalTreeBlock = startBlock instanceof ContentBlockNode;
    // used to retain blocks that should not be deleted to avoid orphan children
    var parentAncestors = [];
    if (isExperimentalTreeBlock) {
        var endBlockchildrenKeys = endBlock.getChildKeys();
        var endBlockAncestors = getAncestorsKeys(endKey, blockMap);
        // endBlock has unselected siblings so we can not remove its ancestors parents
        if (endBlock.getNextSiblingKey()) {
            parentAncestors = parentAncestors.concat(endBlockAncestors);
        }
        // endBlock has children so can not remove this block or any of its ancestors
        if (!endBlockchildrenKeys.isEmpty()) {
            parentAncestors = parentAncestors.concat(endBlockAncestors.concat([endKey]));
        }
        // we need to retain all ancestors of the next delimiter block
        parentAncestors = parentAncestors.concat(getAncestorsKeys(getNextDelimiterBlockKey(endBlock, blockMap), blockMap));
    }
    var characterList;
    if (startBlock === endBlock) {
        characterList = removeFromList(startBlock.getCharacterList(), startOffset, endOffset);
    }
    else {
        characterList = startBlock
            .getCharacterList()
            .slice(0, startOffset)
            .concat(endBlock.getCharacterList().slice(endOffset));
    }
    var modifiedStart = startBlock.merge({
        text: startBlock.getText().slice(0, startOffset) +
            endBlock.getText().slice(endOffset),
        characterList: characterList,
    });
    // If cursor (collapsed) is at the start of the first child, delete parent
    // instead of child
    var shouldDeleteParent = isExperimentalTreeBlock &&
        startOffset === 0 &&
        endOffset === 0 &&
        endBlock.getParentKey() === startKey &&
        endBlock.getPrevSiblingKey() == null;
    var newBlocks = shouldDeleteParent
        ? Map([[startKey, null]])
        : blockMap
            .toSeq()
            .skipUntil(function (_, k) { return k === startKey; })
            .takeUntil(function (_, k) { return k === endKey; })
            .filter(function (_, k) { return parentAncestors.indexOf(k) === -1; })
            .concat(Map([[endKey, null]]))
            .map(function (_, k) {
            return k === startKey ? modifiedStart : null;
        });
    var updatedBlockMap = blockMap.merge(newBlocks).filter(function (block) { return !!block; });
    // Only update tree block pointers if the range is across blocks
    if (isExperimentalTreeBlock && startBlock !== endBlock) {
        updatedBlockMap = updateBlockMapLinks$1(updatedBlockMap, startBlock, endBlock, blockMap);
    }
    return contentState.merge({
        blockMap: updatedBlockMap,
        selectionBefore: selectionState,
        selectionAfter: selectionState.merge({
            anchorKey: startKey,
            anchorOffset: startOffset,
            focusKey: startKey,
            focusOffset: startOffset,
            isBackward: false,
        }),
    });
};
/**
 * Maintain persistence for target list when removing characters on the
 * head and tail of the character list.
 */
var removeFromList = function (targetList, startOffset, endOffset) {
    if (startOffset === 0) {
        while (startOffset < endOffset) {
            targetList = targetList.shift();
            startOffset++;
        }
    }
    else if (endOffset === targetList.count()) {
        while (endOffset > startOffset) {
            targetList = targetList.pop();
            endOffset--;
        }
    }
    else {
        var head = targetList.slice(0, startOffset);
        var tail = targetList.slice(endOffset);
        targetList = head.concat(tail).toList();
    }
    return targetList;
};

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
var transformBlock$1 = function (key, blockMap, func) {
    if (!key) {
        return;
    }
    var block = blockMap.get(key);
    if (!block) {
        return;
    }
    blockMap.set(key, func(block));
};
var updateBlockMapLinks$2 = function (blockMap, originalBlock, belowBlock) {
    return blockMap.withMutations(function (blocks) {
        var originalBlockKey = originalBlock.getKey();
        var belowBlockKey = belowBlock.getKey();
        // update block parent
        transformBlock$1(originalBlock.getParentKey(), blocks, function (block) {
            var parentChildrenList = block.getChildKeys();
            var insertionIndex = parentChildrenList.indexOf(originalBlockKey) + 1;
            var newChildrenArray = parentChildrenList.toArray();
            newChildrenArray.splice(insertionIndex, 0, belowBlockKey);
            return block.merge({
                children: List(newChildrenArray),
            });
        });
        // update original next block
        transformBlock$1(originalBlock.getNextSiblingKey(), blocks, function (block) {
            return block.merge({
                prevSibling: belowBlockKey,
            });
        });
        // update original block
        transformBlock$1(originalBlockKey, blocks, function (block) {
            return block.merge({
                nextSibling: belowBlockKey,
            });
        });
        // update below block
        transformBlock$1(belowBlockKey, blocks, function (block) {
            return block.merge({
                prevSibling: originalBlockKey,
            });
        });
    });
};
var splitBlockInContentState = function (contentState, selectionState) {
    invariant(selectionState.isCollapsed(), 'Selection range must be collapsed.');
    var key = selectionState.getAnchorKey();
    var blockMap = contentState.getBlockMap();
    var blockToSplit = blockMap.get(key);
    var text = blockToSplit.getText();
    if (!text) {
        var blockType = blockToSplit.getType();
        if (blockType === 'unordered-list-item' ||
            blockType === 'ordered-list-item') {
            return modifyBlockForContentState(contentState, selectionState, function (block) {
                return block.merge({ type: 'unstyled', depth: 0 });
            });
        }
    }
    var offset = selectionState.getAnchorOffset();
    var chars = blockToSplit.getCharacterList();
    var keyBelow = generateRandomKey();
    var isExperimentalTreeBlock = blockToSplit instanceof ContentBlockNode;
    var blockAbove = blockToSplit.merge({
        text: text.slice(0, offset),
        characterList: chars.slice(0, offset),
    });
    var blockBelow = blockAbove.merge({
        key: keyBelow,
        text: text.slice(offset),
        characterList: chars.slice(offset),
        data: Map(),
    });
    var blocksBefore = blockMap.toSeq().takeUntil(function (v) { return v === blockToSplit; });
    var blocksAfter = blockMap
        .toSeq()
        .skipUntil(function (v) { return v === blockToSplit; })
        .rest();
    var newBlocks = blocksBefore
        .concat([
        [key, blockAbove],
        [keyBelow, blockBelow],
    ], blocksAfter)
        .toOrderedMap();
    if (isExperimentalTreeBlock) {
        invariant(blockToSplit.getChildKeys().isEmpty(), 'ContentBlockNode must not have children');
        newBlocks = updateBlockMapLinks$2(newBlocks, blockAbove, blockBelow);
    }
    return contentState.merge({
        blockMap: newBlocks,
        selectionBefore: selectionState,
        selectionAfter: selectionState.merge({
            anchorKey: keyBelow,
            anchorOffset: 0,
            focusKey: keyBelow,
            focusOffset: 0,
            isBackward: false,
        }),
    });
};

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
/**
 * `DraftModifier` provides a set of convenience methods that apply
 * modifications to a `ContentState` object based on a target `SelectionState`.
 *
 * Any change to a `ContentState` should be decomposable into a series of
 * transaction functions that apply the re quired changes and return output
 * `ContentState` objects.
 *
 * These functions encapsulate some of the most common transaction sequences.
 */
var DraftModifier = {
    replaceText: function (contentState, rangeToReplace, text, inlineStyle, entityKey) {
        var withoutEntities = removeEntitiesAtEdges(contentState, rangeToReplace);
        var withoutText = removeRangeFromContentState(withoutEntities, rangeToReplace);
        var character = CharacterMetadata.create({
            style: inlineStyle || OrderedSet(),
            entity: entityKey || null,
        });
        return insertTextIntoContentState(withoutText, withoutText.getSelectionAfter(), text, character);
    },
    insertText: function (contentState, targetRange, text, inlineStyle, entityKey) {
        invariant(targetRange.isCollapsed(), 'Target range must be collapsed for `insertText`.');
        return DraftModifier.replaceText(contentState, targetRange, text, inlineStyle, entityKey);
    },
    moveText: function (contentState, removalRange, targetRange) {
        var movedFragment = getContentStateFragment(contentState, removalRange);
        var afterRemoval = DraftModifier.removeRange(contentState, removalRange, 'backward');
        return DraftModifier.replaceWithFragment(afterRemoval, targetRange, movedFragment);
    },
    replaceWithFragment: function (contentState, targetRange, fragment, mergeBlockData) {
        if (mergeBlockData === void 0) { mergeBlockData = 'REPLACE_WITH_NEW_DATA'; }
        var withoutEntities = removeEntitiesAtEdges(contentState, targetRange);
        var withoutText = removeRangeFromContentState(withoutEntities, targetRange);
        return insertFragmentIntoContentState(withoutText, withoutText.getSelectionAfter(), fragment, mergeBlockData);
    },
    removeRange: function (contentState, rangeToRemove, removalDirection) {
        var startKey, endKey, startBlock, endBlock;
        if (rangeToRemove.getIsBackward()) {
            rangeToRemove = rangeToRemove.merge({
                anchorKey: rangeToRemove.getFocusKey(),
                anchorOffset: rangeToRemove.getFocusOffset(),
                focusKey: rangeToRemove.getAnchorKey(),
                focusOffset: rangeToRemove.getAnchorOffset(),
                isBackward: false,
            });
        }
        startKey = rangeToRemove.getAnchorKey();
        endKey = rangeToRemove.getFocusKey();
        startBlock = contentState.getBlockForKey(startKey);
        endBlock = contentState.getBlockForKey(endKey);
        var startOffset = rangeToRemove.getStartOffset();
        var endOffset = rangeToRemove.getEndOffset();
        var startEntityKey = startBlock.getEntityAt(startOffset);
        var endEntityKey = endBlock.getEntityAt(endOffset - 1);
        // Check whether the selection state overlaps with a single entity.
        // If so, try to remove the appropriate substring of the entity text.
        if (startKey === endKey) {
            if (startEntityKey && startEntityKey === endEntityKey) {
                var adjustedRemovalRange = getCharacterRemovalRange(contentState.getEntityMap(), startBlock, endBlock, rangeToRemove, removalDirection);
                return removeRangeFromContentState(contentState, adjustedRemovalRange);
            }
        }
        var withoutEntities = removeEntitiesAtEdges(contentState, rangeToRemove);
        return removeRangeFromContentState(withoutEntities, rangeToRemove);
    },
    splitBlock: function (contentState, selectionState) {
        var withoutEntities = removeEntitiesAtEdges(contentState, selectionState);
        var withoutText = removeRangeFromContentState(withoutEntities, selectionState);
        return splitBlockInContentState(withoutText, withoutText.getSelectionAfter());
    },
    applyInlineStyle: function (contentState, selectionState, inlineStyle) {
        return ContentStateInlineStyle.add(contentState, selectionState, inlineStyle);
    },
    removeInlineStyle: function (contentState, selectionState, inlineStyle) {
        return ContentStateInlineStyle.remove(contentState, selectionState, inlineStyle);
    },
    setBlockType: function (contentState, selectionState, blockType) {
        return modifyBlockForContentState(contentState, selectionState, function (block) {
            return block.merge({ type: blockType, depth: 0 });
        });
    },
    setBlockData: function (contentState, selectionState, blockData) {
        return modifyBlockForContentState(contentState, selectionState, function (block) {
            return block.merge({ data: blockData });
        });
    },
    mergeBlockData: function (contentState, selectionState, blockData) {
        return modifyBlockForContentState(contentState, selectionState, function (block) {
            return block.merge({ data: block.getData().merge(blockData) });
        });
    },
    applyEntity: function (contentState, selectionState, entityKey) {
        var withoutEntities = removeEntitiesAtEdges(contentState, selectionState);
        return applyEntityToContentState(withoutEntities, selectionState, entityKey);
    },
};

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
var returnTrue = function () {
    return true;
};
var defaultLeafRange = {
    start: null,
    end: null,
};
var LeafRange = Record(defaultLeafRange);
var defaultDecoratorRange = {
    start: null,
    end: null,
    decoratorKey: null,
    leaves: null,
};
var DecoratorRange = Record(defaultDecoratorRange);
var BlockTree = {
    /**
     * Generate a block tree for a given ContentBlock/decorator pair.
     */
    generate: function (contentState, block, decorator) {
        var textLength = block.getLength();
        if (!textLength) {
            return List.of(new DecoratorRange({
                start: 0,
                end: 0,
                decoratorKey: null,
                leaves: List.of(new LeafRange({ start: 0, end: 0 })),
            }));
        }
        var leafSets = [];
        var decorations = decorator
            ? decorator.getDecorations(block, contentState)
            : List(Repeat(null, textLength));
        var chars = block.getCharacterList();
        findRangesImmutable(decorations, areEqual, returnTrue, function (start, end) {
            leafSets.push(new DecoratorRange({
                start: start,
                end: end,
                decoratorKey: decorations.get(start),
                leaves: generateLeaves(chars.slice(start, end).toList(), start),
            }));
        });
        return List(leafSets);
    },
};
/**
 * Generate LeafRange records for a given character list.
 */
function generateLeaves(characters, offset) {
    var leaves = [];
    var inlineStyles = characters.map(function (c) { return c.getStyle(); }).toList();
    findRangesImmutable(inlineStyles, areEqual, returnTrue, function (start, end) {
        leaves.push(new LeafRange({
            start: start + offset,
            end: end + offset,
        }));
    });
    return List(leaves);
}
function areEqual(a, b) {
    return a === b;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @legacyServerCallableInstance
 * @format
 * @flow
 * @emails oncall+draft_js
 */
var DraftEntityInstanceRecord = Record({
    type: 'TOKEN',
    mutability: 'IMMUTABLE',
    data: Object,
});
/**
 * An instance of a document entity, consisting of a `type` and relevant
 * `data`, metadata about the entity.
 *
 * For instance, a "link" entity might provide a URI, and a "mention"
 * entity might provide the mentioned user's ID. These pieces of data
 * may be used when rendering the entity as part of a ContentBlock DOM
 * representation. For a link, the data would be used as an href for
 * the rendered anchor. For a mention, the ID could be used to retrieve
 * a hovercard.
 */
var DraftEntityInstance = /** @class */ (function (_super) {
    __extends(DraftEntityInstance, _super);
    function DraftEntityInstance() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DraftEntityInstance.prototype.getType = function () {
        return this.get('type');
    };
    DraftEntityInstance.prototype.getMutability = function () {
        return this.get('mutability');
    };
    DraftEntityInstance.prototype.getData = function () {
        return this.get('data');
    };
    return DraftEntityInstance;
}(DraftEntityInstanceRecord));

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
var instances = Map();
var instanceKey = 0;
/**
 * Temporary utility for generating the warnings
 */
function logWarning(oldMethodCall, newMethodCall) {
    console.warn('WARNING: ' +
        oldMethodCall +
        ' will be deprecated soon!\nPlease use "' +
        newMethodCall +
        '" instead.');
}
/**
 * A "document entity" is an object containing metadata associated with a
 * piece of text in a ContentBlock.
 *
 * For example, a `link` entity might include a `uri` property. When a
 * ContentBlock is rendered in the browser, text that refers to that link
 * entity may be rendered as an anchor, with the `uri` as the href value.
 *
 * In a ContentBlock, every position in the text may correspond to zero
 * or one entities. This correspondence is tracked using a key string,
 * generated via DraftEntity.create() and used to obtain entity metadata
 * via DraftEntity.get().
 */
var DraftEntity = {
    /**
     * WARNING: This method will be deprecated soon!
     * Please use 'contentState.getLastCreatedEntityKey' instead.
     * ---
     * Get the random key string from whatever entity was last created.
     * We need this to support the new API, as part of transitioning to put Entity
     * storage in contentState.
     */
    getLastCreatedEntityKey: function () {
        logWarning('DraftEntity.getLastCreatedEntityKey', 'contentState.getLastCreatedEntityKey');
        return DraftEntity.__getLastCreatedEntityKey();
    },
    /**
     * WARNING: This method will be deprecated soon!
     * Please use 'contentState.createEntity' instead.
     * ---
     * Create a DraftEntityInstance and store it for later retrieval.
     *
     * A random key string will be generated and returned. This key may
     * be used to track the entity's usage in a ContentBlock, and for
     * retrieving data about the entity at render time.
     */
    create: function (type, mutability, data) {
        logWarning('DraftEntity.create', 'contentState.createEntity');
        return DraftEntity.__create(type, mutability, data);
    },
    /**
     * WARNING: This method will be deprecated soon!
     * Please use 'contentState.addEntity' instead.
     * ---
     * Add an existing DraftEntityInstance to the DraftEntity map. This is
     * useful when restoring instances from the server.
     */
    add: function (instance) {
        logWarning('DraftEntity.add', 'contentState.addEntity');
        return DraftEntity.__add(instance);
    },
    /**
     * WARNING: This method will be deprecated soon!
     * Please use 'contentState.getEntity' instead.
     * ---
     * Retrieve the entity corresponding to the supplied key string.
     */
    get: function (key) {
        logWarning('DraftEntity.get', 'contentState.getEntity');
        return DraftEntity.__get(key);
    },
    /**
     * WARNING: This method will be deprecated soon!
     * Please use 'contentState.mergeEntityData' instead.
     * ---
     * Entity instances are immutable. If you need to update the data for an
     * instance, this method will merge your data updates and return a new
     * instance.
     */
    mergeData: function (key, toMerge) {
        logWarning('DraftEntity.mergeData', 'contentState.mergeEntityData');
        return DraftEntity.__mergeData(key, toMerge);
    },
    /**
     * WARNING: This method will be deprecated soon!
     * Please use 'contentState.replaceEntityData' instead.
     * ---
     * Completely replace the data for a given instance.
     */
    replaceData: function (key, newData) {
        logWarning('DraftEntity.replaceData', 'contentState.replaceEntityData');
        return DraftEntity.__replaceData(key, newData);
    },
    // ***********************************WARNING******************************
    // --- the above public API will be deprecated in the next version of Draft!
    // The methods below this line are private - don't call them directly.
    /**
     * Get the random key string from whatever entity was last created.
     * We need this to support the new API, as part of transitioning to put Entity
     * storage in contentState.
     */
    __getLastCreatedEntityKey: function () {
        return '' + instanceKey;
    },
    /**
     * Create a DraftEntityInstance and store it for later retrieval.
     *
     * A random key string will be generated and returned. This key may
     * be used to track the entity's usage in a ContentBlock, and for
     * retrieving data about the entity at render time.
     */
    __create: function (type, mutability, data) {
        return DraftEntity.__add(new DraftEntityInstance({ type: type, mutability: mutability, data: data || {} }));
    },
    /**
     * Add an existing DraftEntityInstance to the DraftEntity map. This is
     * useful when restoring instances from the server.
     */
    __add: function (instance) {
        var key = '' + ++instanceKey;
        instances = instances.set(key, instance);
        return key;
    },
    /**
     * Retrieve the entity corresponding to the supplied key string.
     */
    __get: function (key) {
        var instance = instances.get(key);
        invariant(!!instance, 'Unknown DraftEntity key: %s.', key);
        return instance;
    },
    /**
     * Entity instances are immutable. If you need to update the data for an
     * instance, this method will merge your data updates and return a new
     * instance.
     */
    __mergeData: function (key, toMerge) {
        var instance = DraftEntity.__get(key);
        var newData = __assign(__assign({}, instance.getData()), toMerge);
        var newInstance = instance.set('data', newData);
        instances = instances.set(key, newInstance);
        return newInstance;
    },
    /**
     * Completely replace the data for a given instance.
     */
    __replaceData: function (key, newData) {
        var instance = DraftEntity.__get(key);
        var newInstance = instance.set('data', newData);
        instances = instances.set(key, newInstance);
        return newInstance;
    },
};

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
var defaultRecord$3 = {
    anchorKey: '',
    anchorOffset: 0,
    focusKey: '',
    focusOffset: 0,
    isBackward: false,
    hasFocus: false,
};
/* $FlowFixMe This comment suppresses an error found when automatically adding
 * a type annotation with the codemod Komodo/Annotate_exports. To see the error
 * delete this comment and run Flow. */
var SelectionStateRecord = Record(defaultRecord$3);
var SelectionState = /** @class */ (function (_super) {
    __extends(SelectionState, _super);
    function SelectionState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectionState.prototype.serialize = function () {
        return ('Anchor: ' +
            this.getAnchorKey() +
            ':' +
            this.getAnchorOffset() +
            ', ' +
            'Focus: ' +
            this.getFocusKey() +
            ':' +
            this.getFocusOffset() +
            ', ' +
            'Is Backward: ' +
            String(this.getIsBackward()) +
            ', ' +
            'Has Focus: ' +
            String(this.getHasFocus()));
    };
    SelectionState.prototype.getAnchorKey = function () {
        return this.get('anchorKey');
    };
    SelectionState.prototype.getAnchorOffset = function () {
        return this.get('anchorOffset');
    };
    SelectionState.prototype.getFocusKey = function () {
        return this.get('focusKey');
    };
    SelectionState.prototype.getFocusOffset = function () {
        return this.get('focusOffset');
    };
    SelectionState.prototype.getIsBackward = function () {
        return this.get('isBackward');
    };
    SelectionState.prototype.getHasFocus = function () {
        return this.get('hasFocus');
    };
    /**
     * Return whether the specified range overlaps with an edge of the
     * SelectionState.
     */
    SelectionState.prototype.hasEdgeWithin = function (blockKey, start, end) {
        var anchorKey = this.getAnchorKey();
        var focusKey = this.getFocusKey();
        if (anchorKey === focusKey && anchorKey === blockKey) {
            var selectionStart = this.getStartOffset();
            var selectionEnd = this.getEndOffset();
            return ((start <= selectionStart && selectionStart <= end) || // selectionStart is between start and end, or
                (start <= selectionEnd && selectionEnd <= end) // selectionEnd is between start and end
            );
        }
        if (blockKey !== anchorKey && blockKey !== focusKey) {
            return false;
        }
        var offsetToCheck = blockKey === anchorKey ? this.getAnchorOffset() : this.getFocusOffset();
        return start <= offsetToCheck && end >= offsetToCheck;
    };
    SelectionState.prototype.isCollapsed = function () {
        return (this.getAnchorKey() === this.getFocusKey() &&
            this.getAnchorOffset() === this.getFocusOffset());
    };
    SelectionState.prototype.getStartKey = function () {
        return this.getIsBackward() ? this.getFocusKey() : this.getAnchorKey();
    };
    SelectionState.prototype.getStartOffset = function () {
        return this.getIsBackward()
            ? this.getFocusOffset()
            : this.getAnchorOffset();
    };
    SelectionState.prototype.getEndKey = function () {
        return this.getIsBackward() ? this.getAnchorKey() : this.getFocusKey();
    };
    SelectionState.prototype.getEndOffset = function () {
        return this.getIsBackward()
            ? this.getAnchorOffset()
            : this.getFocusOffset();
    };
    SelectionState.createEmpty = function (key) {
        return new SelectionState({
            anchorKey: key,
            anchorOffset: 0,
            focusKey: key,
            focusOffset: 0,
            isBackward: false,
            hasFocus: false,
        });
    };
    return SelectionState;
}(SelectionStateRecord));

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict
 */
// window['draft_tree_data_support'] = true;
function gkx (name) {
    if (typeof window !== 'undefined' && window.__DRAFT_GKX) {
        return !!window.__DRAFT_GKX[name];
    }
    return false;
}

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
var REGEX_BLOCK_DELIMITER = new RegExp('\r', 'g');
function sanitizeDraftText(input) {
    return input.replace(REGEX_BLOCK_DELIMITER, '');
}

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
var defaultRecord$4 = {
    entityMap: null,
    blockMap: null,
    selectionBefore: null,
    selectionAfter: null,
};
var ContentStateRecord = Record(defaultRecord$4);
var ContentState = /** @class */ (function (_super) {
    __extends(ContentState, _super);
    function ContentState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContentState.prototype.getEntityMap = function () {
        // TODO: update this when we fully remove DraftEntity
        return DraftEntity;
    };
    ContentState.prototype.getBlockMap = function () {
        return this.get('blockMap');
    };
    ContentState.prototype.getSelectionBefore = function () {
        return this.get('selectionBefore');
    };
    ContentState.prototype.getSelectionAfter = function () {
        return this.get('selectionAfter');
    };
    ContentState.prototype.getBlockForKey = function (key) {
        var block = this.getBlockMap().get(key);
        return block;
    };
    ContentState.prototype.getKeyBefore = function (key) {
        return this.getBlockMap()
            .reverse()
            .keySeq()
            .skipUntil(function (v) { return v === key; })
            .skip(1)
            .first();
    };
    ContentState.prototype.getKeyAfter = function (key) {
        return this.getBlockMap()
            .keySeq()
            .skipUntil(function (v) { return v === key; })
            .skip(1)
            .first();
    };
    ContentState.prototype.getBlockAfter = function (key) {
        return this.getBlockMap()
            .skipUntil(function (_, k) { return k === key; })
            .skip(1)
            .first();
    };
    ContentState.prototype.getBlockBefore = function (key) {
        return this.getBlockMap()
            .reverse()
            .skipUntil(function (_, k) { return k === key; })
            .skip(1)
            .first();
    };
    ContentState.prototype.getBlocksAsArray = function () {
        return this.getBlockMap().toArray();
    };
    ContentState.prototype.getFirstBlock = function () {
        return this.getBlockMap().first();
    };
    ContentState.prototype.getLastBlock = function () {
        return this.getBlockMap().last();
    };
    ContentState.prototype.getPlainText = function (delimiter) {
        return this.getBlockMap()
            .map(function (block) {
            return block ? block.getText() : '';
        })
            .join(delimiter || '\n');
    };
    ContentState.prototype.getLastCreatedEntityKey = function () {
        // TODO: update this when we fully remove DraftEntity
        return DraftEntity.__getLastCreatedEntityKey();
    };
    ContentState.prototype.hasText = function () {
        var blockMap = this.getBlockMap();
        return (blockMap.size > 1 ||
            // make sure that there are no zero width space chars
            escape(blockMap.first().getText()).replace(/%u200B/g, '').length > 0);
    };
    ContentState.prototype.createEntity = function (type, mutability, data) {
        // TODO: update this when we fully remove DraftEntity
        DraftEntity.__create(type, mutability, data);
        return this;
    };
    ContentState.prototype.mergeEntityData = function (key, toMerge) {
        // TODO: update this when we fully remove DraftEntity
        DraftEntity.__mergeData(key, toMerge);
        return this;
    };
    ContentState.prototype.replaceEntityData = function (key, newData) {
        // TODO: update this when we fully remove DraftEntity
        DraftEntity.__replaceData(key, newData);
        return this;
    };
    ContentState.prototype.addEntity = function (instance) {
        // TODO: update this when we fully remove DraftEntity
        DraftEntity.__add(instance);
        return this;
    };
    ContentState.prototype.getEntity = function (key) {
        // TODO: update this when we fully remove DraftEntity
        return DraftEntity.__get(key);
    };
    ContentState.createFromBlockArray = function (
    // TODO: update flow type when we completely deprecate the old entity API
    blocks, entityMap) {
        // TODO: remove this when we completely deprecate the old entity API
        var theBlocks = Array.isArray(blocks) ? blocks : blocks.contentBlocks;
        var blockMap = BlockMapBuilder.createFromArray(theBlocks);
        var selectionState = blockMap.isEmpty()
            ? new SelectionState()
            : SelectionState.createEmpty(blockMap.first().getKey());
        return new ContentState({
            blockMap: blockMap,
            entityMap: entityMap || DraftEntity,
            selectionBefore: selectionState,
            selectionAfter: selectionState,
        });
    };
    ContentState.createFromText = function (text, delimiter) {
        if (delimiter === void 0) { delimiter = /\r\n?|\n/g; }
        var strings = text.split(delimiter);
        var blocks = strings.map(function (block) {
            block = sanitizeDraftText(block);
            var ContentBlockNodeRecord = gkx('draft_tree_data_support')
                ? ContentBlockNode
                : ContentBlock;
            return new ContentBlockNodeRecord({
                key: generateRandomKey(),
                text: block,
                type: 'unstyled',
                characterList: List(Repeat(CharacterMetadata.EMPTY, block.length)),
            });
        });
        return ContentState.createFromBlockArray(blocks);
    };
    return ContentState;
}(ContentStateRecord));

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
var bidiService;
var EditorBidiService = {
    getDirectionMap: function (content, prevBidiMap) {
        if (!bidiService) {
            bidiService = new UnicodeBidiService();
        }
        else {
            bidiService.reset();
        }
        var blockMap = content.getBlockMap();
        var nextBidi = blockMap
            .valueSeq()
            .map(function (block) { return nullthrows(bidiService).getDirection(block.getText()); });
        var bidiMap = OrderedMap(blockMap.keySeq().zip(nextBidi));
        if (prevBidiMap != null && is(prevBidiMap, bidiMap)) {
            return prevBidiMap;
        }
        return bidiMap;
    },
};

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
var defaultRecord$5 = {
    allowUndo: true,
    currentContent: null,
    decorator: null,
    directionMap: null,
    forceSelection: false,
    inCompositionMode: false,
    inlineStyleOverride: null,
    lastChangeType: null,
    nativelyRenderedContent: null,
    redoStack: Stack(),
    selection: null,
    treeMap: null,
    undoStack: Stack(),
};
var EditorStateRecord = Record(defaultRecord$5);
var EditorState = /** @class */ (function () {
    /**
     * Not for public consumption.
     */
    function EditorState(immutable) {
        this._immutable = immutable;
    }
    EditorState.createEmpty = function (decorator) {
        return EditorState.createWithContent(ContentState.createFromText(''), decorator);
    };
    EditorState.createWithContent = function (contentState, decorator) {
        if (contentState.getBlockMap().count() === 0) {
            return EditorState.createEmpty(decorator);
        }
        var firstKey = contentState
            .getBlockMap()
            .first()
            .getKey();
        return EditorState.create({
            currentContent: contentState,
            undoStack: Stack(),
            redoStack: Stack(),
            decorator: decorator || null,
            selection: SelectionState.createEmpty(firstKey),
        });
    };
    EditorState.create = function (config) {
        var currentContent = config.currentContent, decorator = config.decorator;
        var recordConfig = __assign(__assign({}, config), { treeMap: generateNewTreeMap(currentContent, decorator), directionMap: EditorBidiService.getDirectionMap(currentContent) });
        return new EditorState(new EditorStateRecord(recordConfig));
    };
    EditorState.set = function (editorState, put) {
        var map = editorState.getImmutable().withMutations(function (state) {
            var existingDecorator = state.get('decorator');
            var decorator = existingDecorator;
            if (put.decorator === null) {
                decorator = null;
            }
            else if (put.decorator) {
                decorator = put.decorator;
            }
            var newContent = put.currentContent || editorState.getCurrentContent();
            if (decorator !== existingDecorator) {
                var treeMap = state.get('treeMap');
                var newTreeMap = void 0;
                if (decorator && existingDecorator) {
                    newTreeMap = regenerateTreeForNewDecorator(newContent, newContent.getBlockMap(), treeMap, decorator, existingDecorator);
                }
                else {
                    newTreeMap = generateNewTreeMap(newContent, decorator);
                }
                state.merge({
                    decorator: decorator,
                    treeMap: newTreeMap,
                    nativelyRenderedContent: null,
                });
                return;
            }
            var existingContent = editorState.getCurrentContent();
            if (newContent !== existingContent) {
                state.set('treeMap', regenerateTreeForNewBlocks(editorState, newContent.getBlockMap(), newContent.getEntityMap(), decorator));
            }
            state.merge(put);
        });
        return new EditorState(map);
    };
    EditorState.prototype.toJS = function () {
        return this.getImmutable().toJS();
    };
    EditorState.prototype.getAllowUndo = function () {
        return this.getImmutable().get('allowUndo');
    };
    EditorState.prototype.getCurrentContent = function () {
        return this.getImmutable().get('currentContent');
    };
    EditorState.prototype.getUndoStack = function () {
        return this.getImmutable().get('undoStack');
    };
    EditorState.prototype.getRedoStack = function () {
        return this.getImmutable().get('redoStack');
    };
    EditorState.prototype.getSelection = function () {
        return this.getImmutable().get('selection');
    };
    EditorState.prototype.getDecorator = function () {
        return this.getImmutable().get('decorator');
    };
    EditorState.prototype.isInCompositionMode = function () {
        return this.getImmutable().get('inCompositionMode');
    };
    EditorState.prototype.mustForceSelection = function () {
        return this.getImmutable().get('forceSelection');
    };
    EditorState.prototype.getNativelyRenderedContent = function () {
        return this.getImmutable().get('nativelyRenderedContent');
    };
    EditorState.prototype.getLastChangeType = function () {
        return this.getImmutable().get('lastChangeType');
    };
    /**
     * While editing, the user may apply inline style commands with a collapsed
     * cursor, intending to type text that adopts the specified style. In this
     * case, we track the specified style as an "override" that takes precedence
     * over the inline style of the text adjacent to the cursor.
     *
     * If null, there is no override in place.
     */
    EditorState.prototype.getInlineStyleOverride = function () {
        return this.getImmutable().get('inlineStyleOverride');
    };
    EditorState.setInlineStyleOverride = function (editorState, inlineStyleOverride) {
        return EditorState.set(editorState, { inlineStyleOverride: inlineStyleOverride });
    };
    /**
     * Get the appropriate inline style for the editor state. If an
     * override is in place, use it. Otherwise, the current style is
     * based on the location of the selection state.
     */
    EditorState.prototype.getCurrentInlineStyle = function () {
        var override = this.getInlineStyleOverride();
        if (override != null) {
            return override;
        }
        var content = this.getCurrentContent();
        var selection = this.getSelection();
        if (selection.isCollapsed()) {
            return getInlineStyleForCollapsedSelection(content, selection);
        }
        return getInlineStyleForNonCollapsedSelection(content, selection);
    };
    EditorState.prototype.getBlockTree = function (blockKey) {
        return this.getImmutable().getIn(['treeMap', blockKey]);
    };
    EditorState.prototype.isSelectionAtStartOfContent = function () {
        var firstKey = this.getCurrentContent()
            .getBlockMap()
            .first()
            .getKey();
        return this.getSelection().hasEdgeWithin(firstKey, 0, 0);
    };
    EditorState.prototype.isSelectionAtEndOfContent = function () {
        var content = this.getCurrentContent();
        var blockMap = content.getBlockMap();
        var last = blockMap.last();
        var end = last.getLength();
        return this.getSelection().hasEdgeWithin(last.getKey(), end, end);
    };
    EditorState.prototype.getDirectionMap = function () {
        return this.getImmutable().get('directionMap');
    };
    /**
     * Incorporate native DOM selection changes into the EditorState. This
     * method can be used when we simply want to accept whatever the DOM
     * has given us to represent selection, and we do not need to re-render
     * the editor.
     *
     * To forcibly move the DOM selection, see `EditorState.forceSelection`.
     */
    EditorState.acceptSelection = function (editorState, selection) {
        return updateSelection(editorState, selection, false);
    };
    /**
     * At times, we need to force the DOM selection to be where we
     * need it to be. This can occur when the anchor or focus nodes
     * are non-text nodes, for instance. In this case, we want to trigger
     * a re-render of the editor, which in turn forces selection into
     * the correct place in the DOM. The `forceSelection` method
     * accomplishes this.
     *
     * This method should be used in cases where you need to explicitly
     * move the DOM selection from one place to another without a change
     * in ContentState.
     */
    EditorState.forceSelection = function (editorState, selection) {
        if (!selection.getHasFocus()) {
            selection = selection.set('hasFocus', true);
        }
        return updateSelection(editorState, selection, true);
    };
    /**
     * Move selection to the end of the editor without forcing focus.
     */
    EditorState.moveSelectionToEnd = function (editorState) {
        var content = editorState.getCurrentContent();
        var lastBlock = content.getLastBlock();
        var lastKey = lastBlock.getKey();
        var length = lastBlock.getLength();
        return EditorState.acceptSelection(editorState, new SelectionState({
            anchorKey: lastKey,
            anchorOffset: length,
            focusKey: lastKey,
            focusOffset: length,
            isBackward: false,
        }));
    };
    /**
     * Force focus to the end of the editor. This is useful in scenarios
     * where we want to programmatically focus the input and it makes sense
     * to allow the user to continue working seamlessly.
     */
    EditorState.moveFocusToEnd = function (editorState) {
        var afterSelectionMove = EditorState.moveSelectionToEnd(editorState);
        return EditorState.forceSelection(afterSelectionMove, afterSelectionMove.getSelection());
    };
    /**
     * Push the current ContentState onto the undo stack if it should be
     * considered a boundary state, and set the provided ContentState as the
     * new current content.
     */
    EditorState.push = function (editorState, contentState, changeType, forceSelection) {
        if (forceSelection === void 0) { forceSelection = true; }
        if (editorState.getCurrentContent() === contentState) {
            return editorState;
        }
        var directionMap = EditorBidiService.getDirectionMap(contentState, editorState.getDirectionMap());
        if (!editorState.getAllowUndo()) {
            return EditorState.set(editorState, {
                currentContent: contentState,
                directionMap: directionMap,
                lastChangeType: changeType,
                selection: contentState.getSelectionAfter(),
                forceSelection: forceSelection,
                inlineStyleOverride: null,
            });
        }
        var selection = editorState.getSelection();
        var currentContent = editorState.getCurrentContent();
        var undoStack = editorState.getUndoStack();
        var newContent = contentState;
        if (selection !== currentContent.getSelectionAfter() ||
            mustBecomeBoundary(editorState, changeType)) {
            undoStack = undoStack.push(currentContent);
            newContent = newContent.set('selectionBefore', selection);
        }
        else if (changeType === 'insert-characters' ||
            changeType === 'backspace-character' ||
            changeType === 'delete-character') {
            // Preserve the previous selection.
            newContent = newContent.set('selectionBefore', currentContent.getSelectionBefore());
        }
        var inlineStyleOverride = editorState.getInlineStyleOverride();
        // Don't discard inline style overrides for the following change types:
        var overrideChangeTypes = [
            'adjust-depth',
            'change-block-type',
            'split-block',
        ];
        if (overrideChangeTypes.indexOf(changeType) === -1) {
            inlineStyleOverride = null;
        }
        var editorStateChanges = {
            currentContent: newContent,
            directionMap: directionMap,
            undoStack: undoStack,
            redoStack: Stack(),
            lastChangeType: changeType,
            selection: contentState.getSelectionAfter(),
            forceSelection: forceSelection,
            inlineStyleOverride: inlineStyleOverride,
        };
        return EditorState.set(editorState, editorStateChanges);
    };
    /**
     * Make the top ContentState in the undo stack the new current content and
     * push the current content onto the redo stack.
     */
    EditorState.undo = function (editorState) {
        if (!editorState.getAllowUndo()) {
            return editorState;
        }
        var undoStack = editorState.getUndoStack();
        var newCurrentContent = undoStack.peek();
        if (!newCurrentContent) {
            return editorState;
        }
        var currentContent = editorState.getCurrentContent();
        var directionMap = EditorBidiService.getDirectionMap(newCurrentContent, editorState.getDirectionMap());
        return EditorState.set(editorState, {
            currentContent: newCurrentContent,
            directionMap: directionMap,
            undoStack: undoStack.shift(),
            redoStack: editorState.getRedoStack().push(currentContent),
            forceSelection: true,
            inlineStyleOverride: null,
            lastChangeType: 'undo',
            nativelyRenderedContent: null,
            selection: currentContent.getSelectionBefore(),
        });
    };
    /**
     * Make the top ContentState in the redo stack the new current content and
     * push the current content onto the undo stack.
     */
    EditorState.redo = function (editorState) {
        if (!editorState.getAllowUndo()) {
            return editorState;
        }
        var redoStack = editorState.getRedoStack();
        var newCurrentContent = redoStack.peek();
        if (!newCurrentContent) {
            return editorState;
        }
        var currentContent = editorState.getCurrentContent();
        var directionMap = EditorBidiService.getDirectionMap(newCurrentContent, editorState.getDirectionMap());
        return EditorState.set(editorState, {
            currentContent: newCurrentContent,
            directionMap: directionMap,
            undoStack: editorState.getUndoStack().push(currentContent),
            redoStack: redoStack.shift(),
            forceSelection: true,
            inlineStyleOverride: null,
            lastChangeType: 'redo',
            nativelyRenderedContent: null,
            selection: newCurrentContent.getSelectionAfter(),
        });
    };
    /**
     * Not for public consumption.
     */
    EditorState.prototype.getImmutable = function () {
        return this._immutable;
    };
    return EditorState;
}());
/**
 * Set the supplied SelectionState as the new current selection, and set
 * the `force` flag to trigger manual selection placement by the view.
 */
function updateSelection(editorState, selection, forceSelection) {
    return EditorState.set(editorState, {
        selection: selection,
        forceSelection: forceSelection,
        nativelyRenderedContent: null,
        inlineStyleOverride: null,
    });
}
/**
 * Regenerate the entire tree map for a given ContentState and decorator.
 * Returns an OrderedMap that maps all available ContentBlock objects.
 */
function generateNewTreeMap(contentState, decorator) {
    return contentState
        .getBlockMap()
        .map(function (block) { return BlockTree.generate(contentState, block, decorator); })
        .toOrderedMap();
}
/**
 * Regenerate tree map objects for all ContentBlocks that have changed
 * between the current editorState and newContent. Returns an OrderedMap
 * with only changed regenerated tree map objects.
 */
function regenerateTreeForNewBlocks(editorState, newBlockMap, newEntityMap, decorator) {
    var contentState = editorState
        .getCurrentContent()
        .set('entityMap', newEntityMap);
    var prevBlockMap = contentState.getBlockMap();
    var prevTreeMap = editorState.getImmutable().get('treeMap');
    return prevTreeMap.merge(newBlockMap
        .toSeq()
        .filter(function (block, key) { return block !== prevBlockMap.get(key); })
        .map(function (block) { return BlockTree.generate(contentState, block, decorator); }));
}
/**
 * Generate tree map objects for a new decorator object, preserving any
 * decorations that are unchanged from the previous decorator.
 *
 * Note that in order for this to perform optimally, decoration Lists for
 * decorators should be preserved when possible to allow for direct immutable
 * List comparison.
 */
function regenerateTreeForNewDecorator(content, blockMap, previousTreeMap, decorator, existingDecorator) {
    return previousTreeMap.merge(blockMap
        .toSeq()
        .filter(function (block) {
        return (decorator.getDecorations(block, content) !==
            existingDecorator.getDecorations(block, content));
    })
        .map(function (block) { return BlockTree.generate(content, block, decorator); }));
}
/**
 * Return whether a change should be considered a boundary state, given
 * the previous change type. Allows us to discard potential boundary states
 * during standard typing or deletion behavior.
 */
function mustBecomeBoundary(editorState, changeType) {
    var lastChangeType = editorState.getLastChangeType();
    return (changeType !== lastChangeType ||
        (changeType !== 'insert-characters' &&
            changeType !== 'backspace-character' &&
            changeType !== 'delete-character'));
}
function getInlineStyleForCollapsedSelection(content, selection) {
    var startKey = selection.getStartKey();
    var startOffset = selection.getStartOffset();
    var startBlock = content.getBlockForKey(startKey);
    // If the cursor is not at the start of the block, look backward to
    // preserve the style of the preceding character.
    if (startOffset > 0) {
        return startBlock.getInlineStyleAt(startOffset - 1);
    }
    // The caret is at position zero in this block. If the block has any
    // text at all, use the style of the first character.
    if (startBlock.getLength()) {
        return startBlock.getInlineStyleAt(0);
    }
    // Otherwise, look upward in the document to find the closest character.
    return lookUpwardForInlineStyle(content, startKey);
}
function getInlineStyleForNonCollapsedSelection(content, selection) {
    var startKey = selection.getStartKey();
    var startOffset = selection.getStartOffset();
    var startBlock = content.getBlockForKey(startKey);
    // If there is a character just inside the selection, use its style.
    if (startOffset < startBlock.getLength()) {
        return startBlock.getInlineStyleAt(startOffset);
    }
    // Check if the selection at the end of a non-empty block. Use the last
    // style in the block.
    if (startOffset > 0) {
        return startBlock.getInlineStyleAt(startOffset - 1);
    }
    // Otherwise, look upward in the document to find the closest character.
    return lookUpwardForInlineStyle(content, startKey);
}
function lookUpwardForInlineStyle(content, fromKey) {
    var lastNonEmpty = content
        .getBlockMap()
        .reverse()
        .skipUntil(function (_, k) { return k === fromKey; })
        .skip(1)
        .skipUntil(function (block, _) { return block.getLength(); })
        .first();
    if (lastNonEmpty) {
        return lastNonEmpty.getInlineStyleAt(lastNonEmpty.getLength() - 1);
    }
    return OrderedSet();
}

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
var transformBlock$2 = function (key, blockMap, func) {
    if (!key) {
        return;
    }
    var block = blockMap.get(key);
    if (!block) {
        return;
    }
    blockMap.set(key, func(block));
};
var updateBlockMapLinks$3 = function (blockMap, originalBlockToBeMoved, originalTargetBlock, insertionMode, isExperimentalTreeBlock) {
    if (!isExperimentalTreeBlock) {
        return blockMap;
    }
    // possible values of 'insertionMode' are: 'after', 'before'
    var isInsertedAfterTarget = insertionMode === 'after';
    var originalBlockKey = originalBlockToBeMoved.getKey();
    var originalTargetKey = originalTargetBlock.getKey();
    var originalParentKey = originalBlockToBeMoved.getParentKey();
    var originalNextSiblingKey = originalBlockToBeMoved.getNextSiblingKey();
    var originalPrevSiblingKey = originalBlockToBeMoved.getPrevSiblingKey();
    var newParentKey = originalTargetBlock.getParentKey();
    var newNextSiblingKey = isInsertedAfterTarget
        ? originalTargetBlock.getNextSiblingKey()
        : originalTargetKey;
    var newPrevSiblingKey = isInsertedAfterTarget
        ? originalTargetKey
        : originalTargetBlock.getPrevSiblingKey();
    return blockMap.withMutations(function (blocks) {
        // update old parent
        transformBlock$2(originalParentKey, blocks, function (block) {
            var parentChildrenList = block.getChildKeys();
            return block.merge({
                children: parentChildrenList["delete"](parentChildrenList.indexOf(originalBlockKey)),
            });
        });
        // update old prev
        transformBlock$2(originalPrevSiblingKey, blocks, function (block) {
            return block.merge({
                nextSibling: originalNextSiblingKey,
            });
        });
        // update old next
        transformBlock$2(originalNextSiblingKey, blocks, function (block) {
            return block.merge({
                prevSibling: originalPrevSiblingKey,
            });
        });
        // update new next
        transformBlock$2(newNextSiblingKey, blocks, function (block) {
            return block.merge({
                prevSibling: originalBlockKey,
            });
        });
        // update new prev
        transformBlock$2(newPrevSiblingKey, blocks, function (block) {
            return block.merge({
                nextSibling: originalBlockKey,
            });
        });
        // update new parent
        transformBlock$2(newParentKey, blocks, function (block) {
            var newParentChildrenList = block.getChildKeys();
            var targetBlockIndex = newParentChildrenList.indexOf(originalTargetKey);
            var insertionIndex = isInsertedAfterTarget
                ? targetBlockIndex + 1
                : targetBlockIndex !== 0
                    ? targetBlockIndex - 1
                    : 0;
            var newChildrenArray = newParentChildrenList.toArray();
            newChildrenArray.splice(insertionIndex, 0, originalBlockKey);
            return block.merge({
                children: List(newChildrenArray),
            });
        });
        // update block
        transformBlock$2(originalBlockKey, blocks, function (block) {
            return block.merge({
                nextSibling: newNextSiblingKey,
                prevSibling: newPrevSiblingKey,
                parent: newParentKey,
            });
        });
    });
};
var moveBlockInContentState = function (contentState, blockToBeMoved, targetBlock, insertionMode) {
    invariant(insertionMode !== 'replace', 'Replacing blocks is not supported.');
    var targetKey = targetBlock.getKey();
    var blockKey = blockToBeMoved.getKey();
    invariant(blockKey !== targetKey, 'Block cannot be moved next to itself.');
    var blockMap = contentState.getBlockMap();
    var isExperimentalTreeBlock = blockToBeMoved instanceof ContentBlockNode;
    var blocksToBeMoved = [blockToBeMoved];
    var blockMapWithoutBlocksToBeMoved = blockMap["delete"](blockKey);
    if (isExperimentalTreeBlock) {
        blocksToBeMoved = [];
        blockMapWithoutBlocksToBeMoved = blockMap.withMutations(function (blocks) {
            var nextSiblingKey = blockToBeMoved.getNextSiblingKey();
            var nextDelimiterBlockKey = getNextDelimiterBlockKey(blockToBeMoved, blocks);
            blocks
                .toSeq()
                .skipUntil(function (block) { return block.getKey() === blockKey; })
                .takeWhile(function (block) {
                var key = block.getKey();
                var isBlockToBeMoved = key === blockKey;
                var hasNextSiblingAndIsNotNextSibling = nextSiblingKey && key !== nextSiblingKey;
                var doesNotHaveNextSiblingAndIsNotDelimiter = !nextSiblingKey &&
                    block.getParentKey() &&
                    (!nextDelimiterBlockKey || key !== nextDelimiterBlockKey);
                return !!(isBlockToBeMoved ||
                    hasNextSiblingAndIsNotNextSibling ||
                    doesNotHaveNextSiblingAndIsNotDelimiter);
            })
                .forEach(function (block) {
                blocksToBeMoved.push(block);
                blocks["delete"](block.getKey());
            });
        });
    }
    var blocksBefore = blockMapWithoutBlocksToBeMoved
        .toSeq()
        .takeUntil(function (v) { return v === targetBlock; });
    var blocksAfter = blockMapWithoutBlocksToBeMoved
        .toSeq()
        .skipUntil(function (v) { return v === targetBlock; })
        .skip(1);
    var slicedBlocks = blocksToBeMoved.map(function (block) { return [block.getKey(), block]; });
    var newBlocks = OrderedMap();
    if (insertionMode === 'before') {
        var blockBefore = contentState.getBlockBefore(targetKey);
        invariant(!blockBefore || blockBefore.getKey() !== blockToBeMoved.getKey(), 'Block cannot be moved next to itself.');
        newBlocks = blocksBefore
            .concat(__spreadArrays(slicedBlocks, [[targetKey, targetBlock]]), blocksAfter)
            .toOrderedMap();
    }
    else if (insertionMode === 'after') {
        var blockAfter = contentState.getBlockAfter(targetKey);
        invariant(!blockAfter || blockAfter.getKey() !== blockKey, 'Block cannot be moved next to itself.');
        newBlocks = blocksBefore
            .concat(__spreadArrays([[targetKey, targetBlock]], slicedBlocks), blocksAfter)
            .toOrderedMap();
    }
    return contentState.merge({
        blockMap: updateBlockMapLinks$3(newBlocks, blockToBeMoved, targetBlock, insertionMode, isExperimentalTreeBlock),
        selectionBefore: contentState.getSelectionAfter(),
        selectionAfter: contentState.getSelectionAfter().merge({
            anchorKey: blockKey,
            focusKey: blockKey,
        }),
    });
};

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
var experimentalTreeDataSupport = gkx('draft_tree_data_support');
var ContentBlockRecord$1 = experimentalTreeDataSupport
    ? ContentBlockNode
    : ContentBlock;
var AtomicBlockUtils = {
    insertAtomicBlock: function (editorState, entityKey, character) {
        var contentState = editorState.getCurrentContent();
        var selectionState = editorState.getSelection();
        var afterRemoval = DraftModifier.removeRange(contentState, selectionState, 'backward');
        var targetSelection = afterRemoval.getSelectionAfter();
        var afterSplit = DraftModifier.splitBlock(afterRemoval, targetSelection);
        var insertionTarget = afterSplit.getSelectionAfter();
        var asAtomicBlock = DraftModifier.setBlockType(afterSplit, insertionTarget, 'atomic');
        var charData = CharacterMetadata.create({ entity: entityKey });
        var atomicBlockConfig = {
            key: generateRandomKey(),
            type: 'atomic',
            text: character,
            characterList: List(Repeat(charData, character.length)),
        };
        var atomicDividerBlockConfig = {
            key: generateRandomKey(),
            type: 'unstyled',
        };
        if (experimentalTreeDataSupport) {
            atomicBlockConfig = __assign(__assign({}, atomicBlockConfig), { nextSibling: atomicDividerBlockConfig.key });
            atomicDividerBlockConfig = __assign(__assign({}, atomicDividerBlockConfig), { prevSibling: atomicBlockConfig.key });
        }
        var fragmentArray = [
            new ContentBlockRecord$1(atomicBlockConfig),
            new ContentBlockRecord$1(atomicDividerBlockConfig),
        ];
        var fragment = BlockMapBuilder.createFromArray(fragmentArray);
        var withAtomicBlock = DraftModifier.replaceWithFragment(asAtomicBlock, insertionTarget, fragment);
        var newContent = withAtomicBlock.merge({
            selectionBefore: selectionState,
            selectionAfter: withAtomicBlock.getSelectionAfter().set('hasFocus', true),
        });
        return EditorState.push(editorState, newContent, 'insert-fragment');
    },
    moveAtomicBlock: function (editorState, atomicBlock, targetRange, insertionMode) {
        var contentState = editorState.getCurrentContent();
        var selectionState = editorState.getSelection();
        var withMovedAtomicBlock;
        if (insertionMode === 'before' || insertionMode === 'after') {
            var targetBlock = contentState.getBlockForKey(insertionMode === 'before'
                ? targetRange.getStartKey()
                : targetRange.getEndKey());
            withMovedAtomicBlock = moveBlockInContentState(contentState, atomicBlock, targetBlock, insertionMode);
        }
        else {
            var afterRemoval = DraftModifier.removeRange(contentState, targetRange, 'backward');
            var selectionAfterRemoval = afterRemoval.getSelectionAfter();
            var targetBlock = afterRemoval.getBlockForKey(selectionAfterRemoval.getFocusKey());
            if (selectionAfterRemoval.getStartOffset() === 0) {
                withMovedAtomicBlock = moveBlockInContentState(afterRemoval, atomicBlock, targetBlock, 'before');
            }
            else if (selectionAfterRemoval.getEndOffset() === targetBlock.getLength()) {
                withMovedAtomicBlock = moveBlockInContentState(afterRemoval, atomicBlock, targetBlock, 'after');
            }
            else {
                var afterSplit = DraftModifier.splitBlock(afterRemoval, selectionAfterRemoval);
                var selectionAfterSplit = afterSplit.getSelectionAfter();
                var targetBlock_1 = afterSplit.getBlockForKey(selectionAfterSplit.getFocusKey());
                withMovedAtomicBlock = moveBlockInContentState(afterSplit, atomicBlock, targetBlock_1, 'before');
            }
        }
        var newContent = withMovedAtomicBlock.merge({
            selectionBefore: selectionState,
            selectionAfter: withMovedAtomicBlock
                .getSelectionAfter()
                .set('hasFocus', true),
        });
        return EditorState.push(editorState, newContent, 'move-block');
    },
};

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
var DELIMITER = ".";
/**
 * A CompositeDraftDecorator traverses through a list of DraftDecorator
 * instances to identify sections of a ContentBlock that should be rendered
 * in a "decorated" manner. For example, hashtags, mentions, and links may
 * be intended to stand out visually, be rendered as anchors, etc.
 *
 * The list of decorators supplied to the constructor will be used in the
 * order they are provided. This allows the caller to specify a priority for
 * string matching, in case of match collisions among decorators.
 *
 * For instance, I may have a link with a `#` in its text. Though this section
 * of text may match our hashtag decorator, it should not be treated as a
 * hashtag. I should therefore list my link DraftDecorator
 * before my hashtag DraftDecorator when constructing this composite
 * decorator instance.
 *
 * Thus, when a collision like this is encountered, the earlier match is
 * preserved and the new match is discarded.
 */
var CompositeDraftDecorator = /** @class */ (function () {
    function CompositeDraftDecorator(decorators) {
        // Copy the decorator array, since we use this array order to determine
        // precedence of decoration matching. If the array is mutated externally,
        // we don't want to be affected here.
        this._decorators = decorators.slice();
    }
    CompositeDraftDecorator.prototype.getDecorations = function (block, contentState) {
        var decorations = Array(block.getText().length).fill(null);
        this._decorators.forEach(function (/*object*/ decorator, /*number*/ ii) {
            var counter = 0;
            var strategy = decorator.strategy;
            var callback = function (/*number*/ start, /*number*/ end) {
                // Find out if any of our matching range is already occupied
                // by another decorator. If so, discard the match. Otherwise, store
                // the component key for rendering.
                if (canOccupySlice(decorations, start, end)) {
                    occupySlice(decorations, start, end, ii + DELIMITER + counter);
                    counter++;
                }
            };
            strategy(block, callback, contentState);
        });
        return List(decorations);
    };
    CompositeDraftDecorator.prototype.getComponentForKey = function (key) {
        var componentKey = parseInt(key.split(DELIMITER)[0], 10);
        return this._decorators[componentKey].component;
    };
    CompositeDraftDecorator.prototype.getPropsForKey = function (key) {
        var componentKey = parseInt(key.split(DELIMITER)[0], 10);
        return this._decorators[componentKey].props;
    };
    return CompositeDraftDecorator;
}());
/**
 * Determine whether we can occupy the specified slice of the decorations
 * array.
 */
function canOccupySlice(decorations, start, end) {
    for (var ii = start; ii < end; ii++) {
        if (decorations[ii] != null) {
            return false;
        }
    }
    return true;
}
/**
 * Splice the specified component into our decoration array at the desired
 * range.
 */
function occupySlice(targetArr, start, end, componentKey) {
    for (var ii = start; ii < end; ii++) {
        targetArr[ii] = componentKey;
    }
}

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
var UL_WRAP = React.createElement("ul", { className: cx('public/DraftStyleDefault/ul') });
var OL_WRAP = React.createElement("ol", { className: cx('public/DraftStyleDefault/ol') });
var PRE_WRAP = React.createElement("pre", { className: cx('public/DraftStyleDefault/pre') });
var DefaultDraftBlockRenderMap = Map({
    'header-one': {
        element: 'h1',
    },
    'header-two': {
        element: 'h2',
    },
    'header-three': {
        element: 'h3',
    },
    'header-four': {
        element: 'h4',
    },
    'header-five': {
        element: 'h5',
    },
    'header-six': {
        element: 'h6',
    },
    section: {
        element: 'section',
    },
    article: {
        element: 'article',
    },
    'unordered-list-item': {
        element: 'li',
        wrapper: UL_WRAP,
    },
    'ordered-list-item': {
        element: 'li',
        wrapper: OL_WRAP,
    },
    blockquote: {
        element: 'blockquote',
    },
    atomic: {
        element: 'figure',
    },
    'code-block': {
        element: 'pre',
        wrapper: PRE_WRAP,
    },
    unstyled: {
        element: 'div',
        aliasedElements: ['p'],
    },
});

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
var DefaultDraftInlineStyle = {
    BOLD: {
        fontWeight: 'bold',
    },
    CODE: {
        fontFamily: 'monospace',
        wordWrap: 'break-word',
    },
    ITALIC: {
        fontStyle: 'italic',
    },
    STRIKETHROUGH: {
        textDecoration: 'line-through',
    },
    UNDERLINE: {
        textDecoration: 'underline',
    },
};

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
function getCorrectDocumentFromNode(node) {
    if (!node || !node.ownerDocument) {
        return document;
    }
    return node.ownerDocument;
}

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
function isElement(node) {
    if (!node || !node.ownerDocument) {
        return false;
    }
    return node.nodeType === Node.ELEMENT_NODE;
}

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
function getSelectionOffsetKeyForNode(node) {
    if (isElement(node)) {
        var castedNode = node;
        var offsetKey = castedNode.getAttribute('data-offset-key');
        if (offsetKey) {
            return offsetKey;
        }
        for (var ii = 0; ii < castedNode.childNodes.length; ii++) {
            var childOffsetKey = getSelectionOffsetKeyForNode(castedNode.childNodes[ii]);
            if (childOffsetKey) {
                return childOffsetKey;
            }
        }
    }
    return null;
}

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
/**
 * Get the key from the node's nearest offset-aware ancestor.
 */
function findAncestorOffsetKey(node) {
    var searchNode = node;
    while (searchNode &&
        searchNode !== getCorrectDocumentFromNode(node).documentElement) {
        var key = getSelectionOffsetKeyForNode(searchNode);
        if (key != null) {
            return key;
        }
        searchNode = searchNode.parentNode;
    }
    return null;
}

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
function getWindowForNode(node) {
    if (!node || !node.ownerDocument || !node.ownerDocument.defaultView) {
        return window;
    }
    return node.ownerDocument.defaultView;
}

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
// Heavily based on Prosemirror's DOMObserver https://github.com/ProseMirror/prosemirror-view/blob/master/src/domobserver.js
var DOM_OBSERVER_OPTIONS = {
    subtree: true,
    characterData: true,
    childList: true,
    characterDataOldValue: false,
    attributes: false,
};
// IE11 has very broken mutation observers, so we also listen to DOMCharacterDataModified
var USE_CHAR_DATA = UserAgent.isBrowser('IE <= 11');
var DOMObserver = /** @class */ (function () {
    function DOMObserver(container) {
        var _this = this;
        this.container = container;
        this.mutations = Map();
        var containerWindow = getWindowForNode(container);
        if (containerWindow.MutationObserver && !USE_CHAR_DATA) {
            this.observer = new containerWindow.MutationObserver(function (mutations) {
                return _this.registerMutations(mutations);
            });
        }
        else {
            this.onCharData = function (e) {
                invariant(e.target instanceof Node, 'Expected target to be an instance of Node');
                _this.registerMutation({
                    type: 'characterData',
                    target: e.target,
                });
            };
        }
    }
    DOMObserver.prototype.start = function () {
        if (this.observer) {
            this.observer.observe(this.container, DOM_OBSERVER_OPTIONS);
        }
        else {
            /* $FlowFixMe(>=0.68.0 site=www,mobile) This event type is not defined
             * by Flow's standard library */
            this.container.addEventListener('DOMCharacterDataModified', this.onCharData);
        }
    };
    DOMObserver.prototype.stopAndFlushMutations = function () {
        var observer = this.observer;
        if (observer) {
            this.registerMutations(observer.takeRecords());
            observer.disconnect();
        }
        else {
            /* $FlowFixMe(>=0.68.0 site=www,mobile) This event type is not defined
             * by Flow's standard library */
            this.container.removeEventListener('DOMCharacterDataModified', this.onCharData);
        }
        var mutations = this.mutations;
        this.mutations = Map();
        return mutations;
    };
    DOMObserver.prototype.registerMutations = function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
            this.registerMutation(mutations[i]);
        }
    };
    DOMObserver.prototype.getMutationTextContent = function (mutation) {
        var type = mutation.type, target = mutation.target, removedNodes = mutation.removedNodes;
        if (type === 'characterData') {
            // When `textContent` is '', there is a race condition that makes
            // getting the offsetKey from the target not possible.
            // These events are also followed by a `childList`, which is the one
            // we are able to retrieve the offsetKey and apply the '' text.
            if (target.textContent !== '') {
                return target.textContent;
            }
        }
        else if (type === 'childList') {
            if (removedNodes && removedNodes.length) {
                // `characterData` events won't happen or are ignored when
                // removing the last character of a leaf node, what happens
                // instead is a `childList` event with a `removedNodes` array.
                // For this case the textContent should be '' and
                // `DraftModifier.replaceText` will make sure the content is
                // updated properly.
                return '';
            }
            else if (target.textContent !== '') {
                // Typing Chinese in an empty block in MS Edge results in a
                // `childList` event with non-empty textContent.
                // See https://github.com/facebook/draft-js/issues/2082
                return target.textContent;
            }
        }
        return null;
    };
    DOMObserver.prototype.registerMutation = function (mutation) {
        var textContent = this.getMutationTextContent(mutation);
        if (textContent != null) {
            var offsetKey = nullthrows(findAncestorOffsetKey(mutation.target));
            this.mutations = this.mutations.set(offsetKey, textContent);
        }
    };
    return DOMObserver;
}());

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
var KEY_DELIMITER = '-';
var DraftOffsetKey = {
    encode: function (blockKey, decoratorKey, leafKey) {
        return blockKey + KEY_DELIMITER + decoratorKey + KEY_DELIMITER + leafKey;
    },
    decode: function (offsetKey) {
        // Extracts the last two parts of offsetKey and captures the rest in blockKeyParts
        var _a = offsetKey
            .split(KEY_DELIMITER)
            .reverse(), leafKey = _a[0], decoratorKey = _a[1], blockKeyParts = _a.slice(2);
        return {
            // Recomposes the parts of blockKey after reversing them
            blockKey: blockKeyParts.reverse().join(KEY_DELIMITER),
            decoratorKey: parseInt(decoratorKey, 10),
            leafKey: parseInt(leafKey, 10),
        };
    },
};

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var DraftJsDebugLogging = {
    logBlockedSelectionEvent: function (o) { return null; },
    logSelectionStateFailure: function (o) { return null; },
};

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
function isHTMLElement(node) {
    if (!node || !node.ownerDocument) {
        return false;
    }
    if (!node.ownerDocument.defaultView) {
        return node instanceof HTMLElement;
    }
    if (node instanceof node.ownerDocument.defaultView.HTMLElement) {
        return true;
    }
    return false;
}

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
function getContentEditableContainer(editor) {
    var editorNode = ReactDOM.findDOMNode(editor.editorContainer);
    invariant(editorNode, 'Missing editorNode');
    invariant(isHTMLElement(editorNode.firstChild), 'editorNode.firstChild is not an HTMLElement');
    var htmlElement = editorNode.firstChild;
    return htmlElement;
}

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
function getUpdatedSelectionState(editorState, anchorKey, anchorOffset, focusKey, focusOffset) {
    var selection = nullthrows(editorState.getSelection());
    if (window['__DEV__']) {
        if (!anchorKey || !focusKey) {
            /* eslint-disable-next-line */
            console.warn('Invalid selection state.', arguments, editorState.toJS());
            return selection;
        }
    }
    var anchorPath = DraftOffsetKey.decode(anchorKey);
    var anchorBlockKey = anchorPath.blockKey;
    var anchorLeaf = editorState
        .getBlockTree(anchorBlockKey)
        .getIn([anchorPath.decoratorKey, 'leaves', anchorPath.leafKey]);
    var focusPath = DraftOffsetKey.decode(focusKey);
    var focusBlockKey = focusPath.blockKey;
    var focusLeaf = editorState
        .getBlockTree(focusBlockKey)
        .getIn([focusPath.decoratorKey, 'leaves', focusPath.leafKey]);
    if (!anchorLeaf || !focusLeaf) {
        // If we cannot make sense of the updated selection state, stick to the current one.
        if (window['__DEV__']) {
            /* eslint-disable-next-line */
            console.warn('Invalid selection state.', arguments, editorState.toJS());
        }
        return selection;
    }
    var anchorLeafStart = anchorLeaf.get('start');
    var focusLeafStart = focusLeaf.get('start');
    var anchorBlockOffset = anchorLeaf ? anchorLeafStart + anchorOffset : null;
    var focusBlockOffset = focusLeaf ? focusLeafStart + focusOffset : null;
    var areEqual = selection.getAnchorKey() === anchorBlockKey &&
        selection.getAnchorOffset() === anchorBlockOffset &&
        selection.getFocusKey() === focusBlockKey &&
        selection.getFocusOffset() === focusBlockOffset;
    if (areEqual) {
        return selection;
    }
    var isBackward = false;
    if (anchorBlockKey === focusBlockKey) {
        var anchorLeafEnd = anchorLeaf.get('end');
        var focusLeafEnd = focusLeaf.get('end');
        if (focusLeafStart === anchorLeafStart && focusLeafEnd === anchorLeafEnd) {
            isBackward = focusOffset < anchorOffset;
        }
        else {
            isBackward = focusLeafStart < anchorLeafStart;
        }
    }
    else {
        var startKey = editorState
            .getCurrentContent()
            .getBlockMap()
            .keySeq()
            .skipUntil(function (v) { return v === anchorBlockKey || v === focusBlockKey; })
            .first();
        isBackward = startKey === focusBlockKey;
    }
    return selection.merge({
        anchorKey: anchorBlockKey,
        anchorOffset: anchorBlockOffset,
        focusKey: focusBlockKey,
        focusOffset: focusBlockOffset,
        isBackward: isBackward,
    });
}

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
/**
 * Convert the current selection range to an anchor/focus pair of offset keys
 * and values that can be interpreted by components.
 */
function getDraftEditorSelectionWithNodes(editorState, root, anchorNode, anchorOffset, focusNode, focusOffset) {
    var anchorIsTextNode = anchorNode.nodeType === Node.TEXT_NODE;
    var focusIsTextNode = focusNode.nodeType === Node.TEXT_NODE;
    // If the selection range lies only on text nodes, the task is simple.
    // Find the nearest offset-aware elements and use the
    // offset values supplied by the selection range.
    if (anchorIsTextNode && focusIsTextNode) {
        // if(anchorNode.parentElement.isContentEditable === false) {
        //   anchorOffset = 1;
        // }
        // if(focusNode.parentElement.isContentEditable === false) {
        //   focusOffset = 1;
        // }
        return {
            selectionState: getUpdatedSelectionState(editorState, nullthrows(findAncestorOffsetKey(anchorNode)), anchorOffset, nullthrows(findAncestorOffsetKey(focusNode)), focusOffset),
            needsRecovery: false
        };
    }
    var anchorPoint = null;
    var focusPoint = null;
    var needsRecovery = true;
    // An element is selected. Convert this selection range into leaf offset
    // keys and offset values for consumption at the component level. This
    // is common in Firefox, where select-all and triple click behavior leads
    // to entire elements being selected.
    //
    // Note that we use the `needsRecovery` parameter in the callback here. This
    // is because when certain elements are selected, the behavior for subsequent
    // cursor movement (e.g. via arrow keys) is uncertain and may not match
    // expectations at the component level. For example, if an entire <div> is
    // selected and the user presses the right arrow, Firefox keeps the selection
    // on the <div>. If we allow subsequent keypresses to insert characters
    // natively, they will be inserted into a browser-created text node to the
    // right of that <div>. This is obviously undesirable.
    //
    // With the `needsRecovery` flag, we inform the caller that it is responsible
    // for manually setting the selection state on the rendered document to
    // ensure proper selection state maintenance.
    if (anchorIsTextNode) {
        // if(anchorNode.parentElement.isContentEditable === false) {
        //   anchorOffset = 1;
        // }
        anchorPoint = {
            key: nullthrows(findAncestorOffsetKey(anchorNode)),
            offset: anchorOffset
        };
        focusPoint = getPointForNonTextNode(root, focusNode, focusOffset);
    }
    else if (focusIsTextNode) {
        // if(focusNode.parentElement.isContentEditable === false) {
        //   focusOffset = 1;
        // }
        focusPoint = {
            key: nullthrows(findAncestorOffsetKey(focusNode)),
            offset: focusOffset
        };
        anchorPoint = getPointForNonTextNode(root, anchorNode, anchorOffset);
    }
    else {
        anchorPoint = getPointForNonTextNode(root, anchorNode, anchorOffset);
        focusPoint = getPointForNonTextNode(root, focusNode, focusOffset);
        // If the selection is collapsed on an empty block, don't force recovery.
        // This way, on arrow key selection changes, the browser can move the
        // cursor from a non-zero offset on one block, through empty blocks,
        // to a matching non-zero offset on other text blocks.
        if (anchorNode === focusNode && anchorOffset === focusOffset) {
            needsRecovery = !!anchorNode.firstChild && anchorNode.firstChild.nodeName !== "BR";
        }
    }
    return {
        selectionState: getUpdatedSelectionState(editorState, anchorPoint.key, anchorPoint.offset, focusPoint.key, focusPoint.offset),
        needsRecovery: needsRecovery
    };
}
/**
 * Identify the first leaf descendant for the given node.
 */
function getFirstLeaf(node) {
    while (node.firstChild &&
        // data-blocks has no offset
        ((isElement(node.firstChild) && node.firstChild.getAttribute("data-blocks") === "true") || getSelectionOffsetKeyForNode(node.firstChild))) {
        node = node.firstChild;
    }
    return node;
}
/**
 * Identify the last leaf descendant for the given node.
 */
function getLastLeaf(node) {
    while (node.lastChild &&
        // data-blocks has no offset
        ((isElement(node.lastChild) && node.lastChild.getAttribute("data-blocks") === "true") || getSelectionOffsetKeyForNode(node.lastChild))) {
        node = node.lastChild;
    }
    return node;
}
function getPointForNonTextNode(editorRoot, startNode, childOffset) {
    var node = startNode;
    var offsetKey = findAncestorOffsetKey(node);
    invariant(offsetKey != null || (editorRoot && (editorRoot === node || editorRoot.firstChild === node)), "Unknown node in selection range.");
    // If the editorRoot is the selection, step downward into the content
    // wrapper.
    if (editorRoot === node) {
        node = node.firstChild;
        invariant(isElement(node), "Invalid DraftEditorContents node.");
        var castedNode = node;
        // assignment only added for flow :/
        // otherwise it throws in line 200 saying that node can be null or undefined
        node = castedNode;
        invariant(node.getAttribute("data-contents") === "true", "Invalid DraftEditorContents structure.");
        if (childOffset > 0) {
            childOffset = node.childNodes.length;
        }
    }
    // If the child offset is zero and we have an offset key, we're done.
    // If there's no offset key because the entire editor is selected,
    // find the leftmost ("first") leaf in the tree and use that as the offset
    // key.
    if (childOffset === 0) {
        var key = null;
        if (offsetKey != null) {
            key = offsetKey;
        }
        else {
            var firstLeaf = getFirstLeaf(node);
            key = nullthrows(getSelectionOffsetKeyForNode(firstLeaf));
        }
        return { key: key, offset: 0 };
    }
    var nodeBeforeCursor = node.childNodes[childOffset - 1];
    var leafKey = null;
    var textLength = null;
    if (!getSelectionOffsetKeyForNode(nodeBeforeCursor)) {
        // Our target node may be a leaf or a text node, in which case we're
        // already where we want to be and can just use the child's length as
        // our offset.
        leafKey = nullthrows(offsetKey);
        textLength = getTextContentLength(nodeBeforeCursor);
    }
    else {
        // Otherwise, we'll look at the child to the left of the cursor and find
        // the last leaf node in its subtree.
        var lastLeaf = getLastLeaf(nodeBeforeCursor);
        leafKey = nullthrows(getSelectionOffsetKeyForNode(lastLeaf));
        textLength = getTextContentLength(lastLeaf);
    }
    // gland
    if (startNode && startNode.dataset.text === "object") {
        textLength = 1;
    }
    return {
        key: leafKey,
        offset: textLength
    };
}
/**
 * Return the length of a node's textContent, regarding single newline
 * characters as zero-length. This allows us to avoid problems with identifying
 * the correct selection offset for empty blocks in IE, in which we
 * render newlines instead of break tags.
 */
function getTextContentLength(node) {
    // gland
    if (!node.isContentEditable)
        return 1;
    var textContent = node.textContent;
    return textContent === "\n" ? 0 : textContent.length;
}

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
/**
 * Convert the current selection range to an anchor/focus pair of offset keys
 * and values that can be interpreted by components.
 */
function getDraftEditorSelection(editorState, root) {
    var selection = root.ownerDocument.defaultView.getSelection();
    //console.log('sele get', selection)
    // No active selection.
    if (selection.rangeCount === 0) {
        return {
            selectionState: editorState.getSelection().set('hasFocus', false),
            needsRecovery: false,
        };
    }
    return getDraftEditorSelectionWithNodes(editorState, root, selection.anchorNode, selection.anchorOffset, selection.focusNode, selection.focusOffset);
}

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
// @ts-ignore
function editOnSelect(editor, event) {
    if (editor._blockSelectEvents ||
        editor._latestEditorState !== editor.props.editorState) {
        if (editor._blockSelectEvents) {
            var editorState_1 = editor.props.editorState;
            var selectionState = editorState_1.getSelection();
            DraftJsDebugLogging.logBlockedSelectionEvent({
                // For now I don't think we need any other info
                anonymizedDom: 'N/A',
                extraParams: JSON.stringify({ stacktrace: new Error().stack }),
                selectionState: JSON.stringify(selectionState.toJS()),
            });
        }
        return;
    }
    var editorState = editor.props.editorState;
    var documentSelection = getDraftEditorSelection(editorState, getContentEditableContainer(editor));
    var updatedSelectionState = documentSelection.selectionState;
    //event.persist()
    //console.log('selectionState', editorState.getSelection().toJS(), event)
    if (updatedSelectionState !== editorState.getSelection()) {
        if (documentSelection.needsRecovery) {
            editorState = EditorState.forceSelection(editorState, updatedSelectionState);
        }
        else {
            editorState = EditorState.acceptSelection(editorState, updatedSelectionState);
        }
        editor.update(editorState);
    }
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Provides utilities for handling draftjs keys.
 *
 * @emails oncall+draft_js
 * @flow strict-local
 * @format
 */
function notEmptyKey(key) {
    return key != null && key != '';
}

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
/**
 * Return the entity key that should be used when inserting text for the
 * specified target selection, only if the entity is `MUTABLE`. `IMMUTABLE`
 * and `SEGMENTED` entities should not be used for insertion behavior.
 */
function getEntityKeyForSelection(contentState, targetSelection) {
    var entityKey;
    if (targetSelection.isCollapsed()) {
        var key = targetSelection.getAnchorKey();
        var offset = targetSelection.getAnchorOffset();
        if (offset > 0) {
            entityKey = contentState.getBlockForKey(key).getEntityAt(offset - 1);
            if (entityKey !== contentState.getBlockForKey(key).getEntityAt(offset)) {
                return null;
            }
            return filterKey(contentState.getEntityMap(), entityKey);
        }
        return null;
    }
    var startKey = targetSelection.getStartKey();
    var startOffset = targetSelection.getStartOffset();
    var startBlock = contentState.getBlockForKey(startKey);
    entityKey =
        startOffset === startBlock.getLength()
            ? null
            : startBlock.getEntityAt(startOffset);
    return filterKey(contentState.getEntityMap(), entityKey);
}
/**
 * Determine whether an entity key corresponds to a `MUTABLE` entity. If so,
 * return it. If not, return null.
 */
function filterKey(entityMap, entityKey) {
    if (notEmptyKey(entityKey)) {
        var entity = entityMap.__get(entityKey);
        return entity.getMutability() === 'MUTABLE' ? entityKey : null;
    }
    return null;
}

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
/**
 * Millisecond delay to allow `compositionstart` to fire again upon
 * `compositionend`.
 *
 * This is used for Korean input to ensure that typing can continue without
 * the editor trying to render too quickly. More specifically, Safari 7.1+
 * triggers `compositionstart` a little slower than Chrome/FF, which
 * leads to composed characters being resolved and re-render occurring
 * sooner than we want.
 */
var RESOLVE_DELAY = 20;
/**
 * A handful of variables used to track the current composition and its
 * resolution status. These exist at the module level because it is not
 * possible to have compositions occurring in multiple editors simultaneously,
 * and it simplifies state management with respect to the DraftEditor component.
 */
var resolved = false;
var stillComposing = false;
var domObserver = null;
function startDOMObserver(editor) {
    if (!domObserver) {
        domObserver = new DOMObserver(getContentEditableContainer(editor));
        domObserver.start();
    }
}
var DraftEditorCompositionHandler = {
    /**
     * A `compositionstart` event has fired while we're still in composition
     * mode. Continue the current composition session to prevent a re-render.
     */
    onCompositionStart: function (editor) {
        stillComposing = true;
        startDOMObserver(editor);
    },
    /**
     * Attempt to end the current composition session.
     *
     * Defer handling because browser will still insert the chars into active
     * element after `compositionend`. If a `compositionstart` event fires
     * before `resolveComposition` executes, our composition session will
     * continue.
     *
     * The `resolved` flag is useful because certain IME interfaces fire the
     * `compositionend` event multiple times, thus queueing up multiple attempts
     * at handling the composition. Since handling the same composition event
     * twice could break the DOM, we only use the first event. Example: Arabic
     * Google Input Tools on Windows 8.1 fires `compositionend` three times.
     */
    onCompositionEnd: function (editor) {
        resolved = false;
        stillComposing = false;
        setTimeout(function () {
            if (!resolved) {
                DraftEditorCompositionHandler.resolveComposition(editor);
            }
        }, RESOLVE_DELAY);
    },
    onSelect: editOnSelect,
    /**
     * In Safari, keydown events may fire when committing compositions. If
     * the arrow keys are used to commit, prevent default so that the cursor
     * doesn't move, otherwise it will jump back noticeably on re-render.
     */
    onKeyDown: function (editor, e) {
        if (!stillComposing) {
            // If a keydown event is received after compositionend but before the
            // 20ms timer expires (ex: type option-E then backspace, or type A then
            // backspace in 2-Set Korean), we should immediately resolve the
            // composition and reinterpret the key press in edit mode.
            DraftEditorCompositionHandler.resolveComposition(editor);
            editor._onKeyDown(e);
            return;
        }
        if (e.which === Keys.RIGHT || e.which === Keys.LEFT) {
            e.preventDefault();
        }
    },
    /**
     * Keypress events may fire when committing compositions. In Firefox,
     * pressing RETURN commits the composition and inserts extra newline
     * characters that we do not want. `preventDefault` allows the composition
     * to be committed while preventing the extra characters.
     */
    onKeyPress: function (editor, e) {
        if (e.which === Keys.RETURN) {
            e.preventDefault();
        }
    },
    /**
     * Attempt to insert composed characters into the document.
     *
     * If we are still in a composition session, do nothing. Otherwise, insert
     * the characters into the document and terminate the composition session.
     *
     * If no characters were composed -- for instance, the user
     * deleted all composed characters and committed nothing new --
     * force a re-render. We also re-render when the composition occurs
     * at the beginning of a leaf, to ensure that if the browser has
     * created a new text node for the composition, we will discard it.
     *
     * Resetting innerHTML will move focus to the beginning of the editor,
     * so we update to force it back to the correct place.
     */
    resolveComposition: function (editor) {
        if (stillComposing) {
            return;
        }
        var mutations = nullthrows(domObserver).stopAndFlushMutations();
        domObserver = null;
        resolved = true;
        var editorState = EditorState.set(editor._latestEditorState, {
            inCompositionMode: false,
        });
        editor.exitCurrentMode();
        if (!mutations.size) {
            editor.update(editorState);
            return;
        }
        // TODO, check if Facebook still needs this flag or if it could be removed.
        // Since there can be multiple mutations providing a `composedChars` doesn't
        // apply well on this new model.
        // if (
        //   gkx('draft_handlebeforeinput_composed_text') &&
        //   editor.props.handleBeforeInput &&
        //   isEventHandled(
        //     editor.props.handleBeforeInput(
        //       composedChars,
        //       editorState,
        //       event.timeStamp,
        //     ),
        //   )
        // ) {
        //   return;
        // }
        var contentState = editorState.getCurrentContent();
        mutations.forEach(function (composedChars, offsetKey) {
            var _a = DraftOffsetKey.decode(offsetKey), blockKey = _a.blockKey, decoratorKey = _a.decoratorKey, leafKey = _a.leafKey;
            var _b = editorState
                .getBlockTree(blockKey)
                .getIn([decoratorKey, 'leaves', leafKey]), start = _b.start, end = _b.end;
            var replacementRange = editorState.getSelection().merge({
                anchorKey: blockKey,
                focusKey: blockKey,
                anchorOffset: start,
                focusOffset: end,
                isBackward: false,
            });
            var entityKey = getEntityKeyForSelection(contentState, replacementRange);
            var currentStyle = contentState
                .getBlockForKey(blockKey)
                .getInlineStyleAt(start);
            contentState = DraftModifier.replaceText(contentState, replacementRange, composedChars, currentStyle, entityKey);
            // We need to update the editorState so the leaf node ranges are properly
            // updated and multiple mutations are correctly applied.
            editorState = EditorState.set(editorState, {
                currentContent: contentState,
            });
        });
        // When we apply the text changes to the ContentState, the selection always
        // goes to the end of the field, but it should just stay where it is
        // after compositionEnd.
        var documentSelection = getDraftEditorSelection(editorState, getContentEditableContainer(editor));
        var compositionEndSelectionState = documentSelection.selectionState;
        editor.restoreEditorDOM();
        var editorStateWithUpdatedSelection = EditorState.acceptSelection(editorState, compositionEndSelectionState);
        editor.update(EditorState.push(editorStateWithUpdatedSelection, contentState, 'insert-characters'));
    },
};

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
var DraftEditorDecoratedLeaves = /** @class */ (function (_super) {
    __extends(DraftEditorDecoratedLeaves, _super);
    function DraftEditorDecoratedLeaves() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DraftEditorDecoratedLeaves.prototype.render = function () {
        var _a = this.props, block = _a.block, children = _a.children, contentState = _a.contentState, decorator = _a.decorator, decoratorKey = _a.decoratorKey, direction = _a.direction, leafSet = _a.leafSet, text = _a.text;
        var blockKey = block.getKey();
        var leavesForLeafSet = leafSet.get('leaves');
        var DecoratorComponent = decorator.getComponentForKey(decoratorKey);
        var decoratorProps = decorator.getPropsForKey(decoratorKey);
        var decoratorOffsetKey = DraftOffsetKey.encode(blockKey, parseInt(decoratorKey, 10), 0);
        var decoratedText = text.slice(leavesForLeafSet.first().get('start'), leavesForLeafSet.last().get('end'));
        // Resetting dir to the same value on a child node makes Chrome/Firefox
        // confused on cursor movement. See http://jsfiddle.net/d157kLck/3/
        var dir = UnicodeBidiDirection.getHTMLDirIfDifferent(UnicodeBidi.getDirection(decoratedText), direction);
        return (React.createElement(DecoratorComponent, __assign({}, decoratorProps, { contentState: contentState, decoratedText: decoratedText, dir: dir, key: decoratorOffsetKey, entityKey: block.getEntityAt(leafSet.get('start')), offsetKey: decoratorOffsetKey }), children));
    };
    return DraftEditorDecoratedLeaves;
}(React.Component));

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
// In IE, spans with <br> tags render as two newlines. By rendering a span
// with only a newline character, we can be sure to render a single line.
var useNewlineChar = UserAgent.isBrowser('IE <= 11');
/**
 * Check whether the node should be considered a newline.
 */
function isNewline(node) {
    return useNewlineChar ? node.textContent === '\n' : node.tagName === 'BR';
}
/**
 * Placeholder elements for empty text content.
 *
 * What is this `data-text` attribute, anyway? It turns out that we need to
 * put an attribute on the lowest-level text node in order to preserve correct
 * spellcheck handling. If the <span> is naked, Chrome and Safari may do
 * bizarre things to do the DOM -- split text nodes, create extra spans, etc.
 * If the <span> has an attribute, this appears not to happen.
 * See http://jsfiddle.net/9khdavod/ for the failure case, and
 * http://jsfiddle.net/7pg143f7/ for the fixed case.
 */
var NEWLINE_A = function (ref) {
    return useNewlineChar ? (React.createElement("span", { key: "A", "data-text": "true", ref: ref }, '\n')) : (React.createElement("br", { key: "A", "data-text": "true", ref: ref }));
};
var NEWLINE_B = function (ref) {
    return useNewlineChar ? (React.createElement("span", { key: "B", "data-text": "true", ref: ref }, '\n')) : (React.createElement("br", { key: "B", "data-text": "true", ref: ref }));
};
/**
 * The lowest-level component in a `DraftEditor`, the text node component
 * replaces the default React text node implementation. This allows us to
 * perform custom handling of newline behavior and avoid re-rendering text
 * nodes with DOM state that already matches the expectations of our immutable
 * editor state.
 */
var DraftEditorTextNode = /** @class */ (function (_super) {
    __extends(DraftEditorTextNode, _super);
    function DraftEditorTextNode(props) {
        var _this = _super.call(this, props) || this;
        // By flipping this flag, we also keep flipping keys which forces
        // React to remount this node every time it rerenders.
        _this._forceFlag = false;
        return _this;
    }
    DraftEditorTextNode.prototype.shouldComponentUpdate = function (nextProps) {
        var node = this._node;
        var shouldBeNewline = nextProps.children === '';
        invariant(isElement(node), 'node is not an Element');
        var elementNode = node;
        if (shouldBeNewline) {
            return !isNewline(elementNode);
        }
        return elementNode.textContent !== nextProps.children;
    };
    DraftEditorTextNode.prototype.componentDidMount = function () {
        this._forceFlag = !this._forceFlag;
    };
    DraftEditorTextNode.prototype.componentDidUpdate = function () {
        this._forceFlag = !this._forceFlag;
    };
    DraftEditorTextNode.prototype.render = function () {
        var _this = this;
        if (this.props.children === '') {
            return this._forceFlag
                ? NEWLINE_A(function (ref) { return (_this._node = ref); })
                : NEWLINE_B(function (ref) { return (_this._node = ref); });
        }
        return (React.createElement("span", { key: this._forceFlag ? 'A' : 'B', "data-text": "true", ref: function (ref) { return (_this._node = ref); } }, this.props.children));
    };
    return DraftEditorTextNode;
}(React.Component));

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
function isHTMLBRElement(node) {
    if (!node || !node.ownerDocument) {
        return false;
    }
    return isElement(node) && node.nodeName === 'BR';
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var DraftEffects = {
    initODS: function () { },
    handleExtensionCausedError: function () { },
};

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
function getAnonymizedDOM(node, getNodeLabels) {
    if (!node) {
        return '[empty]';
    }
    var anonymized = anonymizeTextWithin(node, getNodeLabels);
    if (anonymized.nodeType === Node.TEXT_NODE) {
        return anonymized.textContent;
    }
    invariant(isElement(anonymized), 'Node must be an Element if it is not a text node.');
    var castedElement = anonymized;
    return castedElement.outerHTML;
}
function anonymizeTextWithin(node, getNodeLabels) {
    var labels = getNodeLabels !== undefined ? getNodeLabels(node) : [];
    if (node.nodeType === Node.TEXT_NODE) {
        var length_1 = node.textContent.length;
        return getCorrectDocumentFromNode(node).createTextNode('[text ' +
            length_1 +
            (labels.length ? ' | ' + labels.join(', ') : '') +
            ']');
    }
    var clone = node.cloneNode();
    if (clone.nodeType === 1 && labels.length) {
        clone.setAttribute('data-labels', labels.join(', '));
    }
    var childNodes = node.childNodes;
    for (var ii = 0; ii < childNodes.length; ii++) {
        clone.appendChild(anonymizeTextWithin(childNodes[ii], getNodeLabels));
    }
    return clone;
}
function getAnonymizedEditorDOM(node, getNodeLabels) {
    // grabbing the DOM content of the Draft editor
    var currentNode = node;
    // this should only be used after checking with isElement
    var castedNode = currentNode;
    while (currentNode) {
        if (isElement(currentNode) && castedNode.hasAttribute('contenteditable')) {
            // found the Draft editor container
            return getAnonymizedDOM(currentNode, getNodeLabels);
        }
        else {
            currentNode = currentNode.parentNode;
            castedNode = currentNode;
        }
    }
    return 'Could not find contentEditable parent of node';
}
function getNodeLength(node) {
    return node.nodeValue === null
        ? node.childNodes.length
        : node.nodeValue.length;
}
/**
 * In modern non-IE browsers, we can support both forward and backward
 * selections.
 *
 * Note: IE10+ supports the Selection object, but it does not support
 * the `extend` method, which means that even in modern IE, it's not possible
 * to programatically create a backward selection. Thus, for all IE
 * versions, we use the old IE API to create our selections.
 */
function setDraftEditorSelection(selectionState, node, blockKey, nodeStart, nodeEnd) {
    // It's possible that the editor has been removed from the DOM but
    // our selection code doesn't know it yet. Forcing selection in
    // this case may lead to errors, so just bail now.
    var documentObject = getCorrectDocumentFromNode(node);
    if (!containsNode(documentObject.documentElement, node)) {
        return;
    }
    var selection = documentObject.defaultView.getSelection();
    var anchorKey = selectionState.getAnchorKey();
    var anchorOffset = selectionState.getAnchorOffset();
    var focusKey = selectionState.getFocusKey();
    var focusOffset = selectionState.getFocusOffset();
    var isBackward = selectionState.getIsBackward();
    // IE doesn't support backward selection. Swap key/offset pairs.
    if (!selection.extend && isBackward) {
        var tempKey = anchorKey;
        var tempOffset = anchorOffset;
        anchorKey = focusKey;
        anchorOffset = focusOffset;
        focusKey = tempKey;
        focusOffset = tempOffset;
        isBackward = false;
    }
    var hasAnchor = anchorKey === blockKey &&
        nodeStart <= anchorOffset &&
        nodeEnd >= anchorOffset;
    var hasFocus = focusKey === blockKey && nodeStart <= focusOffset && nodeEnd >= focusOffset;
    // If the selection is entirely bound within this node, set the selection
    // and be done.
    if (hasAnchor && hasFocus) {
        selection.removeAllRanges();
        addPointToSelection(selection, node, anchorOffset - nodeStart, selectionState);
        addFocusToSelection(selection, node, focusOffset - nodeStart, selectionState);
        return;
    }
    if (!isBackward) {
        // If the anchor is within this node, set the range start.
        if (hasAnchor) {
            selection.removeAllRanges();
            addPointToSelection(selection, node, anchorOffset - nodeStart, selectionState);
        }
        // If the focus is within this node, we can assume that we have
        // already set the appropriate start range on the selection, and
        // can simply extend the selection.
        if (hasFocus) {
            addFocusToSelection(selection, node, focusOffset - nodeStart, selectionState);
        }
    }
    else {
        // If this node has the focus, set the selection range to be a
        // collapsed range beginning here. Later, when we encounter the anchor,
        // we'll use this information to extend the selection.
        if (hasFocus) {
            selection.removeAllRanges();
            addPointToSelection(selection, node, focusOffset - nodeStart, selectionState);
        }
        // If this node has the anchor, we may assume that the correct
        // focus information is already stored on the selection object.
        // We keep track of it, reset the selection range, and extend it
        // back to the focus point.
        if (hasAnchor) {
            var storedFocusNode = selection.focusNode;
            var storedFocusOffset = selection.focusOffset;
            selection.removeAllRanges();
            addPointToSelection(selection, node, anchorOffset - nodeStart, selectionState);
            addFocusToSelection(selection, storedFocusNode, storedFocusOffset, selectionState);
        }
    }
}
/**
 * Extend selection towards focus point.
 */
function addFocusToSelection(selection, node, offset, selectionState) {
    var activeElement = getActiveElement();
    if (selection.extend && containsNode(activeElement, node)) {
        // If `extend` is called while another element has focus, an error is
        // thrown. We therefore disable `extend` if the active element is somewhere
        // other than the node we are selecting. This should only occur in Firefox,
        // since it is the only browser to support multiple selections.
        // See https://bugzilla.mozilla.org/show_bug.cgi?id=921444.
        // logging to catch bug that is being reported in t16250795
        if (offset > getNodeLength(node)) {
            // the call to 'selection.extend' is about to throw
            DraftJsDebugLogging.logSelectionStateFailure({
                anonymizedDom: getAnonymizedEditorDOM(node),
                extraParams: JSON.stringify({ offset: offset }),
                selectionState: JSON.stringify(selectionState.toJS()),
            });
        }
        // logging to catch bug that is being reported in t18110632
        var nodeWasFocus = node === selection.focusNode;
        try {
            selection.extend(node, offset);
        }
        catch (e) {
            DraftJsDebugLogging.logSelectionStateFailure({
                anonymizedDom: getAnonymizedEditorDOM(node, function (n) {
                    var labels = [];
                    if (n === activeElement) {
                        labels.push('active element');
                    }
                    if (n === selection.anchorNode) {
                        labels.push('selection anchor node');
                    }
                    if (n === selection.focusNode) {
                        labels.push('selection focus node');
                    }
                    return labels;
                }),
                extraParams: JSON.stringify({
                    activeElementName: activeElement ? activeElement.nodeName : null,
                    nodeIsFocus: node === selection.focusNode,
                    nodeWasFocus: nodeWasFocus,
                    selectionRangeCount: selection.rangeCount,
                    selectionAnchorNodeName: selection.anchorNode
                        ? selection.anchorNode.nodeName
                        : null,
                    selectionAnchorOffset: selection.anchorOffset,
                    selectionFocusNodeName: selection.focusNode
                        ? selection.focusNode.nodeName
                        : null,
                    selectionFocusOffset: selection.focusOffset,
                    message: e ? '' + e : null,
                    offset: offset,
                }, null, 2),
                selectionState: JSON.stringify(selectionState.toJS(), null, 2),
            });
            // allow the error to be thrown -
            // better than continuing in a broken state
            throw e;
        }
    }
    else {
        // IE doesn't support extend. This will mean no backward selection.
        // Extract the existing selection range and add focus to it.
        // Additionally, clone the selection range. IE11 throws an
        // InvalidStateError when attempting to access selection properties
        // after the range is detached.
        if (selection.rangeCount > 0) {
            var range = selection.getRangeAt(0);
            range.setEnd(node, offset);
            selection.addRange(range.cloneRange());
        }
    }
}
function addPointToSelection(selection, node, offset, selectionState) {
    var range = getCorrectDocumentFromNode(node).createRange();
    // logging to catch bug that is being reported in t16250795
    if (offset > getNodeLength(node)) {
        // in this case we know that the call to 'range.setStart' is about to throw
        DraftJsDebugLogging.logSelectionStateFailure({
            anonymizedDom: getAnonymizedEditorDOM(node),
            extraParams: JSON.stringify({ offset: offset }),
            selectionState: JSON.stringify(selectionState.toJS()),
        });
        DraftEffects.handleExtensionCausedError();
    }
    range.setStart(node, offset);
    selection.addRange(range);
}

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
/**
 * All leaf nodes in the editor are spans with single text nodes. Leaf
 * elements are styled based on the merging of an optional custom style map
 * and a default style map.
 *
 * `DraftEditorLeaf` also provides a wrapper for calling into the imperative
 * DOM Selection API. In this way, top-level components can declaratively
 * maintain the selection state.
 */
var DraftEditorLeaf = /** @class */ (function (_super) {
    __extends(DraftEditorLeaf, _super);
    function DraftEditorLeaf() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DraftEditorLeaf.prototype._setSelection = function () {
        var _a = this.props, selection = _a.selection, isLast = _a.isLast;
        var isCustom = this.leaf.dataset['type'] === 'custom';
        // gland 重要更改，防止非contenteditable元素获取焦点
        if (!isLast && isCustom) {
            return;
        }
        // If selection state is irrelevant to the parent block, no-op.
        if (selection == null || !selection.getHasFocus()) {
            return;
        }
        var _b = this.props, block = _b.block, start = _b.start, text = _b.text;
        var blockKey = block.getKey();
        var end = start + text.length;
        // gland
        if (isCustom || typeof text === 'object') {
            end = start + 1;
        }
        if (!selection.hasEdgeWithin(blockKey, start, end)) {
            return;
        }
        // gland
        if (isCustom) {
            setIndepentSelection(selection, this.leaf);
            return;
        }
        if (typeof text === 'object') {
            setDraftEditorSelection(selection, this.leaf.firstChild, blockKey, start, end);
            return;
        }
        // Determine the appropriate target node for selection. If the child
        // is not a text node, it is a <br /> spacer. In this case, use the
        // <span> itself as the selection target.
        var node = this.leaf;
        invariant(node, 'Missing node');
        var child = node.firstChild;
        invariant(child, 'Missing child');
        var targetNode;
        if (child.nodeType === Node.TEXT_NODE) {
            targetNode = child;
        }
        else if (isHTMLBRElement(child)) {
            targetNode = node;
        }
        else {
            targetNode = child.firstChild;
            invariant(targetNode, 'Missing targetNode');
        }
        //console.log("selection set", this.leaf.dataset["type"], selection.toJS(), targetNode, blockKey, start, end);
        setDraftEditorSelection(selection, targetNode, blockKey, start, end);
    };
    DraftEditorLeaf.prototype.shouldComponentUpdate = function (nextProps) {
        // gland notice styleSet lead update
        var leafNode = this.leaf;
        invariant(leafNode, 'Missing leafNode');
        var shouldUpdate = this.props.text !== nextProps.text || nextProps.styleSet !== this.props.styleSet || nextProps.forceSelection;
        return shouldUpdate;
    };
    DraftEditorLeaf.prototype.componentDidUpdate = function () {
        this._setSelection();
    };
    DraftEditorLeaf.prototype.componentDidMount = function () {
        this._setSelection();
    };
    DraftEditorLeaf.prototype.render = function () {
        var _this = this;
        var _a = this.props, block = _a.block, isLast = _a.isLast, custom = _a.custom;
        var text = this.props.text;
        // If the leaf is at the end of its block and ends in a soft newline, append
        // an extra line feed character. Browsers collapse trailing newline
        // characters, which leaves the cursor in the wrong place after a
        // shift+enter. The extra character repairs this.
        if (isLast) {
            if (typeof text === 'string') {
                if (text.endsWith('\n')) {
                    text += '\n';
                }
            }
        }
        var _b = this.props, customStyleMap = _b.customStyleMap, customStyleFn = _b.customStyleFn, offsetKey = _b.offsetKey, styleSet = _b.styleSet;
        var styleObj = styleSet.reduce(function (map, styleName) {
            var mergedStyles = {};
            var style = customStyleMap[styleName];
            if (style !== undefined && map.textDecoration !== style.textDecoration) {
                // .trim() is necessary for IE9/10/11 and Edge
                mergedStyles.textDecoration = [map.textDecoration, style.textDecoration].join(' ').trim();
            }
            return Object.assign(map, style, mergedStyles);
        }, {});
        if (customStyleFn) {
            var newStyles = customStyleFn(styleSet, block);
            styleObj = Object.assign(styleObj, newStyles);
        }
        //                     {isLast ? <span data-text="r" ref={ref=>(this.lastleafR = ref)}  data-offset-key={offsetKey} >{"\r"}</span> : null}
        // gland  \r &#13; 可使光标垂直对齐正常和处在行尾时聚焦
        if (custom) {
            return (React.createElement("span", { "data-offset-key": offsetKey, ref: function (ref) { return (_this.leaf = ref); }, style: styleObj, "data-type": 'custom', contentEditable: false },
                React.createElement("span", { "data-text": 'object' }, custom),
                React.createElement("span", { "data-text": 'r' }, '\r')));
        }
        if (typeof text === 'object') {
            return (React.createElement("span", { "data-offset-key": offsetKey, ref: function (ref) { return (_this.leaf = ref); }, style: styleObj },
                React.createElement("span", { "data-text": 'object' }, text)));
        }
        return (React.createElement("span", { "data-offset-key": offsetKey, ref: function (ref) { return (_this.leaf = ref); }, style: styleObj },
            React.createElement(DraftEditorTextNode, null, text)));
    };
    return DraftEditorLeaf;
}(React.Component));
function setIndepentSelection(selectionState, leaf, blockKey) {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var ele = leaf.parentElement;
    var offset = ele.childNodes.length;
    if (selectionState.isCollapsed()) {
        range.setStart(ele, offset);
        range.setEnd(ele, offset);
        selection.removeAllRanges();
        selection.addRange(range);
        return;
    }
    // let anchorKey = selectionState.getAnchorKey();
    // let anchorOffset = selectionState.getAnchorOffset();
    // let focusKey = selectionState.getFocusKey();
    // let focusOffset = selectionState.getFocusOffset();
    // let isBackward = selectionState.getIsBackward();
    // if (anchorKey === focusKey) {
    //     console.log('eeeeee', selection)
    //     if (selection.rangeCount > 0) {
    //         range.setEnd(ele, offset);
    //         selection.addRange(range.cloneRange());
    //         return;
    //     }
    // }
    // if (isBackward) {
    //     [anchorKey, anchorOffset, focusKey, focusOffset] = [focusKey, focusOffset, anchorKey, anchorOffset];
    // }
    // if (blockKey === anchorKey) {
    //     range.setStart(ele, offset);
    //     selection.removeAllRanges();
    //     selection.addRange(range);
    //     return;
    // }
    // if (blockKey === focusKey) {
    //     range.setEnd(ele, offset);
    //     selection.addRange(range);
    //     return;
    // }
}

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
var DraftEditorNode = /** @class */ (function (_super) {
    __extends(DraftEditorNode, _super);
    function DraftEditorNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DraftEditorNode.prototype.render = function () {
        var _a = this.props, block = _a.block, contentState = _a.contentState, customStyleFn = _a.customStyleFn, customStyleMap = _a.customStyleMap, decorator = _a.decorator, direction = _a.direction, forceSelection = _a.forceSelection, hasSelection = _a.hasSelection, selection = _a.selection, tree = _a.tree;
        var blockKey = block.getKey();
        var text = block.getText();
        var lastLeafSet = tree.size - 1;
        var children = this.props.children ||
            tree
                .map(function (leafSet, ii) {
                var decoratorKey = leafSet.get('decoratorKey');
                var leavesForLeafSet = leafSet.get('leaves');
                var lastLeaf = leavesForLeafSet.size - 1;
                var Leaves = leavesForLeafSet
                    .map(function (leaf, jj) {
                    var offsetKey = DraftOffsetKey.encode(blockKey, ii, jj);
                    var start = leaf.get('start');
                    var end = leaf.get('end');
                    return (React.createElement(DraftEditorLeaf, { key: offsetKey, offsetKey: offsetKey, block: block, start: start, selection: hasSelection ? selection : null, forceSelection: forceSelection, text: text.slice(start, end), styleSet: block.getInlineStyleAt(start), customStyleMap: customStyleMap, customStyleFn: customStyleFn, isLast: decoratorKey === lastLeafSet && jj === lastLeaf }));
                })
                    .toArray();
                if (!decoratorKey || !decorator) {
                    return Leaves;
                }
                return (React.createElement(DraftEditorDecoratedLeaves, { block: block, children: Leaves, contentState: contentState, decorator: decorator, decoratorKey: decoratorKey, direction: direction, leafSet: leafSet, text: text, key: ii }));
            })
                .toArray();
        return (React.createElement("div", { "data-offset-key": DraftOffsetKey.encode(blockKey, 0, 0), className: cx({
                'public/DraftStyleDefault/block': true,
                'public/DraftStyleDefault/ltr': direction === 'LTR',
                'public/DraftStyleDefault/rtl': direction === 'RTL',
            }) }, children));
    };
    return DraftEditorNode;
}(React.Component));

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
 * This file is a fork of DraftEditorBlock.react.js and DraftEditorContents.react.js
 *
 * This is unstable and not part of the public API and should not be used by
 * production systems. This file may be update/removed without notice.
 */
var SCROLL_BUFFER = 10;
/**
 * Return whether a block overlaps with either edge of the `SelectionState`.
 */
var isBlockOnSelectionEdge = function (selection, key) {
    return selection.getAnchorKey() === key || selection.getFocusKey() === key;
};
/**
 * We will use this helper to identify blocks that need to be wrapped but have siblings that
 * also share the same wrapper element, this way we can do the wrapping once the last sibling
 * is added.
 */
var shouldNotAddWrapperElement = function (block, contentState) {
    var nextSiblingKey = block.getNextSiblingKey();
    return nextSiblingKey
        ? contentState.getBlockForKey(nextSiblingKey).getType() === block.getType()
        : false;
};
var applyWrapperElementToSiblings = function (wrapperTemplate, Element, nodes) {
    var wrappedSiblings = [];
    // we check back until we find a sibbling that does not have same wrapper
    for (var _i = 0, _a = nodes.reverse(); _i < _a.length; _i++) {
        var sibling = _a[_i];
        if (sibling.type !== Element) {
            break;
        }
        wrappedSiblings.push(sibling);
    }
    // we now should remove from acc the wrappedSiblings and add them back under same wrap
    nodes.splice(nodes.indexOf(wrappedSiblings[0]), wrappedSiblings.length + 1);
    var childrenIs = wrappedSiblings.reverse();
    var key = childrenIs[0].key;
    nodes.push(React.cloneElement(wrapperTemplate, {
        key: key + "-wrap",
        'data-offset-key': DraftOffsetKey.encode(key, 0, 0),
    }, childrenIs));
    return nodes;
};
var getDraftRenderConfig = function (block, blockRenderMap) {
    var configForType = blockRenderMap.get(block.getType()) || blockRenderMap.get('unstyled');
    var wrapperTemplate = configForType.wrapper;
    var Element = configForType.element || blockRenderMap.get('unstyled').element;
    return {
        Element: Element,
        wrapperTemplate: wrapperTemplate,
    };
};
var getCustomRenderConfig = function (block, blockRendererFn) {
    var customRenderer = blockRendererFn(block);
    if (!customRenderer) {
        return {};
    }
    var CustomComponent = customRenderer.component, customProps = customRenderer.props, customEditable = customRenderer.editable;
    return {
        CustomComponent: CustomComponent,
        customProps: customProps,
        customEditable: customEditable,
    };
};
var getElementPropsConfig = function (block, editorKey, offsetKey, blockStyleFn, customConfig) {
    var elementProps = {
        'data-block': true,
        'data-editor': editorKey,
        'data-offset-key': offsetKey,
        key: block.getKey(),
    };
    var customClass = blockStyleFn(block);
    if (customClass) {
        elementProps.className = customClass;
    }
    if (customConfig.customEditable !== undefined) {
        elementProps = __assign(__assign({}, elementProps), { contentEditable: customConfig.customEditable, suppressContentEditableWarning: true });
    }
    return elementProps;
};
var DraftEditorBlockNode = /** @class */ (function (_super) {
    __extends(DraftEditorBlockNode, _super);
    function DraftEditorBlockNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DraftEditorBlockNode.prototype.shouldComponentUpdate = function (nextProps) {
        var _a = this.props, block = _a.block, direction = _a.direction, tree = _a.tree;
        var isContainerNode = !block.getChildKeys().isEmpty();
        var blockHasChanged = block !== nextProps.block ||
            tree !== nextProps.tree ||
            direction !== nextProps.direction ||
            (isBlockOnSelectionEdge(nextProps.selection, nextProps.block.getKey()) &&
                nextProps.forceSelection);
        // if we have children at this stage we always re-render container nodes
        // else if its a root node we avoid re-rendering by checking for block updates
        return isContainerNode || blockHasChanged;
    };
    /**
     * When a block is mounted and overlaps the selection state, we need to make
     * sure that the cursor is visible to match native behavior. This may not
     * be the case if the user has pressed `RETURN` or pasted some content, since
     * programatically creating these new blocks and setting the DOM selection
     * will miss out on the browser natively scrolling to that position.
     *
     * To replicate native behavior, if the block overlaps the selection state
     * on mount, force the scroll position. Check the scroll state of the scroll
     * parent, and adjust it to align the entire block to the bottom of the
     * scroll parent.
     */
    DraftEditorBlockNode.prototype.componentDidMount = function () {
        var selection = this.props.selection;
        var endKey = selection.getEndKey();
        if (!selection.getHasFocus() || endKey !== this.props.block.getKey()) {
            return;
        }
        var blockNode = ReactDOM.findDOMNode(this);
        var scrollParent = Style.getScrollParent(blockNode);
        var scrollPosition = getScrollPosition(scrollParent);
        var scrollDelta;
        if (scrollParent === window) {
            var nodePosition = getElementPosition(blockNode);
            var nodeBottom = nodePosition.y + nodePosition.height;
            var viewportHeight = getViewportDimensions().height;
            scrollDelta = nodeBottom - viewportHeight;
            if (scrollDelta > 0) {
                window.scrollTo(scrollPosition.x, scrollPosition.y + scrollDelta + SCROLL_BUFFER);
            }
        }
        else {
            invariant(isHTMLElement(blockNode), 'blockNode is not an HTMLElement');
            var htmlBlockNode = blockNode;
            var blockBottom = htmlBlockNode.offsetHeight + htmlBlockNode.offsetTop;
            var scrollBottom = scrollParent.offsetHeight + scrollPosition.y;
            scrollDelta = blockBottom - scrollBottom;
            if (scrollDelta > 0) {
                Scroll.setTop(scrollParent, Scroll.getTop(scrollParent) + scrollDelta + SCROLL_BUFFER);
            }
        }
    };
    DraftEditorBlockNode.prototype.render = function () {
        var _this = this;
        var _a = this.props, block = _a.block, blockRenderMap = _a.blockRenderMap, blockRendererFn = _a.blockRendererFn, blockStyleFn = _a.blockStyleFn, contentState = _a.contentState, decorator = _a.decorator, editorKey = _a.editorKey, editorState = _a.editorState, customStyleFn = _a.customStyleFn, customStyleMap = _a.customStyleMap, direction = _a.direction, forceSelection = _a.forceSelection, selection = _a.selection, tree = _a.tree;
        var children = null;
        if (block.children.size) {
            children = block.children.reduce(function (acc, key) {
                var offsetKey = DraftOffsetKey.encode(key, 0, 0);
                var child = contentState.getBlockForKey(key);
                var customConfig = getCustomRenderConfig(child, blockRendererFn);
                var Component = customConfig.CustomComponent || DraftEditorBlockNode;
                var _a = getDraftRenderConfig(child, blockRenderMap), Element = _a.Element, wrapperTemplate = _a.wrapperTemplate;
                var elementProps = getElementPropsConfig(child, editorKey, offsetKey, blockStyleFn, customConfig);
                var childProps = __assign(__assign({}, _this.props), { tree: editorState.getBlockTree(key), blockProps: customConfig.customProps, offsetKey: offsetKey, block: child });
                acc.push(React.createElement(Element, elementProps, React.createElement(Component, __assign({}, childProps))));
                if (!wrapperTemplate ||
                    shouldNotAddWrapperElement(child, contentState)) {
                    return acc;
                }
                // if we are here it means we are the last block
                // that has a wrapperTemplate so we should wrap itself
                // and all other previous siblings that share the same wrapper
                applyWrapperElementToSiblings(wrapperTemplate, Element, acc);
                return acc;
            }, []);
        }
        var blockKey = block.getKey();
        var offsetKey = DraftOffsetKey.encode(blockKey, 0, 0);
        var customConfig = getCustomRenderConfig(block, blockRendererFn);
        var Component = customConfig.CustomComponent;
        var blockNode = Component != null ? (React.createElement(Component, __assign({}, this.props, { tree: editorState.getBlockTree(blockKey), blockProps: customConfig.customProps, offsetKey: offsetKey, block: block }))) : (
        // @ts-ignore
        React.createElement(DraftEditorNode, { block: block, children: children, contentState: contentState, customStyleFn: customStyleFn, customStyleMap: customStyleMap, decorator: decorator, direction: direction, forceSelection: forceSelection, hasSelection: isBlockOnSelectionEdge(selection, blockKey), selection: selection, tree: tree }));
        if (block.getParentKey()) {
            return blockNode;
        }
        var Element = getDraftRenderConfig(block, blockRenderMap).Element;
        var elementProps = getElementPropsConfig(block, editorKey, offsetKey, blockStyleFn, customConfig);
        // root block nodes needs to be wrapped
        return React.createElement(Element, elementProps, blockNode);
    };
    return DraftEditorBlockNode;
}(React.Component));

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
 * This file is a fork of DraftEditorContents.react.js for tree nodes
 *
 * This is unstable and not part of the public API and should not be used by
 * production systems. This file may be update/removed without notice.
 */
/**
 * `DraftEditorContents` is the container component for all block components
 * rendered for a `DraftEditor`. It is optimized to aggressively avoid
 * re-rendering blocks whenever possible.
 *
 * This component is separate from `DraftEditor` because certain props
 * (for instance, ARIA props) must be allowed to update without affecting
 * the contents of the editor.
 */
var DraftEditorContentsExperimental = /** @class */ (function (_super) {
    __extends(DraftEditorContentsExperimental, _super);
    function DraftEditorContentsExperimental() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DraftEditorContentsExperimental.prototype.shouldComponentUpdate = function (nextProps) {
        var prevEditorState = this.props.editorState;
        var nextEditorState = nextProps.editorState;
        var prevDirectionMap = prevEditorState.getDirectionMap();
        var nextDirectionMap = nextEditorState.getDirectionMap();
        // Text direction has changed for one or more blocks. We must re-render.
        if (prevDirectionMap !== nextDirectionMap) {
            return true;
        }
        var didHaveFocus = prevEditorState.getSelection().getHasFocus();
        var nowHasFocus = nextEditorState.getSelection().getHasFocus();
        if (didHaveFocus !== nowHasFocus) {
            return true;
        }
        var nextNativeContent = nextEditorState.getNativelyRenderedContent();
        var wasComposing = prevEditorState.isInCompositionMode();
        var nowComposing = nextEditorState.isInCompositionMode();
        // If the state is unchanged or we're currently rendering a natively
        // rendered state, there's nothing new to be done.
        if (prevEditorState === nextEditorState ||
            (nextNativeContent !== null &&
                nextEditorState.getCurrentContent() === nextNativeContent) ||
            (wasComposing && nowComposing)) {
            return false;
        }
        var prevContent = prevEditorState.getCurrentContent();
        var nextContent = nextEditorState.getCurrentContent();
        var prevDecorator = prevEditorState.getDecorator();
        var nextDecorator = nextEditorState.getDecorator();
        return (wasComposing !== nowComposing ||
            prevContent !== nextContent ||
            prevDecorator !== nextDecorator ||
            nextEditorState.mustForceSelection());
    };
    DraftEditorContentsExperimental.prototype.render = function () {
        var _a = this.props, blockRenderMap = _a.blockRenderMap, blockRendererFn = _a.blockRendererFn, blockStyleFn = _a.blockStyleFn, customStyleMap = _a.customStyleMap, customStyleFn = _a.customStyleFn, editorState = _a.editorState, editorKey = _a.editorKey, textDirectionality = _a.textDirectionality;
        var content = editorState.getCurrentContent();
        var selection = editorState.getSelection();
        var forceSelection = editorState.mustForceSelection();
        var decorator = editorState.getDecorator();
        var directionMap = nullthrows(editorState.getDirectionMap());
        var blocksAsArray = content.getBlocksAsArray();
        var rootBlock = blocksAsArray[0];
        var processedBlocks = [];
        var nodeBlock = rootBlock;
        while (nodeBlock) {
            var blockKey = nodeBlock.getKey();
            var blockProps = {
                blockRenderMap: blockRenderMap,
                blockRendererFn: blockRendererFn,
                blockStyleFn: blockStyleFn,
                contentState: content,
                customStyleFn: customStyleFn,
                customStyleMap: customStyleMap,
                decorator: decorator,
                editorKey: editorKey,
                editorState: editorState,
                forceSelection: forceSelection,
                selection: selection,
                block: nodeBlock,
                direction: textDirectionality
                    ? textDirectionality
                    : directionMap.get(blockKey),
                tree: editorState.getBlockTree(blockKey),
            };
            var configForType = blockRenderMap.get(nodeBlock.getType()) ||
                blockRenderMap.get('unstyled');
            var wrapperTemplate = configForType.wrapper;
            processedBlocks.push({
                /* $FlowFixMe(>=0.112.0 site=mobile) This comment suppresses an error
                 * found when Flow v0.112 was deployed. To see the error delete this
                 * comment and run Flow. */
                /* $FlowFixMe(>=0.112.0 site=www) This comment suppresses an error
                 * found when Flow v0.112 was deployed. To see the error delete this
                 * comment and run Flow. */
                /* $FlowFixMe(>=0.112.0 site=www,mobile) This comment suppresses an
                 * error found when Flow v0.112 was deployed. To see the error delete
                 * this comment and run Flow. */
                // @ts-ignore
                block: React.createElement(DraftEditorBlockNode, __assign({ key: blockKey }, blockProps)),
                wrapperTemplate: wrapperTemplate,
                key: blockKey,
                offsetKey: DraftOffsetKey.encode(blockKey, 0, 0),
            });
            var nextBlockKey = nodeBlock.getNextSiblingKey();
            nodeBlock = nextBlockKey ? content.getBlockForKey(nextBlockKey) : null;
        }
        // Group contiguous runs of blocks that have the same wrapperTemplate
        var outputBlocks = [];
        for (var ii = 0; ii < processedBlocks.length;) {
            var info = processedBlocks[ii];
            if (info.wrapperTemplate) {
                var blocks = [];
                do {
                    blocks.push(processedBlocks[ii].block);
                    ii++;
                } while (ii < processedBlocks.length &&
                    processedBlocks[ii].wrapperTemplate === info.wrapperTemplate);
                var wrapperElement = React.cloneElement(info.wrapperTemplate, {
                    key: info.key + '-wrap',
                    'data-offset-key': info.offsetKey,
                }, blocks);
                outputBlocks.push(wrapperElement);
            }
            else {
                outputBlocks.push(info.block);
                ii++;
            }
        }
        return React.createElement("div", { "data-contents": "true" }, outputBlocks);
    };
    return DraftEditorContentsExperimental;
}(React.Component));

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
var SCROLL_BUFFER$1 = 10;
/**
 * Return whether a block overlaps with either edge of the `SelectionState`.
 */
var isBlockOnSelectionEdge$1 = function (selection, key) {
    return selection.getAnchorKey() === key || selection.getFocusKey() === key;
};
/**
 * The default block renderer for a `DraftEditor` component.
 *
 * A `DraftEditorBlock` is able to render a given `ContentBlock` to its
 * appropriate decorator and inline style components.
 */
var DraftEditorBlock = /** @class */ (function (_super) {
    __extends(DraftEditorBlock, _super);
    function DraftEditorBlock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DraftEditorBlock.prototype.shouldComponentUpdate = function (nextProps) {
        return (this.props.block !== nextProps.block ||
            this.props.tree !== nextProps.tree ||
            this.props.direction !== nextProps.direction ||
            (isBlockOnSelectionEdge$1(nextProps.selection, nextProps.block.getKey()) &&
                nextProps.forceSelection));
    };
    /**
     * When a block is mounted and overlaps the selection state, we need to make
     * sure that the cursor is visible to match native behavior. This may not
     * be the case if the user has pressed `RETURN` or pasted some content, since
     * programmatically creating these new blocks and setting the DOM selection
     * will miss out on the browser natively scrolling to that position.
     *
     * To replicate native behavior, if the block overlaps the selection state
     * on mount, force the scroll position. Check the scroll state of the scroll
     * parent, and adjust it to align the entire block to the bottom of the
     * scroll parent.
     */
    DraftEditorBlock.prototype.componentDidMount = function () {
        var selection = this.props.selection;
        var endKey = selection.getEndKey();
        if (!selection.getHasFocus() || endKey !== this.props.block.getKey()) {
            return;
        }
        var blockNode = this._node;
        if (blockNode == null) {
            return;
        }
        var scrollParent = Style.getScrollParent(blockNode);
        var scrollPosition = getScrollPosition(scrollParent);
        var scrollDelta;
        if (scrollParent === window) {
            var nodePosition = getElementPosition(blockNode);
            var nodeBottom = nodePosition.y + nodePosition.height;
            var viewportHeight = getViewportDimensions().height;
            scrollDelta = nodeBottom - viewportHeight;
            if (scrollDelta > 0) {
                window.scrollTo(scrollPosition.x, scrollPosition.y + scrollDelta + SCROLL_BUFFER$1);
            }
        }
        else {
            invariant(isHTMLElement(blockNode), 'blockNode is not an HTMLElement');
            var blockBottom = blockNode.offsetHeight + blockNode.offsetTop;
            var pOffset = scrollParent.offsetTop + scrollParent.offsetHeight;
            var scrollBottom = pOffset + scrollPosition.y;
            scrollDelta = blockBottom - scrollBottom;
            if (scrollDelta > 0) {
                Scroll.setTop(scrollParent, Scroll.getTop(scrollParent) + scrollDelta + SCROLL_BUFFER$1);
            }
        }
    };
    DraftEditorBlock.prototype._renderChildren = function () {
        var _this = this;
        var block = this.props.block;
        var blockKey = block.getKey();
        var text = block.getText();
        var lastLeafSet = this.props.tree.size - 1;
        var hasSelection = isBlockOnSelectionEdge$1(this.props.selection, blockKey);
        return this.props.tree
            .map(function (leafSet, ii) {
            var leavesForLeafSet = leafSet.get('leaves');
            // T44088704
            if (leavesForLeafSet.size === 0) {
                return null;
            }
            var lastLeaf = leavesForLeafSet.size - 1;
            var leaves = leavesForLeafSet
                .map(function (leaf, jj) {
                var offsetKey = DraftOffsetKey.encode(blockKey, ii, jj);
                var start = leaf.get('start');
                var end = leaf.get('end');
                return (
                // @ts-ignore
                React.createElement(DraftEditorLeaf, { key: offsetKey, offsetKey: offsetKey, block: block, start: start, selection: hasSelection ? _this.props.selection : null, forceSelection: _this.props.forceSelection, text: text.slice(start, end), styleSet: block.getInlineStyleAt(start), customStyleMap: _this.props.customStyleMap, customStyleFn: _this.props.customStyleFn, isLast: ii === lastLeafSet && jj === lastLeaf }));
            })
                .toArray();
            var decoratorKey = leafSet.get('decoratorKey');
            if (decoratorKey == null) {
                return leaves;
            }
            if (!_this.props.decorator) {
                return leaves;
            }
            var decorator = nullthrows(_this.props.decorator);
            var DecoratorComponent = decorator.getComponentForKey(decoratorKey);
            if (!DecoratorComponent) {
                return leaves;
            }
            var decoratorProps = decorator.getPropsForKey(decoratorKey);
            var decoratorOffsetKey = DraftOffsetKey.encode(blockKey, ii, 0);
            var start = leavesForLeafSet.first().get('start');
            var end = leavesForLeafSet.last().get('end');
            var decoratedText = text.slice(start, end);
            var entityKey = block.getEntityAt(leafSet.get('start'));
            // Resetting dir to the same value on a child node makes Chrome/Firefox
            // confused on cursor movement. See http://jsfiddle.net/d157kLck/3/
            var dir = UnicodeBidiDirection.getHTMLDirIfDifferent(UnicodeBidi.getDirection(decoratedText), _this.props.direction);
            var commonProps = {
                contentState: _this.props.contentState,
                decoratedText: decoratedText,
                dir: dir,
                key: decoratorOffsetKey,
                start: start,
                end: end,
                blockKey: blockKey,
                entityKey: entityKey,
                offsetKey: decoratorOffsetKey,
            };
            return (React.createElement(DecoratorComponent, __assign({}, decoratorProps, commonProps), leaves));
        })
            .toArray();
    };
    DraftEditorBlock.prototype.render = function () {
        var _this = this;
        var _a = this.props, direction = _a.direction, offsetKey = _a.offsetKey;
        var className = cx({
            'public/DraftStyleDefault/block': true,
            'public/DraftStyleDefault/ltr': direction === 'LTR',
            'public/DraftStyleDefault/rtl': direction === 'RTL',
        });
        return (React.createElement("div", { "data-offset-key": offsetKey, className: className, ref: function (ref) { return (_this._node = ref); } }, this._renderChildren()));
    };
    return DraftEditorBlock;
}(React.Component));

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
/**
 * Provide default styling for list items. This way, lists will be styled with
 * proper counters and indentation even if the caller does not specify
 * their own styling at all. If more than five levels of nesting are needed,
 * the necessary CSS classes can be provided via `blockStyleFn` configuration.
 */
var getListItemClasses = function (type, depth, shouldResetCount, direction) {
    return cx({
        'public/DraftStyleDefault/unorderedListItem': type === 'unordered-list-item',
        'public/DraftStyleDefault/orderedListItem': type === 'ordered-list-item',
        'public/DraftStyleDefault/reset': shouldResetCount,
        'public/DraftStyleDefault/depth0': depth === 0,
        'public/DraftStyleDefault/depth1': depth === 1,
        'public/DraftStyleDefault/depth2': depth === 2,
        'public/DraftStyleDefault/depth3': depth === 3,
        'public/DraftStyleDefault/depth4': depth >= 4,
        'public/DraftStyleDefault/listLTR': direction === 'LTR',
        'public/DraftStyleDefault/listRTL': direction === 'RTL',
    });
};
/**
 * `DraftEditorContents` is the container component for all block components
 * rendered for a `DraftEditor`. It is optimized to aggressively avoid
 * re-rendering blocks whenever possible.
 *
 * This component is separate from `DraftEditor` because certain props
 * (for instance, ARIA props) must be allowed to update without affecting
 * the contents of the editor.
 */
var DraftEditorContents = /** @class */ (function (_super) {
    __extends(DraftEditorContents, _super);
    function DraftEditorContents() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DraftEditorContents.prototype.shouldComponentUpdate = function (nextProps) {
        var prevEditorState = this.props.editorState;
        var nextEditorState = nextProps.editorState;
        var prevDirectionMap = prevEditorState.getDirectionMap();
        var nextDirectionMap = nextEditorState.getDirectionMap();
        // Text direction has changed for one or more blocks. We must re-render.
        if (prevDirectionMap !== nextDirectionMap) {
            return true;
        }
        var didHaveFocus = prevEditorState.getSelection().getHasFocus();
        var nowHasFocus = nextEditorState.getSelection().getHasFocus();
        if (didHaveFocus !== nowHasFocus) {
            return true;
        }
        var nextNativeContent = nextEditorState.getNativelyRenderedContent();
        var wasComposing = prevEditorState.isInCompositionMode();
        var nowComposing = nextEditorState.isInCompositionMode();
        // If the state is unchanged or we're currently rendering a natively
        // rendered state, there's nothing new to be done.
        if (prevEditorState === nextEditorState ||
            (nextNativeContent !== null &&
                nextEditorState.getCurrentContent() === nextNativeContent) ||
            (wasComposing && nowComposing)) {
            return false;
        }
        var prevContent = prevEditorState.getCurrentContent();
        var nextContent = nextEditorState.getCurrentContent();
        var prevDecorator = prevEditorState.getDecorator();
        var nextDecorator = nextEditorState.getDecorator();
        return (wasComposing !== nowComposing ||
            prevContent !== nextContent ||
            prevDecorator !== nextDecorator ||
            nextEditorState.mustForceSelection());
    };
    DraftEditorContents.prototype.render = function () {
        var _a = this.props, blockRenderMap = _a.blockRenderMap, blockRendererFn = _a.blockRendererFn, blockStyleFn = _a.blockStyleFn, customStyleMap = _a.customStyleMap, customStyleFn = _a.customStyleFn, editorState = _a.editorState, editorKey = _a.editorKey, textDirectionality = _a.textDirectionality;
        var content = editorState.getCurrentContent();
        var selection = editorState.getSelection();
        var forceSelection = editorState.mustForceSelection();
        var decorator = editorState.getDecorator();
        var directionMap = nullthrows(editorState.getDirectionMap());
        var blocksAsArray = content.getBlocksAsArray();
        var processedBlocks = [];
        var currentDepth = null;
        var lastWrapperTemplate = null;
        for (var ii = 0; ii < blocksAsArray.length; ii++) {
            var block = blocksAsArray[ii];
            var key = block.getKey();
            var blockType = block.getType();
            var customRenderer = blockRendererFn(block);
            var CustomComponent = void 0, customProps = void 0, customEditable = void 0;
            if (customRenderer) {
                CustomComponent = customRenderer.component;
                customProps = customRenderer.props;
                customEditable = customRenderer.editable;
            }
            var direction = textDirectionality
                ? textDirectionality
                : directionMap.get(key);
            var offsetKey = DraftOffsetKey.encode(key, 0, 0);
            var componentProps = {
                contentState: content,
                block: block,
                blockProps: customProps,
                blockStyleFn: blockStyleFn,
                customStyleMap: customStyleMap,
                customStyleFn: customStyleFn,
                decorator: decorator,
                direction: direction,
                forceSelection: forceSelection,
                offsetKey: offsetKey,
                selection: selection,
                tree: editorState.getBlockTree(key),
            };
            var configForType = blockRenderMap.get(blockType) || blockRenderMap.get('unstyled');
            var wrapperTemplate = configForType.wrapper;
            var Element_1 = configForType.element || blockRenderMap.get('unstyled').element;
            var depth = block.getDepth();
            var className = '';
            if (blockStyleFn) {
                className = blockStyleFn(block);
            }
            // List items are special snowflakes, since we handle nesting and
            // counters manually.
            if (Element_1 === 'li') {
                var shouldResetCount = lastWrapperTemplate !== wrapperTemplate ||
                    currentDepth === null ||
                    depth > currentDepth;
                className = joinClasses(className, getListItemClasses(blockType, depth, shouldResetCount, direction));
            }
            var Component = CustomComponent || DraftEditorBlock;
            var childProps = {
                className: className,
                'data-block': true,
                'data-editor': editorKey,
                'data-offset-key': offsetKey,
                key: key,
            };
            if (customEditable !== undefined) {
                childProps = __assign(__assign({}, childProps), { contentEditable: customEditable, suppressContentEditableWarning: true });
            }
            var child = React.createElement(Element_1, childProps, 
            /* $FlowFixMe(>=0.112.0 site=mobile) This comment suppresses an error
             * found when Flow v0.112 was deployed. To see the error delete this
             * comment and run Flow. */
            /* $FlowFixMe(>=0.112.0 site=www) This comment suppresses an error
             * found when Flow v0.112 was deployed. To see the error delete this
             * comment and run Flow. */
            /* $FlowFixMe(>=0.112.0 site=www,mobile) This comment suppresses an
             * error found when Flow v0.112 was deployed. To see the error delete
             * this comment and run Flow. */
            React.createElement(Component, __assign({}, componentProps, { key: key })));
            processedBlocks.push({
                block: child,
                wrapperTemplate: wrapperTemplate,
                key: key,
                offsetKey: offsetKey,
            });
            if (wrapperTemplate) {
                currentDepth = block.getDepth();
            }
            else {
                currentDepth = null;
            }
            lastWrapperTemplate = wrapperTemplate;
        }
        // Group contiguous runs of blocks that have the same wrapperTemplate
        var outputBlocks = [];
        for (var ii = 0; ii < processedBlocks.length;) {
            var info = processedBlocks[ii];
            if (info.wrapperTemplate) {
                var blocks = [];
                do {
                    blocks.push(processedBlocks[ii].block);
                    ii++;
                } while (ii < processedBlocks.length &&
                    processedBlocks[ii].wrapperTemplate === info.wrapperTemplate);
                var wrapperElement = React.cloneElement(info.wrapperTemplate, {
                    key: info.key + '-wrap',
                    'data-offset-key': info.offsetKey,
                }, blocks);
                outputBlocks.push(wrapperElement);
            }
            else {
                outputBlocks.push(info.block);
                ii++;
            }
        }
        return React.createElement("div", { "data-contents": "true" }, outputBlocks);
    };
    return DraftEditorContents;
}(React.Component));

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */
var experimentalTreeDataSupport$1 = gkx("draft_tree_data_support");
var theExport = experimentalTreeDataSupport$1 ? DraftEditorContentsExperimental : DraftEditorContents;

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
var TEXT_CLIPPING_REGEX = /\.textClipping$/;
var TEXT_TYPES = {
    'text/plain': true,
    'text/html': true,
    'text/rtf': true,
};
// Somewhat arbitrary upper bound on text size. Let's not lock up the browser.
var TEXT_SIZE_UPPER_BOUND = 5000;
/**
 * Extract the text content from a file list.
 */
function getTextContentFromFiles(files, callback) {
    var readCount = 0;
    var results = [];
    files.forEach(function (/*blob*/ file) {
        readFile(file, function (/*string*/ text) {
            readCount++;
            text && results.push(text.slice(0, TEXT_SIZE_UPPER_BOUND));
            if (readCount == files.length) {
                callback(results.join('\r'));
            }
        });
    });
}
/**
 * todo isaac: Do work to turn html/rtf into a content fragment.
 */
function readFile(file, callback) {
    if (!global.FileReader || (file.type && !(file.type in TEXT_TYPES))) {
        callback('');
        return;
    }
    if (file.type === '') {
        var contents = '';
        // Special-case text clippings, which have an empty type but include
        // `.textClipping` in the file name. `readAsText` results in an empty
        // string for text clippings, so we force the file name to serve
        // as the text value for the file.
        if (TEXT_CLIPPING_REGEX.test(file.name)) {
            contents = file.name.replace(TEXT_CLIPPING_REGEX, '');
        }
        callback(contents);
        return;
    }
    var reader = new FileReader();
    reader.onload = function () {
        var result = reader.result;
        invariant(typeof result === 'string', 'We should be calling "FileReader.readAsText" which returns a string');
        callback(result);
    };
    reader.onerror = function () {
        callback('');
    };
    reader.readAsText(file);
}

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
/**
 * Utility method for determining whether or not the value returned
 * from a handler indicates that it was handled.
 */
function isEventHandled(value) {
    return value === 'handled' || value === true;
}

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
/**
 * Get a SelectionState for the supplied mouse event.
 */
function getSelectionForEvent(event, editorState) {
    var node = null;
    var offset = null;
    var eventTargetDocument = getCorrectDocumentFromNode(event.currentTarget);
    /* $FlowFixMe(>=0.68.0 site=www,mobile) This comment suppresses an error
     * found when Flow v0.68 was deployed. To see the error delete this comment
     * and run Flow. */
    if (typeof eventTargetDocument.caretRangeFromPoint === 'function') {
        var dropRange = eventTargetDocument.caretRangeFromPoint(event.x, event.y);
        node = dropRange.startContainer;
        offset = dropRange.startOffset;
    }
    else if (event.rangeParent) {
        node = event.rangeParent;
        offset = event.rangeOffset;
    }
    else {
        return null;
    }
    node = nullthrows(node);
    offset = nullthrows(offset);
    var offsetKey = nullthrows(findAncestorOffsetKey(node));
    return getUpdatedSelectionState(editorState, offsetKey, offset, offsetKey, offset);
}
var DraftEditorDragHandler = {
    /**
     * Drag originating from input terminated.
     */
    onDragEnd: function (editor) {
        editor.exitCurrentMode();
        endDrag(editor);
    },
    /**
     * Handle data being dropped.
     */
    onDrop: function (editor, e) {
        var data = new DataTransfer(e.nativeEvent.dataTransfer);
        var editorState = editor._latestEditorState;
        var dropSelection = getSelectionForEvent(e.nativeEvent, editorState);
        e.preventDefault();
        editor._dragCount = 0;
        editor.exitCurrentMode();
        if (dropSelection == null) {
            return;
        }
        /* $FlowFixMe This comment suppresses an error found DataTransfer was typed.
         * getFiles() returns an array of <Files extends Blob>, not Blob */
        var files = data.getFiles();
        if (files.length > 0) {
            if (editor.props.handleDroppedFiles &&
                isEventHandled(editor.props.handleDroppedFiles(dropSelection, files))) {
                return;
            }
            getTextContentFromFiles(files, function (fileText) {
                fileText &&
                    editor.update(insertTextAtSelection(editorState, dropSelection, fileText));
            });
            return;
        }
        var dragType = editor._internalDrag ? 'internal' : 'external';
        if (editor.props.handleDrop &&
            isEventHandled(editor.props.handleDrop(dropSelection, data, dragType))) ;
        else if (editor._internalDrag) {
            editor.update(moveText(editorState, dropSelection));
        }
        else {
            editor.update(insertTextAtSelection(editorState, dropSelection, data.getText()));
        }
        endDrag(editor);
    },
};
function endDrag(editor) {
    editor._internalDrag = false;
    // Fix issue #1383
    // Prior to React v16.5.0 onDrop breaks onSelect event:
    // https://github.com/facebook/react/issues/11379.
    // Dispatching a mouseup event on DOM node will make it go back to normal.
    var editorNode = ReactDOM.findDOMNode(editor);
    if (editorNode) {
        var mouseUpEvent = new MouseEvent('mouseup', {
            view: getWindowForNode(editorNode),
            bubbles: true,
            cancelable: true,
        });
        editorNode.dispatchEvent(mouseUpEvent);
    }
}
function moveText(editorState, targetSelection) {
    var newContentState = DraftModifier.moveText(editorState.getCurrentContent(), editorState.getSelection(), targetSelection);
    return EditorState.push(editorState, newContentState, 'insert-fragment');
}
/**
 * Insert text at a specified selection.
 */
function insertTextAtSelection(editorState, selection, text) {
    var newContentState = DraftModifier.insertText(editorState.getCurrentContent(), selection, text, editorState.getCurrentInlineStyle());
    return EditorState.push(editorState, newContentState, 'insert-fragment');
}

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
function isSelectionAtLeafStart(editorState) {
    var selection = editorState.getSelection();
    var anchorKey = selection.getAnchorKey();
    var blockTree = editorState.getBlockTree(anchorKey);
    var offset = selection.getStartOffset();
    var isAtStart = false;
    blockTree.some(function (leafSet) {
        if (offset === leafSet.get('start')) {
            isAtStart = true;
            return true;
        }
        if (offset < leafSet.get('end')) {
            return leafSet.get('leaves').some(function (leaf) {
                var leafStart = leaf.get('start');
                if (offset === leafStart) {
                    isAtStart = true;
                    return true;
                }
                return false;
            });
        }
        return false;
    });
    return isAtStart;
}

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
// When nothing is focused, Firefox regards two characters, `'` and `/`, as
// commands that should open and focus the "quickfind" search bar. This should
// *never* happen while a contenteditable is focused, but as of v28, it
// sometimes does, even when the keypress event target is the contenteditable.
// This breaks the input. Special case these characters to ensure that when
// they are typed, we prevent default on the event to make sure not to
// trigger quickfind.
var FF_QUICKFIND_CHAR = "'";
var FF_QUICKFIND_LINK_CHAR = '/';
var isFirefox = UserAgent.isBrowser('Firefox');
function mustPreventDefaultForCharacter(character) {
    return (isFirefox &&
        (character == FF_QUICKFIND_CHAR || character == FF_QUICKFIND_LINK_CHAR));
}
/**
 * Replace the current selection with the specified text string, with the
 * inline style and entity key applied to the newly inserted text.
 */
function replaceText(editorState, text, inlineStyle, entityKey, forceSelection) {
    var contentState = DraftModifier.replaceText(editorState.getCurrentContent(), editorState.getSelection(), text, inlineStyle, entityKey);
    return EditorState.push(editorState, contentState, 'insert-characters', forceSelection);
}
/**
 * When `onBeforeInput` executes, the browser is attempting to insert a
 * character into the editor. Apply this character data to the document,
 * allowing native insertion if possible.
 *
 * Native insertion is encouraged in order to limit re-rendering and to
 * preserve spellcheck highlighting, which disappears or flashes if re-render
 * occurs on the relevant text nodes.
 */
function editOnBeforeInput(editor, e) {
    if (editor._pendingStateFromBeforeInput !== undefined) {
        editor.update(editor._pendingStateFromBeforeInput);
        editor._pendingStateFromBeforeInput = undefined;
    }
    var editorState = editor._latestEditorState;
    var chars = e.data;
    // In some cases (ex: IE ideographic space insertion) no character data
    // is provided. There's nothing to do when this happens.
    if (!chars) {
        return;
    }
    // Allow the top-level component to handle the insertion manually. This is
    // useful when triggering interesting behaviors for a character insertion,
    // Simple examples: replacing a raw text ':)' with a smile emoji or image
    // decorator, or setting a block to be a list item after typing '- ' at the
    // start of the block.
    if (editor.props.handleBeforeInput &&
        isEventHandled(editor.props.handleBeforeInput(chars, editorState, e.timeStamp))) {
        e.preventDefault();
        return;
    }
    // If selection is collapsed, conditionally allow native behavior. This
    // reduces re-renders and preserves spellcheck highlighting. If the selection
    // is not collapsed, we will re-render.
    var selection = editorState.getSelection();
    var selectionStart = selection.getStartOffset();
    var anchorKey = selection.getAnchorKey();
    if (!selection.isCollapsed()) {
        e.preventDefault();
        editor.update(replaceText(editorState, chars, editorState.getCurrentInlineStyle(), getEntityKeyForSelection(editorState.getCurrentContent(), editorState.getSelection()), true));
        return;
    }
    var newEditorState = replaceText(editorState, chars, editorState.getCurrentInlineStyle(), getEntityKeyForSelection(editorState.getCurrentContent(), editorState.getSelection()), false);
    // Bunch of different cases follow where we need to prevent native insertion.
    var mustPreventNative = false;
    if (!mustPreventNative) {
        // Browsers tend to insert text in weird places in the DOM when typing at
        // the start of a leaf, so we'll handle it ourselves.
        mustPreventNative = isSelectionAtLeafStart(editor._latestCommittedEditorState);
    }
    if (!mustPreventNative) {
        // Let's say we have a decorator that highlights hashtags. In many cases
        // we need to prevent native behavior and rerender ourselves --
        // particularly, any case *except* where the inserted characters end up
        // anywhere except exactly where you put them.
        //
        // Using [] to denote a decorated leaf, some examples:
        //
        // 1. 'hi #' and append 'f'
        // desired rendering: 'hi [#f]'
        // native rendering would be: 'hi #f' (incorrect)
        //
        // 2. 'x [#foo]' and insert '#' before 'f'
        // desired rendering: 'x #[#foo]'
        // native rendering would be: 'x [##foo]' (incorrect)
        //
        // 3. '[#foobar]' and insert ' ' between 'foo' and 'bar'
        // desired rendering: '[#foo] bar'
        // native rendering would be: '[#foo bar]' (incorrect)
        //
        // 4. '[#foo]' and delete '#' [won't use this beforeinput codepath though]
        // desired rendering: 'foo'
        // native rendering would be: '[foo]' (incorrect)
        //
        // 5. '[#foo]' and append 'b'
        // desired rendering: '[#foob]'
        // native rendering would be: '[#foob]'
        // (native insertion here would be ok for decorators like simple spans,
        // but not more complex decorators. To be safe, we need to prevent it.)
        //
        // It is safe to allow native insertion if and only if the full list of
        // decorator ranges matches what we expect native insertion to give, and
        // the range lengths have not changed. We don't need to compare the content
        // because the only possible mutation to consider here is inserting plain
        // text and decorators can't affect text content.
        var oldBlockTree = editorState.getBlockTree(anchorKey);
        var newBlockTree = newEditorState.getBlockTree(anchorKey);
        mustPreventNative =
            oldBlockTree.size !== newBlockTree.size ||
                oldBlockTree.zip(newBlockTree).some(function (_a) {
                    var oldLeafSet = _a[0], newLeafSet = _a[1];
                    // selectionStart is guaranteed to be selectionEnd here
                    var oldStart = oldLeafSet.get('start');
                    var adjustedStart = oldStart + (oldStart >= selectionStart ? chars.length : 0);
                    var oldEnd = oldLeafSet.get('end');
                    var adjustedEnd = oldEnd + (oldEnd >= selectionStart ? chars.length : 0);
                    var newStart = newLeafSet.get('start');
                    var newEnd = newLeafSet.get('end');
                    var newDecoratorKey = newLeafSet.get('decoratorKey');
                    return (
                    // Different decorators
                    oldLeafSet.get('decoratorKey') !== newDecoratorKey ||
                        // Different number of inline styles
                        oldLeafSet.get('leaves').size !== newLeafSet.get('leaves').size ||
                        // Different effective decorator position
                        adjustedStart !== newStart ||
                        adjustedEnd !== newEnd ||
                        // Decorator already existed and its length changed
                        (newDecoratorKey != null && newEnd - newStart !== oldEnd - oldStart));
                });
    }
    if (!mustPreventNative) {
        mustPreventNative = mustPreventDefaultForCharacter(chars);
    }
    if (!mustPreventNative) {
        mustPreventNative =
            nullthrows(newEditorState.getDirectionMap()).get(anchorKey) !==
                nullthrows(editorState.getDirectionMap()).get(anchorKey);
    }
    if (mustPreventNative) {
        e.preventDefault();
        newEditorState = EditorState.set(newEditorState, {
            forceSelection: true,
        });
        editor.update(newEditorState);
        return;
    }
    // We made it all the way! Let the browser do its thing and insert the char.
    newEditorState = EditorState.set(newEditorState, {
        nativelyRenderedContent: newEditorState.getCurrentContent(),
    });
    // The native event is allowed to occur. To allow user onChange handlers to
    // change the inserted text, we wait until the text is actually inserted
    // before we actually update our state. That way when we rerender, the text
    // we see in the DOM will already have been inserted properly.
    editor._pendingStateFromBeforeInput = newEditorState;
    setImmediate(function () {
        if (editor._pendingStateFromBeforeInput !== undefined) {
            editor.update(editor._pendingStateFromBeforeInput);
            editor._pendingStateFromBeforeInput = undefined;
        }
    });
}

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
function editOnBlur(editor, e) {
    // In a contentEditable element, when you select a range and then click
    // another active element, this does trigger a `blur` event but will not
    // remove the DOM selection from the contenteditable.
    // This is consistent across all browsers, but we prefer that the editor
    // behave like a textarea, where a `blur` event clears the DOM selection.
    // We therefore force the issue to be certain, checking whether the active
    // element is `body` to force it when blurring occurs within the window (as
    // opposed to clicking to another tab or window).
    var ownerDocument = e.currentTarget.ownerDocument;
    if (!Boolean(editor.props.preserveSelectionOnBlur) &&
        getActiveElement(ownerDocument) === ownerDocument.body) {
        var selection_1 = ownerDocument.defaultView.getSelection();
        var editorNode = editor.editor;
        if (selection_1.rangeCount === 1 &&
            containsNode(editorNode, selection_1.anchorNode) &&
            containsNode(editorNode, selection_1.focusNode)) {
            selection_1.removeAllRanges();
        }
    }
    var editorState = editor._latestEditorState;
    var currentSelection = editorState.getSelection();
    if (!currentSelection.getHasFocus()) {
        return;
    }
    var selection = currentSelection.set('hasFocus', false);
    editor.props.onBlur && editor.props.onBlur(e);
    editor.update(EditorState.acceptSelection(editorState, selection));
}

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
/**
 * The user has begun using an IME input system. Switching to `composite` mode
 * allows handling composition input and disables other edit behavior.
 */
function editOnCompositionStart(editor, e) {
    editor.setMode('composite');
    editor.update(EditorState.set(editor._latestEditorState, { inCompositionMode: true }));
    // Allow composition handler to interpret the compositionstart event
    editor._onCompositionStart(e);
}

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
function getFragmentFromSelection(editorState) {
    var selectionState = editorState.getSelection();
    if (selectionState.isCollapsed()) {
        return null;
    }
    return getContentStateFragment(editorState.getCurrentContent(), selectionState);
}

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
/**
 * If we have a selection, create a ContentState fragment and store
 * it in our internal clipboard. Subsequent paste events will use this
 * fragment if no external clipboard data is supplied.
 */
function editOnCopy(editor, e) {
    var editorState = editor._latestEditorState;
    var selection = editorState.getSelection();
    // No selection, so there's nothing to copy.
    if (selection.isCollapsed()) {
        e.preventDefault();
        return;
    }
    editor.setClipboard(getFragmentFromSelection(editor._latestEditorState));
}

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
function isInstanceOfNode(target) {
    // we changed the name because of having duplicate module provider (fbjs)
    if (!target || !('ownerDocument' in target)) {
        return false;
    }
    if ('ownerDocument' in target) {
        var node = target;
        if (!node.ownerDocument.defaultView) {
            return node instanceof Node;
        }
        // $FlowFixMe https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11508#issuecomment-256045682
        if (node instanceof node.ownerDocument.defaultView.Node) {
            return true;
        }
    }
    return false;
}

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
/**
 * On `cut` events, native behavior is allowed to occur so that the system
 * clipboard is set properly. This means that we need to take steps to recover
 * the editor DOM state after the `cut` has occurred in order to maintain
 * control of the component.
 *
 * In addition, we can keep a copy of the removed fragment, including all
 * styles and entities, for use as an internal paste.
 */
function editOnCut(editor, e) {
    var editorState = editor._latestEditorState;
    var selection = editorState.getSelection();
    var element = e.target;
    var scrollPosition;
    // No selection, so there's nothing to cut.
    if (selection.isCollapsed()) {
        e.preventDefault();
        return;
    }
    // Track the current scroll position so that it can be forced back in place
    // after the editor regains control of the DOM.
    if (isInstanceOfNode(element)) {
        var node = element;
        scrollPosition = getScrollPosition(Style.getScrollParent(node));
    }
    var fragment = getFragmentFromSelection(editorState);
    editor.setClipboard(fragment);
    // Set `cut` mode to disable all event handling temporarily.
    editor.setMode('cut');
    // Let native `cut` behavior occur, then recover control.
    setTimeout(function () {
        editor.restoreEditorDOM(scrollPosition);
        editor.exitCurrentMode();
        editor.update(removeFragment(editorState));
    }, 0);
}
function removeFragment(editorState) {
    var newContent = DraftModifier.removeRange(editorState.getCurrentContent(), editorState.getSelection(), 'forward');
    return EditorState.push(editorState, newContent, 'remove-range');
}

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
/**
 * Drag behavior has begun from outside the editor element.
 */
function editOnDragOver(editor, e) {
    editor.setMode('drag');
    e.preventDefault();
}

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
/**
 * A `dragstart` event has begun within the text editor component.
 */
function editOnDragStart(editor) {
    editor._internalDrag = true;
    editor.setMode('drag');
}

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
function editOnFocus(editor, e) {
    var editorState = editor._latestEditorState;
    var currentSelection = editorState.getSelection();
    if (currentSelection.getHasFocus()) {
        return;
    }
    var selection = currentSelection.set('hasFocus', true);
    editor.props.onFocus && editor.props.onFocus(e);
    // When the tab containing this text editor is hidden and the user does a
    // find-in-page in a _different_ tab, Chrome on Mac likes to forget what the
    // selection was right after sending this focus event and (if you let it)
    // moves the cursor back to the beginning of the editor, so we force the
    // selection here instead of simply accepting it in order to preserve the
    // old cursor position. See https://crbug.com/540004.
    // But it looks like this is fixed in Chrome 60.0.3081.0.
    // Other browsers also don't have this bug, so we prefer to acceptSelection
    // when possible, to ensure that unfocusing and refocusing a Draft editor
    // doesn't preserve the selection, matching how textareas work.
    if (UserAgent.isBrowser('Chrome < 60.0.3081.0')) {
        editor.update(EditorState.forceSelection(editorState, selection));
    }
    else {
        editor.update(EditorState.acceptSelection(editorState, selection));
    }
}

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
/**
 * Given a collapsed selection, move the focus `maxDistance` backward within
 * the selected block. If the selection will go beyond the start of the block,
 * move focus to the end of the previous block, but no further.
 *
 * This function is not Unicode-aware, so surrogate pairs will be treated
 * as having length 2.
 */
function moveSelectionBackward(editorState, maxDistance) {
    var selection = editorState.getSelection();
    // Should eventually make this an invariant
    warning(selection.isCollapsed(), 'moveSelectionBackward should only be called with a collapsed SelectionState');
    var content = editorState.getCurrentContent();
    var key = selection.getStartKey();
    var offset = selection.getStartOffset();
    var focusKey = key;
    var focusOffset = 0;
    if (maxDistance > offset) {
        var keyBefore = content.getKeyBefore(key);
        if (keyBefore == null) {
            focusKey = key;
        }
        else {
            focusKey = keyBefore;
            var blockBefore = content.getBlockForKey(keyBefore);
            focusOffset = blockBefore.getText().length;
        }
    }
    else {
        focusOffset = offset - maxDistance;
    }
    return selection.merge({
        focusKey: focusKey,
        focusOffset: focusOffset,
        isBackward: true,
    });
}

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
var experimentalTreeDataSupport$2 = gkx('draft_tree_data_support');
/**
 * For a collapsed selection state, remove text based on the specified strategy.
 * If the selection state is not collapsed, remove the entire selected range.
 */
function removeTextWithStrategy(editorState, strategy, direction) {
    var selection = editorState.getSelection();
    var content = editorState.getCurrentContent();
    var target = selection;
    var anchorKey = selection.getAnchorKey();
    var focusKey = selection.getFocusKey();
    var anchorBlock = content.getBlockForKey(anchorKey);
    if (experimentalTreeDataSupport$2) {
        if (direction === 'forward') {
            if (anchorKey !== focusKey) {
                // For now we ignore forward delete across blocks,
                // if there is demand for this we will implement it.
                return content;
            }
        }
    }
    if (selection.isCollapsed()) {
        if (direction === 'forward') {
            if (editorState.isSelectionAtEndOfContent()) {
                return content;
            }
            if (experimentalTreeDataSupport$2) {
                var isAtEndOfBlock = selection.getAnchorOffset() ===
                    content.getBlockForKey(anchorKey).getLength();
                if (isAtEndOfBlock) {
                    var anchorBlockSibling = content.getBlockForKey(anchorBlock.nextSibling);
                    if (!anchorBlockSibling || anchorBlockSibling.getLength() === 0) {
                        // For now we ignore forward delete at the end of a block,
                        // if there is demand for this we will implement it.
                        return content;
                    }
                }
            }
        }
        else if (editorState.isSelectionAtStartOfContent()) {
            return content;
        }
        target = strategy(editorState);
        if (target === selection) {
            return content;
        }
    }
    return DraftModifier.removeRange(content, target, direction);
}

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
/**
 * Remove the selected range. If the cursor is collapsed, remove the preceding
 * character. This operation is Unicode-aware, so removing a single character
 * will remove a surrogate pair properly as well.
 */
function keyCommandPlainBackspace(editorState) {
    var afterRemoval = removeTextWithStrategy(editorState, function (strategyState) {
        var selection = strategyState.getSelection();
        var content = strategyState.getCurrentContent();
        var key = selection.getAnchorKey();
        var offset = selection.getAnchorOffset();
        var charBehind = content.getBlockForKey(key).getText()[offset - 1];
        return moveSelectionBackward(strategyState, charBehind ? UnicodeUtils.getUTF16Length(charBehind, 0) : 1);
    }, 'backward');
    if (afterRemoval === editorState.getCurrentContent()) {
        return editorState;
    }
    var selection = editorState.getSelection();
    return EditorState.push(editorState, afterRemoval.set('selectionBefore', selection), selection.isCollapsed() ? 'backspace-character' : 'remove-range');
}

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
var isGecko = UserAgent.isEngine('Gecko');
var DOUBLE_NEWLINE = '\n\n';
function onInputType(inputType, editorState) {
    switch (inputType) {
        case 'deleteContentBackward':
            return keyCommandPlainBackspace(editorState);
    }
    return editorState;
}
/**
 * This function serves two purposes
 *
 * 1. To update the editorState and call onChange method with the new
 * editorState. This editorState is calculated in editOnBeforeInput but the
 * onChange method is not called with the new state until this method does it.
 * It is done to handle a specific case where certain character inputs might
 * be replaced with something else. E.g. snippets ('rc' might be replaced
 * with boilerplate code for react component). More information on the
 * exact problem can be found here -
 * https://github.com/facebook/draft-js/commit/07892ba479bd4dfc6afd1e0ed179aaf51cd138b1
 *
 * 2. intended to handle spellcheck and autocorrect changes,
 * which occur in the DOM natively without any opportunity to observe or
 * interpret the changes before they occur.
 *
 * The `input` event fires in contentEditable elements reliably for non-IE
 * browsers, immediately after changes occur to the editor DOM. Since our other
 * handlers override or otherwise handle cover other varieties of text input,
 * the DOM state should match the model in all controlled input cases. Thus,
 * when an `input` change leads to a DOM/model mismatch, the change should be
 * due to a spellcheck change, and we can incorporate it into our model.
 */
function editOnInput(editor, e) {
    if (editor._pendingStateFromBeforeInput !== undefined) {
        editor.update(editor._pendingStateFromBeforeInput);
        editor._pendingStateFromBeforeInput = undefined;
    }
    // at this point editor is not null for sure (after input)
    var castedEditorElement = editor.editor;
    var domSelection = castedEditorElement.ownerDocument.defaultView.getSelection();
    var anchorNode = domSelection.anchorNode, isCollapsed = domSelection.isCollapsed;
    var isNotTextOrElementNode = anchorNode.nodeType !== Node.TEXT_NODE &&
        anchorNode.nodeType !== Node.ELEMENT_NODE;
    if (isNotTextOrElementNode) {
        // TODO: (t16149272) figure out context for this change
        return;
    }
    if (anchorNode.nodeType === Node.TEXT_NODE &&
        (anchorNode.previousSibling !== null || anchorNode.nextSibling !== null)) {
        // When typing at the beginning of a visual line, Chrome splits the text
        // nodes into two. Why? No one knows. This commit is suspicious:
        // https://chromium.googlesource.com/chromium/src/+/a3b600981286b135632371477f902214c55a1724
        // To work around, we'll merge the sibling text nodes back into this one.
        var span = anchorNode.parentNode;
        anchorNode.nodeValue = span.textContent;
        for (var child = span.firstChild; child !== null; child = child.nextSibling) {
            if (child !== anchorNode) {
                span.removeChild(child);
            }
        }
    }
    var domText = anchorNode.textContent;
    var editorState = editor._latestEditorState;
    var offsetKey = nullthrows(findAncestorOffsetKey(anchorNode));
    var _a = DraftOffsetKey.decode(offsetKey), blockKey = _a.blockKey, decoratorKey = _a.decoratorKey, leafKey = _a.leafKey;
    var _b = editorState
        .getBlockTree(blockKey)
        .getIn([decoratorKey, 'leaves', leafKey]), start = _b.start, end = _b.end;
    var content = editorState.getCurrentContent();
    var block = content.getBlockForKey(blockKey);
    var modelText = block.getText().slice(start, end);
    // Special-case soft newlines here. If the DOM text ends in a soft newline,
    // we will have manually inserted an extra soft newline in DraftEditorLeaf.
    // We want to remove this extra newline for the purpose of our comparison
    // of DOM and model text.
    if (domText.endsWith(DOUBLE_NEWLINE)) {
        domText = domText.slice(0, -1);
    }
    // No change -- the DOM is up to date. Nothing to do here.
    if (domText === modelText) {
        // This can be buggy for some Android keyboards because they don't fire
        // standard onkeydown/pressed events and only fired editOnInput
        // so domText is already changed by the browser and ends up being equal
        // to modelText unexpectedly.
        // Newest versions of Android support the dom-inputevent-inputtype
        // and we can use the `inputType` to properly apply the state changes.
        /* $FlowFixMe inputType is only defined on a draft of a standard.
         * https://w3c.github.io/input-events/#dom-inputevent-inputtype */
        var inputType = e.nativeEvent.inputType;
        if (inputType) {
            var newEditorState = onInputType(inputType, editorState);
            if (newEditorState !== editorState) {
                editor.restoreEditorDOM();
                editor.update(newEditorState);
                return;
            }
        }
        return;
    }
    var selection = editorState.getSelection();
    // We'll replace the entire leaf with the text content of the target.
    var targetRange = selection.merge({
        anchorOffset: start,
        focusOffset: end,
        isBackward: false,
    });
    var entityKey = block.getEntityAt(start);
    var entity = notEmptyKey(entityKey) ? content.getEntity(entityKey) : null;
    var entityType = entity != null ? entity.getMutability() : null;
    var preserveEntity = entityType === 'MUTABLE';
    // Immutable or segmented entities cannot properly be handled by the
    // default browser undo, so we have to use a different change type to
    // force using our internal undo method instead of falling through to the
    // native browser undo.
    var changeType = preserveEntity ? 'spellcheck-change' : 'apply-entity';
    var newContent = DraftModifier.replaceText(content, targetRange, domText, block.getInlineStyleAt(start), preserveEntity ? block.getEntityAt(start) : null);
    var anchorOffset, focusOffset, startOffset, endOffset;
    if (isGecko) {
        // Firefox selection does not change while the context menu is open, so
        // we preserve the anchor and focus values of the DOM selection.
        anchorOffset = domSelection.anchorOffset;
        focusOffset = domSelection.focusOffset;
        startOffset = start + Math.min(anchorOffset, focusOffset);
        endOffset = startOffset + Math.abs(anchorOffset - focusOffset);
        anchorOffset = startOffset;
        focusOffset = endOffset;
    }
    else {
        // Browsers other than Firefox may adjust DOM selection while the context
        // menu is open, and Safari autocorrect is prone to providing an inaccurate
        // DOM selection. Don't trust it. Instead, use our existing SelectionState
        // and adjust it based on the number of characters changed during the
        // mutation.
        var charDelta = domText.length - modelText.length;
        startOffset = selection.getStartOffset();
        endOffset = selection.getEndOffset();
        anchorOffset = isCollapsed ? endOffset + charDelta : startOffset;
        focusOffset = endOffset + charDelta;
    }
    // Segmented entities are completely or partially removed when their
    // text content changes. For this case we do not want any text to be selected
    // after the change, so we are not merging the selection.
    var contentWithAdjustedDOMSelection = newContent.merge({
        selectionBefore: content.getSelectionAfter(),
        selectionAfter: selection.merge({ anchorOffset: anchorOffset, focusOffset: focusOffset }),
    });
    editor.update(EditorState.push(editorState, contentWithAdjustedDOMSelection, changeType));
}

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
function isSoftNewlineEvent(e) {
    return (e.which === Keys.RETURN &&
        (e.getModifierState('Shift') ||
            e.getModifierState('Alt') ||
            e.getModifierState('Control')));
}

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
var isOSX = UserAgent.isPlatform('Mac OS X');
var KeyBindingUtil = {
    /**
     * Check whether the ctrlKey modifier is *not* being used in conjunction with
     * the altKey modifier. If they are combined, the result is an `altGraph`
     * key modifier, which should not be handled by this set of key bindings.
     */
    isCtrlKeyCommand: function (e) {
        return !!e.ctrlKey && !e.altKey;
    },
    isOptionKeyCommand: function (e) {
        return isOSX && e.altKey;
    },
    usesMacOSHeuristics: function () {
        return isOSX;
    },
    hasCommandModifier: function (e) {
        return isOSX
            ? !!e.metaKey && !e.altKey
            : KeyBindingUtil.isCtrlKeyCommand(e);
    },
    isSoftNewlineEvent: isSoftNewlineEvent,
};

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
var clipboard = null;
/**
 * Some systems offer a "secondary" clipboard to allow quick internal cut
 * and paste behavior. For instance, Ctrl+K (cut) and Ctrl+Y (paste).
 */
var SecondaryClipboard = {
    cut: function (editorState) {
        var content = editorState.getCurrentContent();
        var selection = editorState.getSelection();
        var targetRange = null;
        if (selection.isCollapsed()) {
            var anchorKey = selection.getAnchorKey();
            var blockEnd = content.getBlockForKey(anchorKey).getLength();
            if (blockEnd === selection.getAnchorOffset()) {
                var keyAfter = content.getKeyAfter(anchorKey);
                if (keyAfter == null) {
                    return editorState;
                }
                targetRange = selection.set('focusKey', keyAfter).set('focusOffset', 0);
            }
            else {
                targetRange = selection.set('focusOffset', blockEnd);
            }
        }
        else {
            targetRange = selection;
        }
        targetRange = nullthrows(targetRange);
        // TODO: This should actually append to the current state when doing
        // successive ^K commands without any other cursor movement
        clipboard = getContentStateFragment(content, targetRange);
        var afterRemoval = DraftModifier.removeRange(content, targetRange, 'forward');
        if (afterRemoval === content) {
            return editorState;
        }
        return EditorState.push(editorState, afterRemoval, 'remove-range');
    },
    paste: function (editorState) {
        if (!clipboard) {
            return editorState;
        }
        var newContent = DraftModifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), clipboard);
        return EditorState.push(editorState, newContent, 'insert-fragment');
    },
};

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
var isChrome = UserAgent.isBrowser('Chrome');
// In Chrome, the client rects will include the entire bounds of all nodes that
// begin (have a start tag) within the selection, even if the selection does
// not overlap the entire node. To resolve this, we split the range at each
// start tag and join the client rects together.
// https://code.google.com/p/chromium/issues/detail?id=324437
/* eslint-disable consistent-return */
function getRangeClientRectsChrome(range) {
    var tempRange = range.cloneRange();
    var clientRects = [];
    for (var ancestor = range.endContainer; ancestor != null; ancestor = ancestor.parentNode) {
        // If we've climbed up to the common ancestor, we can now use the
        // original start point and stop climbing the tree.
        var atCommonAncestor = ancestor === range.commonAncestorContainer;
        if (atCommonAncestor) {
            tempRange.setStart(range.startContainer, range.startOffset);
        }
        else {
            tempRange.setStart(tempRange.endContainer, 0);
        }
        var rects = Array.from(tempRange.getClientRects());
        clientRects.push(rects);
        if (atCommonAncestor) {
            clientRects.reverse();
            return [].concat.apply([], clientRects);
        }
        tempRange.setEndBefore(ancestor);
    }
    invariant(false, 'Found an unexpected detached subtree when getting range client rects.');
}
/* eslint-enable consistent-return */
/**
 * Like range.getClientRects() but normalizes for browser bugs.
 */
var getRangeClientRects = (isChrome
    ? getRangeClientRectsChrome
    : function (range) {
        return Array.from(range.getClientRects());
    });

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
/**
 * Return the computed line height, in pixels, for the provided element.
 */
function getLineHeightPx(element) {
    var computed = getComputedStyle(element);
    var correctDocument = getCorrectDocumentFromNode(element);
    var div = correctDocument.createElement('div');
    div.style.fontFamily = computed.fontFamily;
    div.style.fontSize = computed.fontSize;
    div.style.fontStyle = computed.fontStyle;
    div.style.fontWeight = computed.fontWeight;
    div.style.lineHeight = computed.lineHeight;
    div.style.position = 'absolute';
    div.textContent = 'M';
    var documentBody = correctDocument.body;
    invariant(documentBody, 'Missing document.body');
    // forced layout here
    documentBody.appendChild(div);
    var rect = div.getBoundingClientRect();
    documentBody.removeChild(div);
    return rect.height;
}
/**
 * Return whether every ClientRect in the provided list lies on the same line.
 *
 * We assume that the rects on the same line all contain the baseline, so the
 * lowest top line needs to be above the highest bottom line (i.e., if you were
 * to project the rects onto the y-axis, their intersection would be nonempty).
 *
 * In addition, we requi re that no two boxes are lineHeight (or more) apart at
 * either top or bottom, which helps protect against false positives for fonts
 * with extremely large glyph heights (e.g., with a font size of 17px, Zapfino
 * produces rects of height 58px!).
 */
function areRectsOnOneLine(rects, lineHeight) {
    var minTop = Infinity;
    var minBottom = Infinity;
    var maxTop = -Infinity;
    var maxBottom = -Infinity;
    for (var ii = 0; ii < rects.length; ii++) {
        var rect = rects[ii];
        if (rect.width === 0 || rect.width === 1) {
            // When a range starts or ends a soft wrap, many browsers (Chrome, IE,
            // Safari) include an empty rect on the previous or next line. When the
            // text lies in a container whose position is not integral (e.g., from
            // margin: auto), Safari makes these empty rects have width 1 (instead of
            // 0). Having one-pixel-wide characters seems unlikely (and most browsers
            // report widths in subpixel precision anyway) so it's relatively safe to
            // skip over them.
            continue;
        }
        minTop = Math.min(minTop, rect.top);
        minBottom = Math.min(minBottom, rect.bottom);
        maxTop = Math.max(maxTop, rect.top);
        maxBottom = Math.max(maxBottom, rect.bottom);
    }
    return (maxTop <= minBottom &&
        maxTop - minTop < lineHeight &&
        maxBottom - minBottom < lineHeight);
}
/**
 * Return the length of a node, as used by Range offsets.
 */
function getNodeLength$1(node) {
    // http://www.w3.org/TR/dom/#concept-node-length
    switch (node.nodeType) {
        case Node.DOCUMENT_TYPE_NODE:
            return 0;
        case Node.TEXT_NODE:
        case Node.PROCESSING_INSTRUCTION_NODE:
        case Node.COMMENT_NODE:
            return node.length;
        default:
            return node.childNodes.length;
    }
}
/**
 * Given a collapsed range, move the start position backwards as far as
 * possible while the range still spans only a single line.
 */
function expandRangeToStartOfLine(range) {
    invariant(range.collapsed, 'expandRangeToStartOfLine: Provided range is not collapsed.');
    range = range.cloneRange();
    var containingElement = range.startContainer;
    if (containingElement.nodeType !== 1) {
        containingElement = containingElement.parentNode;
    }
    var lineHeight = getLineHeightPx(containingElement);
    // Imagine our text looks like:
    //   <div><span>once upon a time, there was a <em>boy
    //   who lived</em> </span><q><strong>under^ the
    //   stairs</strong> in a small closet.</q></div>
    // where the caret represents the cursor. First, we crawl up the tree until
    // the range spans multiple lines (setting the start point to before
    // "<strong>", then before "<div>"), then at each level we do a search to
    // find the latest point which is still on a previous line. We'll find that
    // the break point is inside the span, then inside the <em>, then in its text
    // node child, the actual break point before "who".
    var bestContainer = range.endContainer;
    var bestOffset = range.endOffset;
    range.setStart(range.startContainer, 0);
    while (areRectsOnOneLine(getRangeClientRects(range), lineHeight)) {
        bestContainer = range.startContainer;
        bestOffset = range.startOffset;
        invariant(bestContainer.parentNode, 'Found unexpected detached subtree when traversing.');
        range.setStartBefore(bestContainer);
        if (bestContainer.nodeType === 1 &&
            getComputedStyle(bestContainer).display !== 'inline') {
            // The start of the line is never in a different block-level container.
            break;
        }
    }
    // In the above example, range now spans from "<div>" to "under",
    // bestContainer is <div>, and bestOffset is 1 (index of <q> inside <div>)].
    // Picking out which child to recurse into here is a special case since we
    // don't want to check past <q> -- once we find that the final range starts
    // in <span>, we can look at all of its children (and all of their children)
    // to find the break point.
    // At all times, (bestContainer, bestOffset) is the latest single-line start
    // point that we know of.
    var currentContainer = bestContainer;
    var maxIndexToConsider = bestOffset - 1;
    do {
        var nodeValue = currentContainer.nodeValue;
        var ii = maxIndexToConsider;
        for (; ii >= 0; ii--) {
            if (nodeValue != null &&
                ii > 0 &&
                UnicodeUtils.isSurrogatePair(nodeValue, ii - 1)) {
                // We're in the middle of a surrogate pair -- skip over so we never
                // return a range with an endpoint in the middle of a code point.
                continue;
            }
            range.setStart(currentContainer, ii);
            if (areRectsOnOneLine(getRangeClientRects(range), lineHeight)) {
                bestContainer = currentContainer;
                bestOffset = ii;
            }
            else {
                break;
            }
        }
        if (ii === -1 || currentContainer.childNodes.length === 0) {
            // If ii === -1, then (bestContainer, bestOffset), which is equal to
            // (currentContainer, 0), was a single-line start point but a start
            // point before currentContainer wasn't, so the line break seems to
            // have occurred immediately after currentContainer's start tag
            //
            // If currentContainer.childNodes.length === 0, we're already at a
            // terminal node (e.g., text node) and should return our current best.
            break;
        }
        currentContainer = currentContainer.childNodes[ii];
        maxIndexToConsider = getNodeLength$1(currentContainer);
    } while (true);
    range.setStart(bestContainer, bestOffset);
    return range;
}

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
function keyCommandBackspaceToStartOfLine(editorState, e) {
    var afterRemoval = removeTextWithStrategy(editorState, function (strategyState) {
        var selection = strategyState.getSelection();
        if (selection.isCollapsed() && selection.getAnchorOffset() === 0) {
            return moveSelectionBackward(strategyState, 1);
        }
        var ownerDocument = e.currentTarget.ownerDocument;
        var domSelection = ownerDocument.defaultView.getSelection();
        var range = domSelection.getRangeAt(0);
        range = expandRangeToStartOfLine(range);
        return getDraftEditorSelectionWithNodes(strategyState, null, range.endContainer, range.endOffset, range.startContainer, range.startOffset).selectionState;
    }, 'backward');
    if (afterRemoval === editorState.getCurrentContent()) {
        return editorState;
    }
    return EditorState.push(editorState, afterRemoval, 'remove-range');
}

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
var punctuation = TokenizeUtil.getPunctuation();
// The apostrophe and curly single quotes behave in a curious way: when
// surrounded on both sides by word characters, they behave as word chars; when
// either neighbor is punctuation or an end of the string, they behave as
// punctuation.
var CHAMELEON_CHARS = "['\u2018\u2019]";
// Remove the underscore, which should count as part of the removable word. The
// "chameleon chars" also count as punctuation in this regex.
var WHITESPACE_AND_PUNCTUATION = '\\s|(?![_])' + punctuation;
var DELETE_STRING = '^' +
    '(?:' +
    WHITESPACE_AND_PUNCTUATION +
    ')*' +
    '(?:' +
    CHAMELEON_CHARS +
    '|(?!' +
    WHITESPACE_AND_PUNCTUATION +
    ').)*' +
    '(?:(?!' +
    WHITESPACE_AND_PUNCTUATION +
    ').)';
var DELETE_REGEX = new RegExp(DELETE_STRING);
var BACKSPACE_STRING = '(?:(?!' +
    WHITESPACE_AND_PUNCTUATION +
    ').)' +
    '(?:' +
    CHAMELEON_CHARS +
    '|(?!' +
    WHITESPACE_AND_PUNCTUATION +
    ').)*' +
    '(?:' +
    WHITESPACE_AND_PUNCTUATION +
    ')*' +
    '$';
var BACKSPACE_REGEX = new RegExp(BACKSPACE_STRING);
function getRemovableWord(text, isBackward) {
    var matches = isBackward
        ? BACKSPACE_REGEX.exec(text)
        : DELETE_REGEX.exec(text);
    return matches ? matches[0] : text;
}
var DraftRemovableWord = {
    getBackward: function (text) {
        return getRemovableWord(text, true);
    },
    getForward: function (text) {
        return getRemovableWord(text, false);
    },
};

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
/**
 * Delete the word that is left of the cursor, as well as any spaces or
 * punctuation after the word.
 */
function keyCommandBackspaceWord(editorState) {
    var afterRemoval = removeTextWithStrategy(editorState, function (strategyState) {
        var selection = strategyState.getSelection();
        var offset = selection.getStartOffset();
        // If there are no words before the cursor, remove the preceding newline.
        if (offset === 0) {
            return moveSelectionBackward(strategyState, 1);
        }
        var key = selection.getStartKey();
        var content = strategyState.getCurrentContent();
        var text = content
            .getBlockForKey(key)
            .getText()
            .slice(0, offset);
        var toRemove = DraftRemovableWord.getBackward(text);
        return moveSelectionBackward(strategyState, toRemove.length || 1);
    }, 'backward');
    if (afterRemoval === editorState.getCurrentContent()) {
        return editorState;
    }
    return EditorState.push(editorState, afterRemoval, 'remove-range');
}

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
/**
 * Given a collapsed selection, move the focus `maxDistance` forward within
 * the selected block. If the selection will go beyond the end of the block,
 * move focus to the start of the next block, but no further.
 *
 * This function is not Unicode-aware, so surrogate pairs will be treated
 * as having length 2.
 */
function moveSelectionForward(editorState, maxDistance) {
    var selection = editorState.getSelection();
    // Should eventually make this an invariant
    warning(selection.isCollapsed(), 'moveSelectionForward should only be called with a collapsed SelectionState');
    var key = selection.getStartKey();
    var offset = selection.getStartOffset();
    var content = editorState.getCurrentContent();
    var focusKey = key;
    var focusOffset;
    var block = content.getBlockForKey(key);
    if (maxDistance > block.getText().length - offset) {
        focusKey = content.getKeyAfter(key);
        focusOffset = 0;
    }
    else {
        focusOffset = offset + maxDistance;
    }
    return selection.merge({ focusKey: focusKey, focusOffset: focusOffset });
}

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
/**
 * Delete the word that is right of the cursor, as well as any spaces or
 * punctuation before the word.
 */
function keyCommandDeleteWord(editorState) {
    var afterRemoval = removeTextWithStrategy(editorState, function (strategyState) {
        var selection = strategyState.getSelection();
        var offset = selection.getStartOffset();
        var key = selection.getStartKey();
        var content = strategyState.getCurrentContent();
        var text = content
            .getBlockForKey(key)
            .getText()
            .slice(offset);
        var toRemove = DraftRemovableWord.getForward(text);
        // If there are no words in front of the cursor, remove the newline.
        return moveSelectionForward(strategyState, toRemove.length || 1);
    }, 'forward');
    if (afterRemoval === editorState.getCurrentContent()) {
        return editorState;
    }
    return EditorState.push(editorState, afterRemoval, 'remove-range');
}

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
function keyCommandInsertNewline(editorState) {
    var contentState = DraftModifier.splitBlock(editorState.getCurrentContent(), editorState.getSelection());
    return EditorState.push(editorState, contentState, 'split-block');
}

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
/**
 * See comment for `moveSelectionToStartOfBlock`.
 */
function keyCommandMoveSelectionToEndOfBlock(editorState) {
    var selection = editorState.getSelection();
    var endKey = selection.getEndKey();
    var content = editorState.getCurrentContent();
    var textLength = content.getBlockForKey(endKey).getLength();
    return EditorState.set(editorState, {
        selection: selection.merge({
            anchorKey: endKey,
            anchorOffset: textLength,
            focusKey: endKey,
            focusOffset: textLength,
            isBackward: false,
        }),
        forceSelection: true,
    });
}

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
/**
 * Collapse selection at the start of the first selected block. This is used
 * for Firefox versions that attempt to navigate forward/backward instead of
 * moving the cursor. Other browsers are able to move the cursor natively.
 */
function keyCommandMoveSelectionToStartOfBlock(editorState) {
    var selection = editorState.getSelection();
    var startKey = selection.getStartKey();
    return EditorState.set(editorState, {
        selection: selection.merge({
            anchorKey: startKey,
            anchorOffset: 0,
            focusKey: startKey,
            focusOffset: 0,
            isBackward: false,
        }),
        forceSelection: true,
    });
}

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
/**
 * Remove the selected range. If the cursor is collapsed, remove the following
 * character. This operation is Unicode-aware, so removing a single character
 * will remove a surrogate pair properly as well.
 */
function keyCommandPlainDelete(editorState) {
    var afterRemoval = removeTextWithStrategy(editorState, function (strategyState) {
        var selection = strategyState.getSelection();
        var content = strategyState.getCurrentContent();
        var key = selection.getAnchorKey();
        var offset = selection.getAnchorOffset();
        var charAhead = content.getBlockForKey(key).getText()[offset];
        return moveSelectionForward(strategyState, charAhead ? UnicodeUtils.getUTF16Length(charAhead, 0) : 1);
    }, 'forward');
    if (afterRemoval === editorState.getCurrentContent()) {
        return editorState;
    }
    var selection = editorState.getSelection();
    return EditorState.push(editorState, afterRemoval.set('selectionBefore', selection), selection.isCollapsed() ? 'delete-character' : 'remove-range');
}

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
/**
 * Transpose the characters on either side of a collapsed cursor, or
 * if the cursor is at the end of the block, transpose the last two
 * characters.
 */
function keyCommandTransposeCharacters(editorState) {
    var selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
        return editorState;
    }
    var offset = selection.getAnchorOffset();
    if (offset === 0) {
        return editorState;
    }
    var blockKey = selection.getAnchorKey();
    var content = editorState.getCurrentContent();
    var block = content.getBlockForKey(blockKey);
    var length = block.getLength();
    // Nothing to transpose if there aren't two characters.
    if (length <= 1) {
        return editorState;
    }
    var removalRange;
    var finalSelection;
    if (offset === length) {
        // The cursor is at the end of the block. Swap the last two characters.
        removalRange = selection.set('anchorOffset', offset - 1);
        finalSelection = selection;
    }
    else {
        removalRange = selection.set('focusOffset', offset + 1);
        finalSelection = removalRange.set('anchorOffset', offset + 1);
    }
    // Extract the character to move as a fragment. This preserves its
    // styling and entity, if any.
    var movedFragment = getContentStateFragment(content, removalRange);
    var afterRemoval = DraftModifier.removeRange(content, removalRange, 'backward');
    // After the removal, the insertion target is one character back.
    var selectionAfter = afterRemoval.getSelectionAfter();
    var targetOffset = selectionAfter.getAnchorOffset() - 1;
    var targetRange = selectionAfter.merge({
        anchorOffset: targetOffset,
        focusOffset: targetOffset,
    });
    var afterInsert = DraftModifier.replaceWithFragment(afterRemoval, targetRange, movedFragment);
    var newEditorState = EditorState.push(editorState, afterInsert, 'insert-fragment');
    return EditorState.acceptSelection(newEditorState, finalSelection);
}

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
function keyCommandUndo(e, editorState, updateFn) {
    var undoneState = EditorState.undo(editorState);
    // If the last change to occur was a spellcheck change, allow the undo
    // event to fall through to the browser. This allows the browser to record
    // the unwanted change, which should soon lead it to learn not to suggest
    // the correction again.
    if (editorState.getLastChangeType() === 'spellcheck-change') {
        var nativelyRenderedContent = undoneState.getCurrentContent();
        updateFn(EditorState.set(undoneState, { nativelyRenderedContent: nativelyRenderedContent }));
        return;
    }
    // Otheriwse, manage the undo behavior manually.
    e.preventDefault();
    if (!editorState.getNativelyRenderedContent()) {
        updateFn(undoneState);
        return;
    }
    // Trigger a re-render with the current content state to ensure that the
    // component tree has up-to-date props for comparison.
    updateFn(EditorState.set(editorState, { nativelyRenderedContent: null }));
    // Wait to ensure that the re-render has occurred before performing
    // the undo action.
    setTimeout(function () {
        updateFn(undoneState);
    }, 0);
}

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
var isOptionKeyCommand = KeyBindingUtil.isOptionKeyCommand;
var isChrome$1 = UserAgent.isBrowser('Chrome');
/**
 * Map a `DraftEditorCommand` command value to a corresponding function.
 */
function onKeyCommand(command, editorState, e) {
    switch (command) {
        case 'redo':
            return EditorState.redo(editorState);
        case 'delete':
            return keyCommandPlainDelete(editorState);
        case 'delete-word':
            return keyCommandDeleteWord(editorState);
        case 'backspace':
            return keyCommandPlainBackspace(editorState);
        case 'backspace-word':
            return keyCommandBackspaceWord(editorState);
        case 'backspace-to-start-of-line':
            return keyCommandBackspaceToStartOfLine(editorState, e);
        case 'split-block':
            return keyCommandInsertNewline(editorState);
        case 'transpose-characters':
            return keyCommandTransposeCharacters(editorState);
        case 'move-selection-to-start-of-block':
            return keyCommandMoveSelectionToStartOfBlock(editorState);
        case 'move-selection-to-end-of-block':
            return keyCommandMoveSelectionToEndOfBlock(editorState);
        case 'secondary-cut':
            return SecondaryClipboard.cut(editorState);
        case 'secondary-paste':
            return SecondaryClipboard.paste(editorState);
        default:
            return editorState;
    }
}
/**
 * Intercept keydown behavior to handle keys and commands manually, if desired.
 *
 * Keydown combinations may be mapped to `DraftCommand` values, which may
 * correspond to command functions that modify the editor or its contents.
 *
 * See `getDefaultKeyBinding` for defaults. Alternatively, the top-level
 * component may provide a custom mapping via the `keyBindingFn` prop.
 */
function editOnKeyDown(editor, e) {
    var keyCode = e.which;
    var editorState = editor._latestEditorState;
    function callDeprecatedHandler(handlerName) {
        var deprecatedHandler = editor.props[handlerName];
        if (deprecatedHandler) {
            deprecatedHandler(e);
            return true;
        }
        else {
            return false;
        }
    }
    switch (keyCode) {
        case Keys.RETURN:
            e.preventDefault();
            // The top-level component may manually handle newline insertion. If
            // no special handling is performed, fall through to command handling.
            if (editor.props.handleReturn &&
                isEventHandled(editor.props.handleReturn(e, editorState))) {
                return;
            }
            break;
        case Keys.ESC:
            e.preventDefault();
            if (callDeprecatedHandler('onEscape')) {
                return;
            }
            break;
        case Keys.TAB:
            if (callDeprecatedHandler('onTab')) {
                return;
            }
            break;
        case Keys.UP:
            if (callDeprecatedHandler('onUpArrow')) {
                return;
            }
            break;
        case Keys.RIGHT:
            if (callDeprecatedHandler('onRightArrow')) {
                return;
            }
            break;
        case Keys.DOWN:
            if (callDeprecatedHandler('onDownArrow')) {
                return;
            }
            break;
        case Keys.LEFT:
            if (callDeprecatedHandler('onLeftArrow')) {
                return;
            }
            break;
        case Keys.SPACE:
            // Prevent Chrome on OSX behavior where option + space scrolls.
            if (isChrome$1 && isOptionKeyCommand(e)) {
                e.preventDefault();
            }
    }
    var command = editor.props.keyBindingFn(e);
    // If no command is specified, allow keydown event to continue.
    if (command == null || command === '') {
        if (keyCode === Keys.SPACE && isChrome$1 && isOptionKeyCommand(e)) {
            // The default keydown event has already been prevented in order to stop
            // Chrome from scrolling. Insert a nbsp into the editor as OSX would for
            // other browsers.
            var contentState = DraftModifier.replaceText(editorState.getCurrentContent(), editorState.getSelection(), '\u00a0');
            editor.update(EditorState.push(editorState, contentState, 'insert-characters'));
        }
        return;
    }
    if (command === 'undo') {
        // Since undo requir es some special updating behavior to keep the editor
        // in sync, handle it separately.
        keyCommandUndo(e, editorState, editor.update);
        return;
    }
    // At this point, we know that we're handling a command of some kind, so
    // we don't want to insert a character following the keydown.
    e.preventDefault();
    // Allow components higher up the tree to handle the command first.
    if (editor.props.handleKeyCommand &&
        isEventHandled(editor.props.handleKeyCommand(command, editorState, e.timeStamp))) {
        return;
    }
    var newState = onKeyCommand(command, editorState, e);
    if (newState !== editorState) {
        editor.update(newState);
    }
}

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
var isOldIE = UserAgent.isBrowser('IE <= 9');
// Provides a dom node that will not execute scripts
// https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation.createHTMLDocument
// https://developer.mozilla.org/en-US/Add-ons/Code_snippets/HTML_to_DOM
function getSafeBodyFromHTML(html) {
    var doc;
    var root = null;
    // Provides a safe context
    if (!isOldIE &&
        document.implementation &&
        document.implementation.createHTMLDocument) {
        doc = document.implementation.createHTMLDocument('foo');
        invariant(doc.documentElement, 'Missing doc.documentElement');
        doc.documentElement.innerHTML = html;
        root = doc.getElementsByTagName('body')[0];
    }
    return root;
}

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
function isHTMLAnchorElement(node) {
    if (!node || !node.ownerDocument) {
        return false;
    }
    return isElement(node) && node.nodeName === 'A';
}

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
function isHTMLImageElement(node) {
    if (!node || !node.ownerDocument) {
        return false;
    }
    return isElement(node) && node.nodeName === 'IMG';
}

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
var _a;
var experimentalTreeDataSupport$3 = gkx('draft_tree_data_support');
var NBSP = '&nbsp;';
var SPACE = ' ';
// used for replacing characters in HTML
var REGEX_CR = new RegExp('\r', 'g');
var REGEX_LF = new RegExp('\n', 'g');
var REGEX_LEADING_LF = new RegExp('^\n', 'g');
var REGEX_NBSP = new RegExp(NBSP, 'g');
var REGEX_CARRIAGE = new RegExp('&#13;?', 'g');
var REGEX_ZWS = new RegExp('&#8203;?', 'g');
// https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight
var boldValues = ['bold', 'bolder', '500', '600', '700', '800', '900'];
var notBoldValues = ['light', 'lighter', '100', '200', '300', '400'];
var anchorAttr = ['className', 'href', 'rel', 'target', 'title'];
var imgAttr = ['alt', 'className', 'height', 'src', 'width'];
var knownListItemDepthClasses = (_a = {},
    _a[cx('public/DraftStyleDefault/depth0')] = 0,
    _a[cx('public/DraftStyleDefault/depth1')] = 1,
    _a[cx('public/DraftStyleDefault/depth2')] = 2,
    _a[cx('public/DraftStyleDefault/depth3')] = 3,
    _a[cx('public/DraftStyleDefault/depth4')] = 4,
    _a);
var HTMLTagToRawInlineStyleMap = Map({
    b: 'BOLD',
    code: 'CODE',
    del: 'STRIKETHROUGH',
    em: 'ITALIC',
    i: 'ITALIC',
    s: 'STRIKETHROUGH',
    strike: 'STRIKETHROUGH',
    strong: 'BOLD',
    u: 'UNDERLINE',
    mark: 'HIGHLIGHT',
});
/**
 * Build a mapping from HTML tags to draftjs block types
 * out of a BlockRenderMap.
 *
 * The BlockTypeMap for the default BlockRenderMap looks like this:
 *   Map({
 *     h1: 'header-one',
 *     h2: 'header-two',
 *     h3: 'header-three',
 *     h4: 'header-four',
 *     h5: 'header-five',
 *     h6: 'header-six',
 *     blockquote: 'blockquote',
 *     figure: 'atomic',
 *     pre: ['code-block'],
 *     div: 'unstyled',
 *     p: 'unstyled',
 *     li: ['ordered-list-item', 'unordered-list-item'],
 *   })
 */
var buildBlockTypeMap = function (blockRenderMap) {
    var blockTypeMap = {};
    blockRenderMap.mapKeys(function (blockType, desc) {
        var elements = [desc.element];
        if (desc.aliasedElements !== undefined) {
            elements.push.apply(elements, desc.aliasedElements);
        }
        elements.forEach(function (element) {
            if (blockTypeMap[element] === undefined) {
                blockTypeMap[element] = blockType;
            }
            else if (typeof blockTypeMap[element] === 'string') {
                blockTypeMap[element] = [blockTypeMap[element], blockType];
            }
            else {
                blockTypeMap[element].push(blockType);
            }
        });
    });
    return Map(blockTypeMap);
};
/**
 * If we're pasting from one DraftEditor to another we can check to see if
 * existing list item depth classes are being used and preserve this style
 */
var getListItemDepth = function (node, depth) {
    if (depth === void 0) { depth = 0; }
    Object.keys(knownListItemDepthClasses).some(function (depthClass) {
        if (node.classList.contains(depthClass)) {
            depth = knownListItemDepthClasses[depthClass];
        }
    });
    return depth;
};
/**
 * Return true if the provided HTML Element can be used to build a
 * Draftjs-compatible link.
 */
var isValidAnchor = function (node) {
    if (!isHTMLAnchorElement(node)) {
        return false;
    }
    var anchorNode = node;
    return !!(anchorNode.href &&
        (anchorNode.protocol === 'http:' ||
            anchorNode.protocol === 'https:' ||
            anchorNode.protocol === 'mailto:'));
};
/**
 * Return true if the provided HTML Element can be used to build a
 * Draftjs-compatible image.
 */
var isValidImage = function (node) {
    if (!isHTMLImageElement(node)) {
        return false;
    }
    var imageNode = node;
    return !!(imageNode.attributes.getNamedItem('src') &&
        imageNode.attributes.getNamedItem('src').value);
};
/**
 * Try to guess the inline style of an HTML element based on its css
 * styles (font-weight, font-style and text-decoration).
 */
var styleFromNodeAttributes = function (node) {
    var style = OrderedSet();
    if (!isHTMLElement(node)) {
        return style;
    }
    var htmlElement = node;
    var fontWeight = htmlElement.style.fontWeight;
    var fontStyle = htmlElement.style.fontStyle;
    var textDecoration = htmlElement.style.textDecoration;
    return style.withMutations(function (style) {
        if (boldValues.indexOf(fontWeight) >= 0) {
            style.add('BOLD');
        }
        else if (notBoldValues.indexOf(fontWeight) >= 0) {
            style.remove('BOLD');
        }
        if (fontStyle === 'italic') {
            style.add('ITALIC');
        }
        else if (fontStyle === 'normal') {
            style.remove('ITALIC');
        }
        if (textDecoration === 'underline') {
            style.add('UNDERLINE');
        }
        if (textDecoration === 'line-through') {
            style.add('STRIKETHROUGH');
        }
        if (textDecoration === 'none') {
            style.remove('UNDERLINE');
            style.remove('STRIKETHROUGH');
        }
    });
};
/**
 * Determine if a nodeName is a list type, 'ul' or 'ol'
 */
var isListNode = function (nodeName) {
    return nodeName === 'ul' || nodeName === 'ol';
};
/**
 * ContentBlocksBuilder builds a list of ContentBlocks and an Entity Map
 * out of one (or several) HTMLElement(s).
 *
 * The algorithm has two passes: first it builds a tree of ContentBlockConfigs
 * by walking through the HTML nodes and their children, then it walks the
 * ContentBlockConfigs tree to compute parents/siblings and create
 * the actual ContentBlocks.
 *
 * Typical usage is:
 *     new ContentBlocksBuilder()
 *        .addDOMNode(someHTMLNode)
 *        .addDOMNode(someOtherHTMLNode)
 *       .getContentBlocks();
 *
 */
var ContentBlocksBuilder = /** @class */ (function () {
    function ContentBlocksBuilder(blockTypeMap, disambiguate) {
        // Most of the method in the class depend on the state of the content builder
        // (i.e. currentBlockType, currentDepth, currentEntity etc.). Though it may
        // be confusing at first, it made the code simpler than the alternative which
        // is to pass those values around in every call.
        // The following attributes are used to accumulate text and styles
        // as we are walking the HTML node tree.
        this.characterList = List();
        this.currentBlockType = 'unstyled';
        this.currentDepth = 0;
        this.currentEntity = null;
        this.currentStyle = OrderedSet();
        this.currentText = '';
        this.wrapper = null;
        // Describes the future ContentState as a tree of content blocks
        this.blockConfigs = [];
        // The content blocks generated from the blockConfigs
        this.contentBlocks = [];
        // Entity map use to store links and images found in the HTML nodes
        this.entityMap = DraftEntity;
        this.clear();
        this.blockTypeMap = blockTypeMap;
        this.disambiguate = disambiguate;
    }
    /**
     * Clear the internal state of the ContentBlocksBuilder
     */
    ContentBlocksBuilder.prototype.clear = function () {
        this.characterList = List();
        this.blockConfigs = [];
        this.currentBlockType = 'unstyled';
        this.currentDepth = 0;
        this.currentEntity = null;
        this.currentStyle = OrderedSet();
        this.currentText = '';
        this.entityMap = DraftEntity;
        this.wrapper = null;
        this.contentBlocks = [];
    };
    /**
     * Add an HTMLElement to the ContentBlocksBuilder
     */
    ContentBlocksBuilder.prototype.addDOMNode = function (node) {
        var _a;
        this.contentBlocks = [];
        this.currentDepth = 0;
        // Converts the HTML node to block config
        (_a = this.blockConfigs).push.apply(_a, this._toBlockConfigs([node]));
        // There might be some left over text in the builder's
        // internal state, if so make a ContentBlock out of it.
        this._trimCurrentText();
        if (this.currentText !== '') {
            this.blockConfigs.push(this._makeBlockConfig());
        }
        // for chaining
        return this;
    };
    /**
     * Return the ContentBlocks and the EntityMap that corresponds
     * to the previously added HTML nodes.
     */
    ContentBlocksBuilder.prototype.getContentBlocks = function () {
        if (this.contentBlocks.length === 0) {
            if (experimentalTreeDataSupport$3) {
                this._toContentBlocks(this.blockConfigs);
            }
            else {
                this._toFlatContentBlocks(this.blockConfigs);
            }
        }
        return {
            contentBlocks: this.contentBlocks,
            entityMap: this.entityMap,
        };
    };
    /**
     * Add a new inline style to the upcoming nodes.
     */
    ContentBlocksBuilder.prototype.addStyle = function (inlineStyle) {
        this.currentStyle = this.currentStyle.union(inlineStyle);
    };
    /**
     * Remove a currently applied inline style.
     */
    ContentBlocksBuilder.prototype.removeStyle = function (inlineStyle) {
        this.currentStyle = this.currentStyle.subtract(inlineStyle);
    };
    // ***********************************WARNING******************************
    // The methods below this line are private - don't call them directly.
    /**
     * Generate a new ContentBlockConfig out of the current internal state
     * of the builder, then clears the internal state.
     */
    ContentBlocksBuilder.prototype._makeBlockConfig = function (config) {
        var key = config.key || generateRandomKey();
        var block = __assign({ key: key, type: this.currentBlockType, text: this.currentText, characterList: this.characterList, depth: this.currentDepth, parent: null, children: List(), prevSibling: null, nextSibling: null, childConfigs: [] }, config);
        this.characterList = List();
        this.currentBlockType = 'unstyled';
        this.currentText = '';
        return block;
    };
    /**
     * Converts an array of HTML elements to a multi-root tree of content
     * block configs. Some text content may be left in the builders internal
     * state to enable chaining sucessive calls.
     */
    ContentBlocksBuilder.prototype._toBlockConfigs = function (nodes) {
        var blockConfigs = [];
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var nodeName = node.nodeName.toLowerCase();
            if (nodeName === 'body' || isListNode(nodeName)) {
                // body, ol and ul are 'block' type nodes so create a block config
                // with the text accumulated so far (if any)
                this._trimCurrentText();
                if (this.currentText !== '') {
                    blockConfigs.push(this._makeBlockConfig());
                }
                // body, ol and ul nodes are ignored, but their children are inlined in
                // the parent block config.
                var wasCurrentDepth = this.currentDepth;
                var wasWrapper = this.wrapper;
                if (isListNode(nodeName)) {
                    this.wrapper = nodeName;
                    if (isListNode(wasWrapper)) {
                        this.currentDepth++;
                    }
                }
                blockConfigs.push.apply(blockConfigs, this._toBlockConfigs(Array.from(node.childNodes)));
                this.currentDepth = wasCurrentDepth;
                this.wrapper = wasWrapper;
                continue;
            }
            var blockType = this.blockTypeMap.get(nodeName);
            if (blockType !== undefined) {
                // 'block' type node means we need to create a block config
                // with the text accumulated so far (if any)
                this._trimCurrentText();
                if (this.currentText !== '') {
                    blockConfigs.push(this._makeBlockConfig());
                }
                var wasCurrentDepth = this.currentDepth;
                var wasWrapper = this.wrapper;
                this.wrapper = nodeName === 'pre' ? 'pre' : this.wrapper;
                if (typeof blockType !== 'string') {
                    blockType =
                        this.disambiguate(nodeName, this.wrapper) ||
                            blockType[0] ||
                            'unstyled';
                }
                if (!experimentalTreeDataSupport$3 &&
                    isHTMLElement(node) &&
                    (blockType === 'unordered-list-item' ||
                        blockType === 'ordered-list-item')) {
                    var htmlElement = node;
                    this.currentDepth = getListItemDepth(htmlElement, this.currentDepth);
                }
                var key = generateRandomKey();
                var childConfigs = this._toBlockConfigs(Array.from(node.childNodes));
                this._trimCurrentText();
                blockConfigs.push(this._makeBlockConfig({
                    key: key,
                    childConfigs: childConfigs,
                    type: blockType,
                }));
                this.currentDepth = wasCurrentDepth;
                this.wrapper = wasWrapper;
                continue;
            }
            if (nodeName === '#text') {
                this._addTextNode(node);
                continue;
            }
            if (nodeName === 'br') {
                this._addBreakNode(node);
                continue;
            }
            if (isValidImage(node)) {
                this._addImgNode(node);
                continue;
            }
            if (isValidAnchor(node)) {
                this._addAnchorNode(node, blockConfigs);
                continue;
            }
            var inlineStyle = HTMLTagToRawInlineStyleMap.has(nodeName)
                ? OrderedSet.of(HTMLTagToRawInlineStyleMap.get(nodeName))
                : OrderedSet();
            var attributesStyle = styleFromNodeAttributes(node);
            this.addStyle(inlineStyle);
            this.addStyle(attributesStyle);
            blockConfigs.push.apply(blockConfigs, this._toBlockConfigs(Array.from(node.childNodes)));
            this.removeStyle(attributesStyle);
            this.removeStyle(inlineStyle);
        }
        return blockConfigs;
    };
    /**
     * Append a string of text to the internal buffer.
     */
    ContentBlocksBuilder.prototype._appendText = function (text) {
        var _a;
        this.currentText += text;
        var characterMetadata = CharacterMetadata.create({
            style: this.currentStyle,
            entity: this.currentEntity,
        });
        this.characterList = (_a = this.characterList).push.apply(_a, Array(text.length).fill(characterMetadata));
    };
    /**
     * Trim the text in the internal buffer.
     */
    ContentBlocksBuilder.prototype._trimCurrentText = function () {
        var l = this.currentText.length;
        var begin = l - this.currentText.trimLeft().length;
        var end = this.currentText.trimRight().length;
        // We should not trim whitespaces for which an entity is defined.
        var entity = this.characterList.findEntry(function (characterMetadata) { return characterMetadata.getEntity() !== null; });
        begin = entity !== undefined ? Math.min(begin, entity[0]) : begin;
        entity = this.characterList
            .reverse()
            .findEntry(function (characterMetadata) { return characterMetadata.getEntity() !== null; });
        end = entity !== undefined ? Math.max(end, l - entity[0]) : end;
        if (begin > end) {
            this.currentText = '';
            this.characterList = List();
        }
        else {
            this.currentText = this.currentText.slice(begin, end);
            this.characterList = this.characterList.slice(begin, end);
        }
    };
    /**
     * Add the content of an HTML text node to the internal state
     */
    ContentBlocksBuilder.prototype._addTextNode = function (node) {
        var text = node.textContent;
        var trimmedText = text.trim();
        // If we are not in a pre block and the trimmed content is empty,
        // normalize to a single space.
        if (trimmedText === '' && this.wrapper !== 'pre') {
            text = ' ';
        }
        if (this.wrapper !== 'pre') {
            // Trim leading line feed, which is invisible in HTML
            text = text.replace(REGEX_LEADING_LF, '');
            // Can't use empty string because MSWord
            text = text.replace(REGEX_LF, SPACE);
        }
        this._appendText(text);
    };
    ContentBlocksBuilder.prototype._addBreakNode = function (node) {
        if (!isHTMLBRElement(node)) {
            return;
        }
        this._appendText('\n');
    };
    /**
     * Add the content of an HTML img node to the internal state
     */
    ContentBlocksBuilder.prototype._addImgNode = function (node) {
        if (!isHTMLImageElement(node)) {
            return;
        }
        var image = node;
        var entityConfig = {};
        imgAttr.forEach(function (attr) {
            var imageAttribute = image.getAttribute(attr);
            if (imageAttribute) {
                entityConfig[attr] = imageAttribute;
            }
        });
        // TODO: T15530363 update this when we remove DraftEntity entirely
        this.currentEntity = this.entityMap.__create('IMAGE', 'IMMUTABLE', entityConfig);
        // The child text node cannot just have a space or return as content (since
        // we strip those out), unless the image is for presentation only.
        // See https://github.com/facebook/draft-js/issues/231 for some context.
        if (gkx('draftjs_fix_paste_for_img')) {
            if (image.getAttribute('role') !== 'presentation') {
                this._appendText('\ud83d\udcf7');
            }
        }
        else {
            this._appendText('\ud83d\udcf7');
        }
        this.currentEntity = null;
    };
    /**
     * Add the content of an HTML 'a' node to the internal state. Child nodes
     * (if any) are converted to Block Configs and appended to the provided
     * blockConfig array.
     */
    ContentBlocksBuilder.prototype._addAnchorNode = function (node, blockConfigs) {
        // The check has already been made by isValidAnchor but
        // we have to do it again to keep flow happy.
        if (!isHTMLAnchorElement(node)) {
            return;
        }
        var anchor = node;
        var entityConfig = {};
        anchorAttr.forEach(function (attr) {
            var anchorAttribute = anchor.getAttribute(attr);
            if (anchorAttribute) {
                entityConfig[attr] = anchorAttribute;
            }
        });
        entityConfig.url = new URI(anchor.href).toString();
        // TODO: T15530363 update this when we remove DraftEntity completely
        this.currentEntity = this.entityMap.__create('LINK', 'MUTABLE', entityConfig || {});
        blockConfigs.push.apply(blockConfigs, this._toBlockConfigs(Array.from(node.childNodes)));
        this.currentEntity = null;
    };
    /**
     * Walk the BlockConfig tree, compute parent/children/siblings,
     * and generate the corresponding ContentBlockNode
     */
    ContentBlocksBuilder.prototype._toContentBlocks = function (blockConfigs, parent) {
        if (parent === void 0) { parent = null; }
        var l = blockConfigs.length - 1;
        for (var i = 0; i <= l; i++) {
            var config = blockConfigs[i];
            config.parent = parent;
            config.prevSibling = i > 0 ? blockConfigs[i - 1].key : null;
            config.nextSibling = i < l ? blockConfigs[i + 1].key : null;
            config.children = List(config.childConfigs.map(function (child) { return child.key; }));
            this.contentBlocks.push(new ContentBlockNode(__assign({}, config)));
            this._toContentBlocks(config.childConfigs, config.key);
        }
    };
    /**
     * Remove 'useless' container nodes from the block config hierarchy, by
     * replacing them with their children.
     */
    ContentBlocksBuilder.prototype._hoistContainersInBlockConfigs = function (blockConfigs) {
        var _this = this;
        var hoisted = List(blockConfigs).flatMap(function (blockConfig) {
            // Don't mess with useful blocks
            if (blockConfig.type !== 'unstyled' || blockConfig.text !== '') {
                return [blockConfig];
            }
            return _this._hoistContainersInBlockConfigs(blockConfig.childConfigs);
        });
        return hoisted;
    };
    // ***********************************************************************
    // The two methods below are used for backward compatibility when
    // experimentalTreeDataSupport is disabled.
    /**
     * Same as _toContentBlocks but replaces nested blocks by their
     * text content.
     */
    ContentBlocksBuilder.prototype._toFlatContentBlocks = function (blockConfigs) {
        var _this = this;
        var cleanConfigs = this._hoistContainersInBlockConfigs(blockConfigs);
        cleanConfigs.forEach(function (config) {
            var _a = _this._extractTextFromBlockConfigs(config.childConfigs), text = _a.text, characterList = _a.characterList;
            _this.contentBlocks.push(new ContentBlock(__assign(__assign({}, config), { text: config.text + text, characterList: config.characterList.concat(characterList) })));
        });
    };
    /**
     * Extract the text and the associated inline styles form an
     * array of content block configs.
     */
    ContentBlocksBuilder.prototype._extractTextFromBlockConfigs = function (blockConfigs) {
        var l = blockConfigs.length - 1;
        var text = '';
        var characterList = List();
        for (var i = 0; i <= l; i++) {
            var config = blockConfigs[i];
            text += config.text;
            characterList = characterList.concat(config.characterList);
            if (text !== '' && config.type !== 'unstyled') {
                text += '\n';
                characterList = characterList.push(characterList.last());
            }
            var children = this._extractTextFromBlockConfigs(config.childConfigs);
            text += children.text;
            characterList = characterList.concat(children.characterList);
        }
        return { text: text, characterList: characterList };
    };
    return ContentBlocksBuilder;
}());
/**
 * Converts an HTML string to an array of ContentBlocks and an EntityMap
 * suitable to initialize the internal state of a Draftjs component.
 */
var convertFromHTMLToContentBlocks = function (html, DOMBuilder, blockRenderMap) {
    // Be ABSOLUTELY SURE that the dom builder you pass here won't execute
    // arbitrary code in whatever environment you're running this in. For an
    // example of how we try to do this in-browser, see getSafeBodyFromHTML.
    if (DOMBuilder === void 0) { DOMBuilder = getSafeBodyFromHTML; }
    if (blockRenderMap === void 0) { blockRenderMap = DefaultDraftBlockRenderMap; }
    // Remove funky characters from the HTML string
    html = html
        .trim()
        .replace(REGEX_CR, '')
        .replace(REGEX_NBSP, SPACE)
        .replace(REGEX_CARRIAGE, '')
        .replace(REGEX_ZWS, '');
    // Build a DOM tree out of the HTML string
    var safeBody = DOMBuilder(html);
    if (!safeBody) {
        return null;
    }
    // Build a BlockTypeMap out of the BlockRenderMap
    var blockTypeMap = buildBlockTypeMap(blockRenderMap);
    // Select the proper block type for the cases where the blockRenderMap
    // uses multiple block types for the same html tag.
    var disambiguate = function (tag, wrapper) {
        if (tag === 'li') {
            return wrapper === 'ol' ? 'ordered-list-item' : 'unordered-list-item';
        }
        return null;
    };
    return new ContentBlocksBuilder(blockTypeMap, disambiguate)
        .addDOMNode(safeBody)
        .getContentBlocks();
};

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
var experimentalTreeDataSupport$4 = gkx('draft_tree_data_support');
var ContentBlockRecord$2 = experimentalTreeDataSupport$4 ? ContentBlockNode : ContentBlock;
var DraftPasteProcessor = {
    processHTML: function (html, blockRenderMap) {
        return convertFromHTMLToContentBlocks(html, getSafeBodyFromHTML, blockRenderMap);
    },
    processText: function (textBlocks, character, type) {
        return textBlocks.reduce(function (acc, textLine, index) {
            textLine = sanitizeDraftText(textLine);
            var key = generateRandomKey();
            var blockNodeConfig = {
                key: key,
                type: type,
                text: textLine,
                characterList: List(Repeat(character, textLine.length))
            };
            // next block updates previous block
            if (experimentalTreeDataSupport$4 && index !== 0) {
                var prevSiblingIndex = index - 1;
                // update previous block
                var previousBlock = (acc[prevSiblingIndex] = acc[prevSiblingIndex].merge({
                    nextSibling: key
                }));
                blockNodeConfig = __assign(__assign({}, blockNodeConfig), { prevSibling: previousBlock.getKey() });
            }
            acc.push(new ContentBlockRecord$2(blockNodeConfig));
            return acc;
        }, []);
    }
};

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
function adjustBlockDepthForContentState(contentState, selectionState, adjustment, maxDepth) {
    var startKey = selectionState.getStartKey();
    var endKey = selectionState.getEndKey();
    var blockMap = contentState.getBlockMap();
    var blocks = blockMap
        .toSeq()
        .skipUntil(function (_, k) { return k === startKey; })
        .takeUntil(function (_, k) { return k === endKey; })
        .concat([[endKey, blockMap.get(endKey)]])
        .map(function (block) {
        var depth = block.getDepth() + adjustment;
        depth = Math.max(0, Math.min(depth, maxDepth));
        return block.set('depth', depth);
    });
    blockMap = blockMap.merge(blocks);
    return contentState.merge({
        blockMap: blockMap,
        selectionBefore: selectionState,
        selectionAfter: selectionState,
    });
}

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
var RichTextEditorUtil = {
    currentBlockContainsLink: function (editorState) {
        var selection = editorState.getSelection();
        var contentState = editorState.getCurrentContent();
        var entityMap = contentState.getEntityMap();
        return contentState
            .getBlockForKey(selection.getAnchorKey())
            .getCharacterList()
            .slice(selection.getStartOffset(), selection.getEndOffset())
            .some(function (v) {
            var entity = v.getEntity();
            return !!entity && entityMap.__get(entity).getType() === 'LINK';
        });
    },
    getCurrentBlockType: function (editorState) {
        var selection = editorState.getSelection();
        return editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey())
            .getType();
    },
    getDataObjectForLinkURL: function (uri) {
        return { url: uri.toString() };
    },
    handleKeyCommand: function (editorState, command) {
        switch (command) {
            case 'bold':
                return RichTextEditorUtil.toggleInlineStyle(editorState, 'BOLD');
            case 'italic':
                return RichTextEditorUtil.toggleInlineStyle(editorState, 'ITALIC');
            case 'underline':
                return RichTextEditorUtil.toggleInlineStyle(editorState, 'UNDERLINE');
            case 'code':
                return RichTextEditorUtil.toggleCode(editorState);
            case 'backspace':
            case 'backspace-word':
            case 'backspace-to-start-of-line':
                return RichTextEditorUtil.onBackspace(editorState);
            case 'delete':
            case 'delete-word':
            case 'delete-to-end-of-block':
                return RichTextEditorUtil.onDelete(editorState);
            default:
                // they may have custom editor commands; ignore those
                return null;
        }
    },
    insertSoftNewline: function (editorState) {
        var contentState = DraftModifier.insertText(editorState.getCurrentContent(), editorState.getSelection(), '\n', editorState.getCurrentInlineStyle(), null);
        var newEditorState = EditorState.push(editorState, contentState, 'insert-characters');
        return EditorState.forceSelection(newEditorState, contentState.getSelectionAfter());
    },
    /**
     * For collapsed selections at the start of styled blocks, backspace should
     * just remove the existing style.
     */
    onBackspace: function (editorState) {
        var selection = editorState.getSelection();
        if (!selection.isCollapsed() ||
            selection.getAnchorOffset() ||
            selection.getFocusOffset()) {
            return null;
        }
        // First, try to remove a preceding atomic block.
        var content = editorState.getCurrentContent();
        var startKey = selection.getStartKey();
        var blockBefore = content.getBlockBefore(startKey);
        if (blockBefore && blockBefore.getType() === 'atomic') {
            var blockMap = content.getBlockMap()["delete"](blockBefore.getKey());
            var withoutAtomicBlock = content.merge({
                blockMap: blockMap,
                selectionAfter: selection,
            });
            if (withoutAtomicBlock !== content) {
                return EditorState.push(editorState, withoutAtomicBlock, 'remove-range');
            }
        }
        // If that doesn't succeed, try to remove the current block style.
        var withoutBlockStyle = RichTextEditorUtil.tryToRemoveBlockStyle(editorState);
        if (withoutBlockStyle) {
            return EditorState.push(editorState, withoutBlockStyle, 'change-block-type');
        }
        return null;
    },
    onDelete: function (editorState) {
        var selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
            return null;
        }
        var content = editorState.getCurrentContent();
        var startKey = selection.getStartKey();
        var block = content.getBlockForKey(startKey);
        var length = block.getLength();
        // The cursor is somewhere within the text. Behave normally.
        if (selection.getStartOffset() < length) {
            return null;
        }
        var blockAfter = content.getBlockAfter(startKey);
        if (!blockAfter || blockAfter.getType() !== 'atomic') {
            return null;
        }
        var atomicBlockTarget = selection.merge({
            focusKey: blockAfter.getKey(),
            focusOffset: blockAfter.getLength(),
        });
        var withoutAtomicBlock = DraftModifier.removeRange(content, atomicBlockTarget, 'forward');
        if (withoutAtomicBlock !== content) {
            return EditorState.push(editorState, withoutAtomicBlock, 'remove-range');
        }
        return null;
    },
    onTab: function (event, editorState, maxDepth) {
        var selection = editorState.getSelection();
        var key = selection.getAnchorKey();
        if (key !== selection.getFocusKey()) {
            return editorState;
        }
        var content = editorState.getCurrentContent();
        var block = content.getBlockForKey(key);
        var type = block.getType();
        if (type !== 'unordered-list-item' && type !== 'ordered-list-item') {
            return editorState;
        }
        event.preventDefault();
        var depth = block.getDepth();
        if (!event.shiftKey && depth === maxDepth) {
            return editorState;
        }
        var withAdjustment = adjustBlockDepthForContentState(content, selection, event.shiftKey ? -1 : 1, maxDepth);
        return EditorState.push(editorState, withAdjustment, 'adjust-depth');
    },
    toggleBlockType: function (editorState, blockType) {
        var selection = editorState.getSelection();
        var startKey = selection.getStartKey();
        var endKey = selection.getEndKey();
        var content = editorState.getCurrentContent();
        var target = selection;
        // Triple-click can lead to a selection that includes offset 0 of the
        // following block. The `SelectionState` for this case is accurate, but
        // we should avoid toggling block type for the trailing block because it
        // is a confusing interaction.
        if (startKey !== endKey && selection.getEndOffset() === 0) {
            var blockBefore = nullthrows(content.getBlockBefore(endKey));
            endKey = blockBefore.getKey();
            target = target.merge({
                anchorKey: startKey,
                anchorOffset: selection.getStartOffset(),
                focusKey: endKey,
                focusOffset: blockBefore.getLength(),
                isBackward: false,
            });
        }
        var hasAtomicBlock = content
            .getBlockMap()
            .skipWhile(function (_, k) { return k !== startKey; })
            .reverse()
            .skipWhile(function (_, k) { return k !== endKey; })
            .some(function (v) { return v.getType() === 'atomic'; });
        if (hasAtomicBlock) {
            return editorState;
        }
        var typeToSet = content.getBlockForKey(startKey).getType() === blockType
            ? 'unstyled'
            : blockType;
        return EditorState.push(editorState, DraftModifier.setBlockType(content, target, typeToSet), 'change-block-type');
    },
    toggleCode: function (editorState) {
        var selection = editorState.getSelection();
        var anchorKey = selection.getAnchorKey();
        var focusKey = selection.getFocusKey();
        if (selection.isCollapsed() || anchorKey !== focusKey) {
            return RichTextEditorUtil.toggleBlockType(editorState, 'code-block');
        }
        return RichTextEditorUtil.toggleInlineStyle(editorState, 'CODE');
    },
    /**
     * Toggle the specified inline style for the selection. If the
     * user's selection is collapsed, apply or remove the style for the
     * internal state. If it is not collapsed, apply the change directly
     * to the document state.
     */
    toggleInlineStyle: function (editorState, inlineStyle) {
        var selection = editorState.getSelection();
        var currentStyle = editorState.getCurrentInlineStyle();
        // If the selection is collapsed, toggle the specified style on or off and
        // set the result as the new inline style override. This will then be
        // used as the inline style for the next character to be inserted.
        if (selection.isCollapsed()) {
            return EditorState.setInlineStyleOverride(editorState, currentStyle.has(inlineStyle)
                ? currentStyle.remove(inlineStyle)
                : currentStyle.add(inlineStyle));
        }
        // If characters are selected, immediately apply or remove the
        // inline style on the document state itself.
        var content = editorState.getCurrentContent();
        var newContent;
        // If the style is already present for the selection range, remove it.
        // Otherwise, apply it.
        if (currentStyle.has(inlineStyle)) {
            newContent = DraftModifier.removeInlineStyle(content, selection, inlineStyle);
        }
        else {
            newContent = DraftModifier.applyInlineStyle(content, selection, inlineStyle);
        }
        return EditorState.push(editorState, newContent, 'change-inline-style');
    },
    toggleLink: function (editorState, targetSelection, entityKey) {
        var withoutLink = DraftModifier.applyEntity(editorState.getCurrentContent(), targetSelection, entityKey);
        return EditorState.push(editorState, withoutLink, 'apply-entity');
    },
    /**
     * When a collapsed cursor is at the start of a styled block, changes block
     * type to 'unstyled'. Returns null if selection does not meet that criteria.
     */
    tryToRemoveBlockStyle: function (editorState) {
        var selection = editorState.getSelection();
        var offset = selection.getAnchorOffset();
        if (selection.isCollapsed() && offset === 0) {
            var key = selection.getAnchorKey();
            var content = editorState.getCurrentContent();
            var block = content.getBlockForKey(key);
            var type = block.getType();
            var blockBefore = content.getBlockBefore(key);
            if (type === 'code-block' &&
                blockBefore &&
                blockBefore.getType() === 'code-block' &&
                blockBefore.getLength() !== 0) {
                return null;
            }
            if (type !== 'unstyled') {
                return DraftModifier.setBlockType(content, selection, 'unstyled');
            }
        }
        return null;
    },
};

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
var NEWLINE_REGEX = /\r\n?|\n/g;
function splitTextIntoTextBlocks(text) {
    return text.split(NEWLINE_REGEX);
}

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
/**
 * Paste content.
 */
function editOnPaste(editor, e) {
    e.preventDefault();
    var data = new DataTransfer(e.clipboardData);
    // Get files, unless this is likely to be a string the user wants inline.
    if (!data.isRichText()) {
        /* $FlowFixMe This comment suppresses an error found DataTransfer was typed.
         * getFiles() returns an array of <Files extends Blob>, not Blob */
        var files = data.getFiles();
        var defaultFileText_1 = data.getText();
        if (files.length > 0) {
            // Allow customized paste handling for images, etc. Otherwise, fall
            // through to insert text contents into the editor.
            if (editor.props.handlePastedFiles &&
                isEventHandled(editor.props.handlePastedFiles(files))) {
                return;
            }
            getTextContentFromFiles(files, function (/*string*/ fileText) {
                fileText = fileText || defaultFileText_1;
                if (!fileText) {
                    return;
                }
                var editorState = editor._latestEditorState;
                var blocks = splitTextIntoTextBlocks(fileText);
                var character = CharacterMetadata.create({
                    style: editorState.getCurrentInlineStyle(),
                    entity: getEntityKeyForSelection(editorState.getCurrentContent(), editorState.getSelection()),
                });
                var currentBlockType = RichTextEditorUtil.getCurrentBlockType(editorState);
                var text = DraftPasteProcessor.processText(blocks, character, currentBlockType);
                var fragment = BlockMapBuilder.createFromArray(text);
                var withInsertedText = DraftModifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), fragment);
                editor.update(EditorState.push(editorState, withInsertedText, 'insert-fragment'));
            });
            return;
        }
    }
    var textBlocks = [];
    var text = data.getText();
    var html = data.getHTML();
    var editorState = editor._latestEditorState;
    if (editor.props.handlePastedText &&
        isEventHandled(editor.props.handlePastedText(text, html, editorState))) {
        return;
    }
    if (text) {
        textBlocks = splitTextIntoTextBlocks(text);
    }
    if (!editor.props.stripPastedStyles) {
        // If the text from the paste event is rich content that matches what we
        // already have on the internal clipboard, assume that we should just use
        // the clipboard fragment for the paste. This will allow us to preserve
        // styling and entities, if any are present. Note that newlines are
        // stripped during comparison -- this is because copy/paste within the
        // editor in Firefox and IE will not include empty lines. The resulting
        // paste will preserve the newlines correctly.
        var internalClipboard = editor.getClipboard();
        if (data.isRichText() && internalClipboard) {
            if (
            // If the editorKey is present in the pasted HTML, it should be safe to
            // assume this is an internal paste.
            html.indexOf(editor.getEditorKey()) !== -1 ||
                // The copy may have been made within a single block, in which case the
                // editor key won't be part of the paste. In this case, just check
                // whether the pasted text matches the internal clipboard.
                (textBlocks.length === 1 &&
                    internalClipboard.size === 1 &&
                    internalClipboard.first().getText() === text)) {
                editor.update(insertFragment$1(editor._latestEditorState, internalClipboard));
                return;
            }
        }
        else if (internalClipboard &&
            data.types.includes('com.apple.webarchive') &&
            !data.types.includes('text/html') &&
            areTextBlocksAndClipboardEqual(textBlocks, internalClipboard)) {
            // Safari does not properly store text/html in some cases.
            // Use the internalClipboard if present and equal to what is on
            // the clipboard. See https://bugs.webkit.org/show_bug.cgi?id=19893.
            editor.update(insertFragment$1(editor._latestEditorState, internalClipboard));
            return;
        }
        // If there is html paste data, try to parse that.
        if (html) {
            var htmlFragment = DraftPasteProcessor.processHTML(html, editor.props.blockRenderMap);
            if (htmlFragment) {
                var contentBlocks = htmlFragment.contentBlocks, entityMap = htmlFragment.entityMap;
                if (contentBlocks) {
                    var htmlMap = BlockMapBuilder.createFromArray(contentBlocks);
                    editor.update(insertFragment$1(editor._latestEditorState, htmlMap, entityMap));
                    return;
                }
            }
        }
        // Otherwise, create a new fragment from our pasted text. Also
        // empty the internal clipboard, since it's no longer valid.
        editor.setClipboard(null);
    }
    if (textBlocks.length) {
        var character = CharacterMetadata.create({
            style: editorState.getCurrentInlineStyle(),
            entity: getEntityKeyForSelection(editorState.getCurrentContent(), editorState.getSelection()),
        });
        var currentBlockType = RichTextEditorUtil.getCurrentBlockType(editorState);
        var textFragment = DraftPasteProcessor.processText(textBlocks, character, currentBlockType);
        var textMap = BlockMapBuilder.createFromArray(textFragment);
        editor.update(insertFragment$1(editor._latestEditorState, textMap));
    }
}
function insertFragment$1(editorState, fragment, entityMap) {
    var newContent = DraftModifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), fragment);
    // TODO: merge the entity map once we stop using DraftEntity
    // like this:
    // const mergedEntityMap = newContent.getEntityMap().merge(entityMap);
    return EditorState.push(editorState, newContent.set('entityMap', entityMap), 'insert-fragment');
}
function areTextBlocksAndClipboardEqual(textBlocks, blockMap) {
    return (textBlocks.length === blockMap.size &&
        blockMap.valueSeq().every(function (block, ii) { return block.getText() === textBlocks[ii]; }));
}

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
var isChrome$2 = UserAgent.isBrowser('Chrome');
var selectionHandler = isChrome$2
    ? editOnSelect
    : function (e) { };
var DraftEditorEditHandler = {
    onBeforeInput: editOnBeforeInput,
    onBlur: editOnBlur,
    onCompositionStart: editOnCompositionStart,
    onCopy: editOnCopy,
    onCut: editOnCut,
    onDragOver: editOnDragOver,
    onDragStart: editOnDragStart,
    onFocus: editOnFocus,
    onInput: editOnInput,
    onKeyDown: editOnKeyDown,
    onPaste: editOnPaste,
    onSelect: editOnSelect,
    // In certain cases, contenteditable on chrome does not fire the onSelect
    // event, causing problems with cursor positioning. Therefore, the selection
    // state update handler is added to more events to ensure that the selection
    // state is always synced with the actual cursor positions.
    onMouseUp: selectionHandler,
    onKeyUp: selectionHandler,
};

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
/**
 * This component is responsible for rendering placeholder text for the
 * `DraftEditor` component.
 *
 * Override placeholder style via CSS.
 */
var DraftEditorPlaceholder = /** @class */ (function (_super) {
    __extends(DraftEditorPlaceholder, _super);
    function DraftEditorPlaceholder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DraftEditorPlaceholder.prototype.shouldComponentUpdate = function (nextProps) {
        return (this.props.text !== nextProps.text ||
            this.props.editorState.getSelection().getHasFocus() !==
                nextProps.editorState.getSelection().getHasFocus());
    };
    DraftEditorPlaceholder.prototype.render = function () {
        var hasFocus = this.props.editorState.getSelection().getHasFocus();
        var className = cx({
            'public/DraftEditorPlaceholder/root': true,
            'public/DraftEditorPlaceholder/hasFocus': hasFocus,
        });
        var contentStyle = {
            whiteSpace: 'pre-wrap',
        };
        return (React.createElement("div", { className: className },
            React.createElement("div", { className: cx('public/DraftEditorPlaceholder/inner'), id: this.props.accessibilityID, style: contentStyle }, this.props.text)));
    };
    return DraftEditorPlaceholder;
}(React.Component));

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
var isOSX$1 = UserAgent.isPlatform('Mac OS X');
// Firefox on OSX had a bug resulting in navigation instead of cursor movement.
// This bug was fixed in Firefox 29. Feature detection is virtually impossible
// so we just check the version number. See #342765.
var shouldFixFirefoxMovement = isOSX$1 && UserAgent.isBrowser('Firefox < 29');
var hasCommandModifier = KeyBindingUtil.hasCommandModifier, isCtrlKeyCommand = KeyBindingUtil.isCtrlKeyCommand;
function shouldRemoveWord(e) {
    return (isOSX$1 && e.altKey) || isCtrlKeyCommand(e);
}
/**
 * Get the appropriate undo/redo command for a Z key command.
 */
function getZCommand(e) {
    if (!hasCommandModifier(e)) {
        return null;
    }
    return e.shiftKey ? 'redo' : 'undo';
}
function getDeleteCommand(e) {
    // Allow default "cut" behavior for PCs on Shift + Delete.
    if (!isOSX$1 && e.shiftKey) {
        return null;
    }
    return shouldRemoveWord(e) ? 'delete-word' : 'delete';
}
function getBackspaceCommand(e) {
    if (hasCommandModifier(e) && isOSX$1) {
        return 'backspace-to-start-of-line';
    }
    return shouldRemoveWord(e) ? 'backspace-word' : 'backspace';
}
/**
 * Retrieve a bound key command for the given event.
 */
function getDefaultKeyBinding(e) {
    switch (e.keyCode) {
        case 66: // B
            return hasCommandModifier(e) ? 'bold' : null;
        case 68: // D
            return isCtrlKeyCommand(e) ? 'delete' : null;
        case 72: // H
            return isCtrlKeyCommand(e) ? 'backspace' : null;
        case 73: // I
            return hasCommandModifier(e) ? 'italic' : null;
        case 74: // J
            return hasCommandModifier(e) ? 'code' : null;
        case 75: // K
            return isOSX$1 && isCtrlKeyCommand(e) ? 'secondary-cut' : null;
        case 77: // M
            return isCtrlKeyCommand(e) ? 'split-block' : null;
        case 79: // O
            return isCtrlKeyCommand(e) ? 'split-block' : null;
        case 84: // T
            return isOSX$1 && isCtrlKeyCommand(e) ? 'transpose-characters' : null;
        case 85: // U
            return hasCommandModifier(e) ? 'underline' : null;
        case 87: // W
            return isOSX$1 && isCtrlKeyCommand(e) ? 'backspace-word' : null;
        case 89: // Y
            if (isCtrlKeyCommand(e)) {
                return isOSX$1 ? 'secondary-paste' : 'redo';
            }
            return null;
        case 90: // Z
            return getZCommand(e) || null;
        case Keys.RETURN:
            return 'split-block';
        case Keys.DELETE:
            return getDeleteCommand(e);
        case Keys.BACKSPACE:
            return getBackspaceCommand(e);
        // LEFT/RIGHT handlers serve as a workaround for a Firefox bug.
        case Keys.LEFT:
            return shouldFixFirefoxMovement && hasCommandModifier(e)
                ? 'move-selection-to-start-of-block'
                : null;
        case Keys.RIGHT:
            return shouldFixFirefoxMovement && hasCommandModifier(e)
                ? 'move-selection-to-end-of-block'
                : null;
        default:
            return null;
    }
}

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
var isIE = UserAgent.isBrowser("IE");
// IE does not support the `input` event on contentEditable, so we can't
// observe spellcheck behavior.
var allowSpellCheck = !isIE;
// Define a set of handler objects to correspond to each possible `mode`
// of editor behavior.
var handlerMap = {
    edit: DraftEditorEditHandler,
    composite: DraftEditorCompositionHandler,
    drag: DraftEditorDragHandler,
    cut: null,
    render: null
};
var didInitODS = false;
var UpdateDraftEditorFlags = /** @class */ (function (_super) {
    __extends(UpdateDraftEditorFlags, _super);
    function UpdateDraftEditorFlags() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UpdateDraftEditorFlags.prototype.render = function () {
        return null;
    };
    UpdateDraftEditorFlags.prototype.componentDidMount = function () {
        this._update();
    };
    UpdateDraftEditorFlags.prototype.componentDidUpdate = function () {
        this._update();
    };
    UpdateDraftEditorFlags.prototype._update = function () {
        var editor = this.props.editor;
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
    };
    return UpdateDraftEditorFlags;
}(React.Component));
/**
 * `DraftEditor` is the root editor component. It composes a `contentEditable`
 * div, and provides a wide variety of useful function props for managing the
 * state of the editor. See `DraftEditorProps` for details.
 */
var DraftEditor = /** @class */ (function (_super) {
    __extends(DraftEditor, _super);
    // updat e: (editorState: EditorState) => void;
    // onDragEnter: () => void;
    // onDragLeave: () => void;
    function DraftEditor(props) {
        var _this = _super.call(this, props) || this;
        /**
         * Used via `this.focus()`.
         *
         * Force focus back onto the editor node.
         *
         * We attempt to preserve scroll position when focusing. You can also pass
         * a specified scroll position (for cases like `cut` behavior where it should
         * be restored to a known position).
         */
        _this.focus = function (scrollPosition) {
            var editorState = _this.props.editorState;
            var alreadyHasFocus = editorState.getSelection().getHasFocus();
            var editorNode = _this.editor;
            if (!editorNode) {
                // once in a while people call 'focus' in a setTimeout, and the node has
                // been deleted, so it can be null in that case.
                return;
            }
            var scrollParent = Style.getScrollParent(editorNode);
            var _a = scrollPosition || getScrollPosition(scrollParent), x = _a.x, y = _a.y;
            invariant(isHTMLElement(editorNode), "editorNode is not an HTMLElement");
            editorNode.focus();
            // Restore scroll position
            if (scrollParent === window) {
                window.scrollTo(x, y);
            }
            else {
                Scroll.setTop(scrollParent, y);
            }
            // On Chrome and Safari, calling focus on contenteditable focuses the
            // cursor at the first character. This is something you don't expect when
            // you're clicking on an input element but not directly on a character.
            // Put the cursor back where it was before the blur.
            if (!alreadyHasFocus) {
                _this.update(EditorState.forceSelection(editorState, editorState.getSelection()));
            }
        };
        _this.blur = function () {
            var editorNode = _this.editor;
            if (!editorNode) {
                return;
            }
            invariant(isHTMLElement(editorNode), "editorNode is not an HTMLElement");
            editorNode.blur();
        };
        /**
         * Used via `this.setMode(...)`.
         *
         * Set the behavior mode for the editor component. This switches the current
         * handler module to ensure that DOM events are managed appropriately for
         * the active mode.
         */
        _this.setMode = function (mode) {
            var _a = _this.props, onPaste = _a.onPaste, onCut = _a.onCut, onCopy = _a.onCopy;
            var editHandler = __assign({}, handlerMap.edit);
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
            var handler = __assign(__assign({}, handlerMap), { edit: editHandler });
            _this._handler = handler[mode];
        };
        _this.exitCurrentMode = function () {
            _this.setMode("edit");
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
        _this.restoreEditorDOM = function (scrollPosition) {
            _this.setState({ contentsKey: _this.state.contentsKey + 1 }, function () {
                _this.focus(scrollPosition);
            });
        };
        /**
         * Used via `this.setClipboard(...)`.
         *
         * Set the clipboard state for a cut/copy event.
         */
        _this.setClipboard = function (clipboard) {
            _this._clipboard = clipboard;
        };
        /**
         * Used via `this.getClipboard()`.
         *
         * Retrieve the clipboard state for a cut/copy event.
         */
        _this.getClipboard = function () {
            return _this._clipboard;
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
        _this.update = function (editorState) {
            _this._latestEditorState = editorState;
            _this.props.onChange(editorState);
        };
        /**
         * Used in conjunction with `onDragLeave()`, by counting the number of times
         * a dragged element enters and leaves the editor (or any of its children),
         * to determine when the dragged element absolutely leaves the editor.
         */
        _this.onDragEnter = function () {
            _this._dragCount++;
        };
        /**
         * See `onDragEnter()`.
         */
        _this.onDragLeave = function () {
            _this._dragCount--;
            if (_this._dragCount === 0) {
                _this.exitCurrentMode();
            }
        };
        _this._blockSelectEvents = false;
        _this._clipboard = null;
        _this._handler = null;
        _this._dragCount = 0;
        _this._editorKey = props.editorKey || generateRandomKey();
        _this._placeholderAccessibilityID = "placeholder-" + _this._editorKey;
        _this._latestEditorState = props.editorState;
        _this._latestCommittedEditorState = props.editorState;
        _this._onBeforeInput = _this._buildHandler("onBeforeInput");
        _this._onBlur = _this._buildHandler("onBlur");
        _this._onCharacterData = _this._buildHandler("onCharacterData");
        _this._onCompositionEnd = _this._buildHandler("onCompositionEnd");
        _this._onCompositionStart = _this._buildHandler("onCompositionStart");
        _this._onCopy = _this._buildHandler("onCopy");
        _this._onCut = _this._buildHandler("onCut");
        _this._onDragEnd = _this._buildHandler("onDragEnd");
        _this._onDragOver = _this._buildHandler("onDragOver");
        _this._onDragStart = _this._buildHandler("onDragStart");
        _this._onDrop = _this._buildHandler("onDrop");
        _this._onInput = _this._buildHandler("onInput");
        _this._onFocus = _this._buildHandler("onFocus");
        _this._onKeyDown = _this._buildHandler("onKeyDown");
        _this._onKeyPress = _this._buildHandler("onKeyPress");
        _this._onKeyUp = _this._buildHandler("onKeyUp");
        _this._onMouseDown = _this._buildHandler("onMouseDown");
        _this._onMouseUp = _this._buildHandler("onMouseUp");
        _this._onPaste = _this._buildHandler("onPaste");
        _this._onSelect = _this._buildHandler("onSelect");
        _this.getEditorKey = function () { return _this._editorKey; };
        if (window["__DEV__"]) {
            ["onDownArrow", "onEscape", "onLeftArrow", "onRightArrow", "onTab", "onUpArrow"].forEach(function (propName) {
                if (props.hasOwnProperty(propName)) {
                    // eslint-disable-next-line no-console
                    console.warn("Supplying an `" + propName + "` prop to `DraftEditor` has " +
                        "been deprecated. If your handler needs access to the keyboard " +
                        "event, supply a custom `keyBindingFn` prop that falls back to " +
                        "the default one (eg. https://is.gd/RG31RJ).");
                }
            });
        }
        // See `restoreEditorDOM()`.
        _this.state = { contentsKey: 0 };
        return _this;
    }
    /**
     * Build a method that will pass the event to the specified handler method.
     * This allows us to look up the correct handler function for the current
     * editor mode, if any has been specified.
     */
    DraftEditor.prototype._buildHandler = function (eventName) {
        var _this = this;
        var flushControlled = 
        /* $FlowFixMe(>=0.79.1 site=www) This comment suppresses an error found
         * when Flow v0.79 was deployed. To see the error delete this comment and
         * run Flow. */
        // @ts-ignore
        ReactDOM.unstable_flushControlled;
        // Wrap event handlers in `flushControlled`. In sync mode, this is
        // effectively a no-op. In async mode, this ensures all updates scheduled
        // inside the handler are flushed before React yields to the browser.
        return function (e) {
            if (!_this.props.readOnly) {
                var method_1 = _this._handler && _this._handler[eventName];
                if (method_1) {
                    if (flushControlled) {
                        flushControlled(function () { return method_1(_this, e); });
                    }
                    else {
                        method_1(_this, e);
                    }
                }
            }
        };
    };
    DraftEditor.prototype._showPlaceholder = function () {
        return !!this.props.placeholder && !this.props.editorState.isInCompositionMode() && !this.props.editorState.getCurrentContent().hasText();
    };
    DraftEditor.prototype._renderPlaceholder = function () {
        if (this._showPlaceholder()) {
            var placeHolderProps = {
                text: nullthrows(this.props.placeholder),
                editorState: this.props.editorState,
                textAlignment: this.props.textAlignment,
                accessibilityID: this._placeholderAccessibilityID
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
            return React.createElement(DraftEditorPlaceholder, __assign({}, placeHolderProps));
        }
        return null;
    };
    DraftEditor.prototype.render = function () {
        var _this = this;
        var _a = this.props, blockRenderMap = _a.blockRenderMap, blockRendererFn = _a.blockRendererFn, blockStyleFn = _a.blockStyleFn, customStyleFn = _a.customStyleFn, customStyleMap = _a.customStyleMap, editorState = _a.editorState, readOnly = _a.readOnly, textAlignment = _a.textAlignment, textDirectionality = _a.textDirectionality;
        console.log('ffffffffffffff');
        var rootClass = cx({
            "DraftEditor/root": true,
            "DraftEditor/alignLeft": textAlignment === "left",
            "DraftEditor/alignRight": textAlignment === "right",
            "DraftEditor/alignCenter": textAlignment === "center"
        });
        var contentStyle = {
            outline: "none",
            // fix parent-draggable Safari bug. #1326
            userSelect: "text",
            WebkitUserSelect: "text",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word"
        };
        // The aria-expanded and aria-haspopup properties should only be rendered
        // for a combobox.
        /* $FlowFixMe(>=0.68.0 site=www,mobile) This comment suppresses an error
         * found when Flow v0.68 was deployed. To see the error delete this comment
         * and run Flow. */
        var ariaRole = this.props.role || "textbox";
        var ariaExpanded = ariaRole === "combobox" ? !!this.props.ariaExpanded : null;
        var editorContentsProps = {
            blockRenderMap: blockRenderMap,
            blockRendererFn: blockRendererFn,
            blockStyleFn: blockStyleFn,
            customStyleMap: __assign(__assign({}, DefaultDraftInlineStyle), customStyleMap),
            customStyleFn: customStyleFn,
            editorKey: this._editorKey,
            editorState: editorState,
            textDirectionality: textDirectionality
        };
        return (React.createElement("div", { className: rootClass },
            this._renderPlaceholder(),
            React.createElement("div", { className: cx("DraftEditor/editorContainer"), ref: function (ref) { return (_this.editorContainer = ref); } },
                React.createElement("div", { "aria-activedescendant": readOnly ? null : this.props.ariaActiveDescendantID, "aria-autocomplete": (readOnly ? null : this.props.ariaAutoComplete), "aria-controls": readOnly ? null : this.props.ariaControls, "aria-describedby": this.props.ariaDescribedBy || this._placeholderAccessibilityID, "aria-expanded": readOnly ? null : ariaExpanded, "aria-label": this.props.ariaLabel, "aria-labelledby": this.props.ariaLabelledBy, "aria-multiline": this.props.ariaMultiline, "aria-owns": readOnly ? null : this.props.ariaOwneeID, autoCapitalize: this.props.autoCapitalize, 
                    // autoComplete={this.props.autoComplete}
                    autoCorrect: this.props.autoCorrect, className: cx({
                        // Chrome's built-in translation feature mutates the DOM in ways
                        // that Draft doesn't expect (ex: adding <font> tags inside
                        // DraftEditorLeaf spans) and causes problems. We add notranslate
                        // here which makes its autotranslation skip over this subtree.
                        notranslate: !readOnly,
                        "public/DraftEditor/content": true
                    }), contentEditable: !readOnly, "data-testid": this.props.webDriverTestID, onBeforeInput: this._onBeforeInput, onBlur: this._onBlur, onCompositionEnd: this._onCompositionEnd, onCompositionStart: this._onCompositionStart, onCopy: this._onCopy, onCut: this._onCut, onDragEnd: this._onDragEnd, onDragEnter: this.onDragEnter, onDragLeave: this.onDragLeave, onDragOver: this._onDragOver, onDragStart: this._onDragStart, onDrop: this._onDrop, onFocus: this._onFocus, onInput: this._onInput, onKeyDown: this._onKeyDown, onKeyPress: this._onKeyPress, onKeyUp: this._onKeyUp, onMouseUp: this._onMouseUp, onPaste: this._onPaste, onSelect: this._onSelect, ref: function (ref) { return (_this.editor = ref); }, role: readOnly ? null : ariaRole, spellCheck: allowSpellCheck && this.props.spellCheck, style: contentStyle, suppressContentEditableWarning: true, tabIndex: this.props.tabIndex },
                    React.createElement(UpdateDraftEditorFlags, { editor: this, editorState: editorState }),
                    React.createElement(theExport, __assign({}, editorContentsProps, { key: "contents" + this.state.contentsKey }))))));
    };
    DraftEditor.prototype.componentDidMount = function () {
        this._blockSelectEvents = false;
        if (!didInitODS && gkx("draft_ods_enabled")) {
            didInitODS = true;
            DraftEffects.initODS();
        }
        this.setMode("edit");
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
                global["execCommand"]("AutoUrlDetect", false, false);
            }
            else {
                this.editor.ownerDocument["execCommand"]("AutoUrlDetect", false, false);
            }
        }
    };
    DraftEditor.prototype.componentDidUpdate = function () {
        this._blockSelectEvents = false;
        this._latestEditorState = this.props.editorState;
        this._latestCommittedEditorState = this.props.editorState;
    };
    DraftEditor.defaultProps = {
        blockRenderMap: DefaultDraftBlockRenderMap,
        blockRendererFn: function () {
            return null;
        },
        blockStyleFn: function () {
            return "";
        },
        keyBindingFn: getDefaultKeyBinding,
        readOnly: false,
        spellCheck: false,
        stripPastedStyles: false
    };
    return DraftEditor;
}(React.Component));

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

var RawDraftContentState = /*#__PURE__*/Object.freeze({
    __proto__: null
});

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
var DraftStringKey = {
    stringify: function (key) {
        return '_' + String(key);
    },
    unstringify: function (key) {
        return key.slice(1);
    },
};

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
var strlen = UnicodeUtils.strlen;
/**
 * Convert to UTF-8 character counts for storage.
 */
function encodeEntityRanges(block, storageMap) {
    var encoded = [];
    block.findEntityRanges(function (character) { return !!character.getEntity(); }, function (/*number*/ start, /*number*/ end) {
        var text = block.getText();
        var key = block.getEntityAt(start);
        encoded.push({
            offset: strlen(text.slice(0, start)),
            length: strlen(text.slice(start, end)),
            // Encode the key as a number for range storage.
            key: Number(storageMap[DraftStringKey.stringify(key)]),
        });
    });
    return encoded;
}

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
var areEqual$1 = function (a, b) { return a === b; };
var isTruthy = function (a) { return !!a; };
var EMPTY_ARRAY = [];
/**
 * Helper function for getting encoded styles for each inline style. Convert
 * to UTF-8 character counts for storage.
 */
function getEncodedInlinesForType(block, styleList, styleToEncode) {
    var ranges = [];
    // Obtain an array with ranges for only the specified style.
    var filteredInlines = styleList
        .map(function (style) { return style.has(styleToEncode); })
        .toList();
    findRangesImmutable(filteredInlines, areEqual$1, 
    // We only want to keep ranges with nonzero style values.
    isTruthy, function (start, end) {
        var text = block.getText();
        ranges.push({
            offset: UnicodeUtils.strlen(text.slice(0, start)),
            length: UnicodeUtils.strlen(text.slice(start, end)),
            style: styleToEncode,
        });
    });
    return ranges;
}
/*
 * Retrieve the encoded arrays of inline styles, with each individual style
 * treated separately.
 */
function encodeInlineStyleRanges(block) {
    var styleList = block
        .getCharacterList()
        .map(function (c) { return c.getStyle(); })
        .toList();
    var ranges = styleList
        .flatten()
        .toSet()
        .map(function (style) { return getEncodedInlinesForType(block, styleList, style); });
    return Array.prototype.concat.apply(EMPTY_ARRAY, ranges.toJS());
}

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
var createRawBlock = function (block, entityStorageMap) {
    return {
        key: block.getKey(),
        text: block.getText(),
        type: block.getType(),
        depth: block.getDepth(),
        inlineStyleRanges: encodeInlineStyleRanges(block),
        entityRanges: encodeEntityRanges(block, entityStorageMap),
        data: block.getData().toObject(),
    };
};
var insertRawBlock = function (block, entityMap, rawBlocks, blockCacheRef) {
    if (block instanceof ContentBlock) {
        rawBlocks.push(createRawBlock(block, entityMap));
        return;
    }
    invariant(block instanceof ContentBlockNode, 'block is not a BlockNode');
    var parentKey = block.getParentKey();
    var rawBlock = (blockCacheRef[block.getKey()] = __assign(__assign({}, createRawBlock(block, entityMap)), { children: [] }));
    if (parentKey) {
        blockCacheRef[parentKey].children.push(rawBlock);
        return;
    }
    rawBlocks.push(rawBlock);
};
var encodeRawBlocks = function (contentState, rawState) {
    var entityMap = rawState.entityMap;
    var rawBlocks = [];
    var blockCacheRef = {};
    var entityCacheRef = {};
    var entityStorageKey = 0;
    contentState.getBlockMap().forEach(function (block) {
        block.findEntityRanges(function (character) { return character.getEntity() !== null; }, function (start) {
            var entityKey = block.getEntityAt(start);
            // Stringify to maintain order of otherwise numeric keys.
            var stringifiedEntityKey = DraftStringKey.stringify(entityKey);
            // This makes this function resilient to two entities
            // erroneously having the same key
            if (entityCacheRef[stringifiedEntityKey]) {
                return;
            }
            entityCacheRef[stringifiedEntityKey] = entityKey;
            // we need the `any` casting here since this is a temporary state
            // where we will later on flip the entity map and populate it with
            // real entity, at this stage we just need to map back the entity
            // key used by the BlockNode
            entityMap[stringifiedEntityKey] = "" + entityStorageKey;
            entityStorageKey++;
        });
        insertRawBlock(block, entityMap, rawBlocks, blockCacheRef);
    });
    return {
        blocks: rawBlocks,
        entityMap: entityMap,
    };
};
// Flip storage map so that our storage keys map to global
// DraftEntity keys.
var encodeRawEntityMap = function (contentState, rawState) {
    var blocks = rawState.blocks, entityMap = rawState.entityMap;
    var rawEntityMap = {};
    Object.keys(entityMap).forEach(function (key, index) {
        var entity = contentState.getEntity(DraftStringKey.unstringify(key));
        rawEntityMap[index] = {
            type: entity.getType(),
            mutability: entity.getMutability(),
            data: entity.getData(),
        };
    });
    return {
        blocks: blocks,
        entityMap: rawEntityMap,
    };
};
var convertFromDraftStateToRaw = function (contentState) {
    var rawDraftContentState = {
        entityMap: {},
        blocks: [],
    };
    // add blocks
    rawDraftContentState = encodeRawBlocks(contentState, rawDraftContentState);
    // add entities
    rawDraftContentState = encodeRawEntityMap(contentState, rawDraftContentState);
    return rawDraftContentState;
};

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 * @emails oncall+draft_js
 *
 * This is unstable and not part of the public API and should not be used by
 * production systems. This file may be update/removed without notice.
 */
var traverseInDepthOrder = function (blocks, fn) {
    var stack = __spreadArrays(blocks).reverse();
    while (stack.length) {
        var block = stack.pop();
        fn(block);
        var children = block.children;
        invariant(Array.isArray(children), 'Invalid tree raw block');
        stack = stack.concat(__spreadArrays(children.reverse()));
    }
};
var isListBlock = function (block) {
    if (!(block && block.type)) {
        return false;
    }
    var type = block.type;
    return type === 'unordered-list-item' || type === 'ordered-list-item';
};
var addDepthToChildren = function (block) {
    if (Array.isArray(block.children)) {
        block.children = block.children.map(function (child) {
            return child.type === block.type
                ? __assign(__assign({}, child), { depth: (block.depth || 0) + 1 }) : child;
        });
    }
};
/**
 * This adapter is intended to be be used as an adapter to draft tree data
 *
 * draft state <=====> draft tree state
 */
var DraftTreeAdapter = {
    /**
     * Converts from a tree raw state back to draft raw state
     */
    fromRawTreeStateToRawState: function (draftTreeState) {
        var blocks = draftTreeState.blocks;
        var transformedBlocks = [];
        invariant(Array.isArray(blocks), 'Invalid raw state');
        if (!Array.isArray(blocks) || !blocks.length) {
            return draftTreeState;
        }
        traverseInDepthOrder(blocks, function (block) {
            var newBlock = __assign({}, block);
            if (isListBlock(block)) {
                newBlock.depth = newBlock.depth || 0;
                addDepthToChildren(block);
                // if it's a non-leaf node, we don't do anything else
                if (block.children != null && block.children.length > 0) {
                    return;
                }
            }
            delete newBlock.children;
            transformedBlocks.push(newBlock);
        });
        draftTreeState.blocks = transformedBlocks;
        return __assign(__assign({}, draftTreeState), { blocks: transformedBlocks });
    },
    /**
     * Converts from draft raw state to tree draft state
     */
    fromRawStateToRawTreeState: function (draftState) {
        var transformedBlocks = [];
        var parentStack = [];
        draftState.blocks.forEach(function (block) {
            var isList = isListBlock(block);
            var depth = block.depth || 0;
            var treeBlock = __assign(__assign({}, block), { children: [] });
            if (!isList) {
                transformedBlocks.push(treeBlock);
                return;
            }
            var lastParent = parentStack[0];
            // block is non-nested & there are no nested blocks, directly push block
            if (lastParent == null && depth === 0) {
                transformedBlocks.push(treeBlock);
                // block is first nested block or previous nested block is at a lower level
            }
            else if (lastParent == null || lastParent.depth < depth - 1) {
                // create new parent block
                var newParent = {
                    key: generateRandomKey(),
                    text: '',
                    depth: depth - 1,
                    type: block.type,
                    children: [],
                    entityRanges: [],
                    inlineStyleRanges: [],
                };
                parentStack.unshift(newParent);
                if (depth === 1) {
                    // add as a root-level block
                    transformedBlocks.push(newParent);
                }
                else if (lastParent != null) {
                    // depth > 1 => also add as previous parent's child
                    lastParent.children.push(newParent);
                }
                newParent.children.push(treeBlock);
            }
            else if (lastParent.depth === depth - 1) {
                // add as child of last parent
                lastParent.children.push(treeBlock);
            }
            else {
                // pop out parents at levels above this one from the parent stack
                while (lastParent != null && lastParent.depth >= depth) {
                    parentStack.shift();
                    lastParent = parentStack[0];
                }
                if (depth > 0) {
                    lastParent.children.push(treeBlock);
                }
                else {
                    transformedBlocks.push(treeBlock);
                }
            }
        });
        return __assign(__assign({}, draftState), { blocks: transformedBlocks });
    },
};

var DraftTreeInvariants = {
    /**
     * Check if the block is valid
     */
    isValidBlock: function (block, blockMap) {
        var key = block.getKey();
        // is its parent's child
        var parentKey = block.getParentKey();
        if (parentKey != null) {
            var parent_1 = blockMap.get(parentKey);
            if (!parent_1.getChildKeys().includes(key)) {
                warning(true, 'Tree is missing parent -> child pointer on %s', key);
                return false;
            }
        }
        // is its children's parent
        var children = block.getChildKeys().map(function (k) { return blockMap.get(k); });
        if (!children.every(function (c) { return c.getParentKey() === key; })) {
            warning(true, 'Tree is missing child -> parent pointer on %s', key);
            return false;
        }
        // is its previous sibling's next sibling
        var prevSiblingKey = block.getPrevSiblingKey();
        if (prevSiblingKey != null) {
            var prevSibling = blockMap.get(prevSiblingKey);
            if (prevSibling.getNextSiblingKey() !== key) {
                warning(true, "Tree is missing nextSibling pointer on %s's prevSibling", key);
                return false;
            }
        }
        // is its next sibling's previous sibling
        var nextSiblingKey = block.getNextSiblingKey();
        if (nextSiblingKey != null) {
            var nextSibling = blockMap.get(nextSiblingKey);
            if (nextSibling.getPrevSiblingKey() !== key) {
                warning(true, "Tree is missing prevSibling pointer on %s's nextSibling", key);
                return false;
            }
        }
        // no 2-node cycles
        if (nextSiblingKey !== null && prevSiblingKey !== null) {
            if (prevSiblingKey === nextSiblingKey) {
                warning(true, 'Tree has a two-node cycle at %s', key);
                return false;
            }
        }
        // if it's a leaf node, it has text but no children
        if (block.text != '') {
            if (block.getChildKeys().size > 0) {
                warning(true, 'Leaf node %s has children', key);
                return false;
            }
        }
        return true;
    },
    /**
     * Checks that this is a connected tree on all the blocks
     * starting from the first block, traversing nextSibling and child pointers
     * should be a tree (preorder traversal - parent, then children)
     * num of connected node === number of blocks
     */
    isConnectedTree: function (blockMap) {
        // exactly one node has no previous sibling + no parent
        var eligibleFirstNodes = blockMap
            .toArray()
            .filter(function (block) {
            return block.getParentKey() == null && block.getPrevSiblingKey() == null;
        });
        if (eligibleFirstNodes.length !== 1) {
            warning(true, 'Tree is not connected. More or less than one first node');
            return false;
        }
        var firstNode = eligibleFirstNodes.shift();
        var nodesSeen = 0;
        var currentKey = firstNode.getKey();
        var visitedStack = [];
        while (currentKey != null) {
            var currentNode = blockMap.get(currentKey);
            var childKeys = currentNode.getChildKeys();
            var nextSiblingKey = currentNode.getNextSiblingKey();
            // if the node has children, add parent's next sibling to stack and go to children
            if (childKeys.size > 0) {
                if (nextSiblingKey != null) {
                    visitedStack.unshift(nextSiblingKey);
                }
                var children = childKeys.map(function (k) { return blockMap.get(k); });
                var firstNode_1 = children.find(function (block) { return block.getPrevSiblingKey() == null; });
                if (firstNode_1 == null) {
                    warning(true, '%s has no first child', currentKey);
                    return false;
                }
                currentKey = firstNode_1.getKey();
                // TODO(T32490138): Deal with multi-node cycles here
            }
            else {
                if (currentNode.getNextSiblingKey() != null) {
                    currentKey = currentNode.getNextSiblingKey();
                }
                else {
                    currentKey = visitedStack.shift();
                }
            }
            nodesSeen++;
        }
        if (nodesSeen !== blockMap.size) {
            warning(true, 'Tree is not connected. %s nodes were seen instead of %s', nodesSeen, blockMap.size);
            return false;
        }
        return true;
    },
    /**
     * Checks that the block map is a connected tree with valid blocks
     */
    isValidTree: function (blockMap) {
        var _this = this;
        var blocks = blockMap.toArray();
        if (!blocks.every(function (block) { return _this.isValidBlock(block, blockMap); })) {
            return false;
        }
        return this.isConnectedTree(blockMap);
    },
};

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
function createCharacterList(inlineStyles, entities) {
    var characterArray = inlineStyles.map(function (style, ii) {
        var entity = entities[ii];
        return CharacterMetadata.create({ style: style, entity: entity });
    });
    return List(characterArray);
}

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
var substr = UnicodeUtils.substr;
/**
 * Convert to native JavaScript string lengths to determine ranges.
 */
function decodeEntityRanges(text, ranges) {
    var entities = Array(text.length).fill(null);
    if (ranges) {
        ranges.forEach(function (range) {
            // Using Unicode-enabled substrings converted to JavaScript lengths,
            // fill the output array with entity keys.
            var start = substr(text, 0, range.offset).length;
            var end = start + substr(text, range.offset, range.length).length;
            for (var ii = start; ii < end; ii++) {
                entities[ii] = range.key;
            }
        });
    }
    return entities;
}

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
var substr$1 = UnicodeUtils.substr;
var EMPTY_SET$3 = OrderedSet();
/**
 * Convert to native JavaScript string lengths to determine ranges.
 */
function decodeInlineStyleRanges(text, ranges) {
    var styles = Array(text.length).fill(EMPTY_SET$3);
    if (ranges) {
        ranges.forEach(function (range) {
            var cursor = substr$1(text, 0, range.offset).length;
            var end = cursor + substr$1(text, range.offset, range.length).length;
            while (cursor < end) {
                styles[cursor] = styles[cursor].add(range.style);
                cursor++;
            }
        });
    }
    return styles;
}

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
var experimentalTreeDataSupport$5 = gkx('draft_tree_data_support');
var decodeBlockNodeConfig = function (block, entityMap) {
    var key = block.key, type = block.type, data = block.data, text = block.text, depth = block.depth;
    var blockNodeConfig = {
        text: text,
        depth: depth || 0,
        type: type || 'unstyled',
        key: key || generateRandomKey(),
        data: Map(data),
        characterList: decodeCharacterList(block, entityMap),
    };
    return blockNodeConfig;
};
var decodeCharacterList = function (block, entityMap) {
    var text = block.text, rawEntityRanges = block.entityRanges, rawInlineStyleRanges = block.inlineStyleRanges;
    var entityRanges = rawEntityRanges || [];
    var inlineStyleRanges = rawInlineStyleRanges || [];
    // Translate entity range keys to the DraftEntity map.
    return createCharacterList(decodeInlineStyleRanges(text, inlineStyleRanges), decodeEntityRanges(text, entityRanges
        .filter(function (range) { return entityMap.hasOwnProperty(range.key); })
        .map(function (range) { return (__assign(__assign({}, range), { key: entityMap[range.key] })); })));
};
var addKeyIfMissing = function (block) {
    return __assign(__assign({}, block), { key: block.key || generateRandomKey() });
};
/**
 * Node stack is responsible to ensure we traverse the tree only once
 * in depth order, while also providing parent refs to inner nodes to
 * construct their links.
 */
var updateNodeStack = function (stack, nodes, parentRef) {
    var nodesWithParentRef = nodes.map(function (block) {
        return __assign(__assign({}, block), { parentRef: parentRef });
    });
    // since we pop nodes from the stack we need to insert them in reverse
    return stack.concat(nodesWithParentRef.reverse());
};
/**
 * This will build a tree draft content state by creating the node
 * reference links into a single tree walk. Each node has a link
 * reference to "parent", "children", "nextSibling" and "prevSibling"
 * blockMap will be created using depth ordering.
 */
var decodeContentBlockNodes = function (blocks, entityMap) {
    return (blocks
        // ensure children have valid keys to enable sibling links
        .map(addKeyIfMissing)
        .reduce(function (blockMap, block, index) {
        invariant(Array.isArray(block.children), 'invalid RawDraftContentBlock can not be converted to ContentBlockNode');
        // ensure children have valid keys to enable sibling links
        var children = block.children.map(addKeyIfMissing);
        // root level nodes
        var contentBlockNode = new ContentBlockNode(__assign(__assign({}, decodeBlockNodeConfig(block, entityMap)), { prevSibling: index === 0 ? null : blocks[index - 1].key, nextSibling: index === blocks.length - 1 ? null : blocks[index + 1].key, children: List(children.map(function (child) { return child.key; })) }));
        // push root node to blockMap
        blockMap = blockMap.set(contentBlockNode.getKey(), contentBlockNode);
        // this stack is used to ensure we visit all nodes respecting depth ordering
        var stack = updateNodeStack([], children, contentBlockNode);
        // start computing children nodes
        while (stack.length > 0) {
            // we pop from the stack and start processing this node
            var node = stack.pop();
            // parentRef already points to a converted ContentBlockNode
            var parentRef = node.parentRef;
            var siblings = parentRef.getChildKeys();
            var index_1 = siblings.indexOf(node.key);
            var isValidBlock = Array.isArray(node.children);
            if (!isValidBlock) {
                invariant(isValidBlock, 'invalid RawDraftContentBlock can not be converted to ContentBlockNode');
                break;
            }
            // ensure children have valid keys to enable sibling links
            var children_1 = node.children.map(addKeyIfMissing);
            var contentBlockNode_1 = new ContentBlockNode(__assign(__assign({}, decodeBlockNodeConfig(node, entityMap)), { parent: parentRef.getKey(), children: List(children_1.map(function (child) { return child.key; })), prevSibling: index_1 === 0 ? null : siblings.get(index_1 - 1), nextSibling: index_1 === siblings.size - 1 ? null : siblings.get(index_1 + 1) }));
            // push node to blockMap
            blockMap = blockMap.set(contentBlockNode_1.getKey(), contentBlockNode_1);
            // this stack is used to ensure we visit all nodes respecting depth ordering
            stack = updateNodeStack(stack, children_1, contentBlockNode_1);
        }
        return blockMap;
    }, OrderedMap()));
};
var decodeContentBlocks = function (blocks, entityMap) {
    return OrderedMap(blocks.map(function (block) {
        var contentBlock = new ContentBlock(decodeBlockNodeConfig(block, entityMap));
        return [contentBlock.getKey(), contentBlock];
    }));
};
var decodeRawBlocks = function (rawState, entityMap) {
    var isTreeRawBlock = rawState.blocks.find(function (block) { return Array.isArray(block.children) && block.children.length > 0; });
    var rawBlocks = experimentalTreeDataSupport$5 && !isTreeRawBlock
        ? DraftTreeAdapter.fromRawStateToRawTreeState(rawState).blocks
        : rawState.blocks;
    if (!experimentalTreeDataSupport$5) {
        return decodeContentBlocks(isTreeRawBlock
            ? DraftTreeAdapter.fromRawTreeStateToRawState(rawState).blocks
            : rawBlocks, entityMap);
    }
    var blockMap = decodeContentBlockNodes(rawBlocks, entityMap);
    // in dev mode, check that the tree invariants are met
    if (window['__DEV__']) {
        invariant(DraftTreeInvariants.isValidTree(blockMap), 'Should be a valid tree');
    }
    return blockMap;
};
var decodeRawEntityMap = function (rawState) {
    var rawEntityMap = rawState.entityMap;
    var entityMap = {};
    // TODO: Update this once we completely remove DraftEntity
    Object.keys(rawEntityMap).forEach(function (rawEntityKey) {
        var _a = rawEntityMap[rawEntityKey], type = _a.type, mutability = _a.mutability, data = _a.data;
        // get the key reference to created entity
        entityMap[rawEntityKey] = DraftEntity.__create(type, mutability, data || {});
    });
    return entityMap;
};
var convertFromRawToDraftState = function (rawState) {
    invariant(Array.isArray(rawState.blocks), 'invalid RawDraftContentState');
    // decode entities
    var entityMap = decodeRawEntityMap(rawState);
    // decode blockMap
    var blockMap = decodeRawBlocks(rawState, entityMap);
    // create initial selection
    var selectionState = blockMap.isEmpty()
        ? new SelectionState()
        : SelectionState.createEmpty(blockMap.first().getKey());
    return new ContentState({
        blockMap: blockMap,
        entityMap: entityMap,
        selectionBefore: selectionState,
        selectionAfter: selectionState,
    });
};

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
/**
 * Like range.getBoundingClientRect() but normalizes for browser bugs.
 */
function getRangeBoundingClientRect(range) {
    var _a, _b;
    // "Return a DOMRect object describing the smallest rectangle that includes
    // the first rectangle in list and all of the remaining rectangles of which
    // the height or width is not zero."
    // http://www.w3.org/TR/cssom-view/#dom-range-getboundingclientrect
    var rects = getRangeClientRects(range);
    var top = 0;
    var right = 0;
    var bottom = 0;
    var left = 0;
    if (rects.length) {
        // If the first rectangle has 0 width, we use the second, this is needed
        // because Chrome renders a 0 width rectangle when the selection contains
        // a line break.
        if (rects.length > 1 && rects[0].width === 0) {
            (_a = rects[1], top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left);
        }
        else {
            (_b = rects[0], top = _b.top, right = _b.right, bottom = _b.bottom, left = _b.left);
        }
        for (var ii = 1; ii < rects.length; ii++) {
            var rect = rects[ii];
            if (rect.height !== 0 && rect.width !== 0) {
                top = Math.min(top, rect.top);
                right = Math.max(right, rect.right);
                bottom = Math.max(bottom, rect.bottom);
                left = Math.min(left, rect.left);
            }
        }
    }
    return {
        top: top,
        right: right,
        bottom: bottom,
        left: left,
        width: right - left,
        height: bottom - top,
    };
}

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
/**
 * Return the bounding ClientRect for the visible DOM selection, if any.
 * In cases where there are no selected ranges or the bounding rect is
 * temporarily invalid, return null.
 *
 * When using from an iframe, you should pass the iframe window object
 */
function getVisibleSelectionRect(global) {
    var selection = global.getSelection();
    if (!selection.rangeCount) {
        return null;
    }
    var range = selection.getRangeAt(0);
    var boundingRect = getRangeBoundingClientRect(range);
    var top = boundingRect.top, right = boundingRect.right, bottom = boundingRect.bottom, left = boundingRect.left;
    // When a re-render leads to a node being removed, the DOM selection will
    // temporarily be placed on an ancestor node, which leads to an invalid
    // bounding rect. Discard this state.
    if (top === 0 && right === 0 && bottom === 0 && left === 0) {
        return null;
    }
    return boundingRect;
}

export { AtomicBlockUtils, BlockMapBuilder, CharacterMetadata, CompositeDraftDecorator as CompositeDecorator, ContentBlock, ContentState, DefaultDraftBlockRenderMap, DefaultDraftInlineStyle, DraftEditor, DraftEditor as Editor, DraftEditorBlock as EditorBlock, EditorState, DraftEntity as Entity, DraftEntityInstance as EntityInstance, KeyBindingUtil, DraftModifier as Modifier, RawDraftContentState, RichTextEditorUtil as RichUtils, SelectionState, convertFromHTMLToContentBlocks as convertFromHTML, convertFromRawToDraftState as convertFromRaw, convertFromDraftStateToRaw as convertToRaw, generateRandomKey as genKey, getDefaultKeyBinding, getVisibleSelectionRect };
//# sourceMappingURL=index.esm.js.map
