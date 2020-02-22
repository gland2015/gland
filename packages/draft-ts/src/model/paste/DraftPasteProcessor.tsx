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

import { BlockNodeRecord } from '../immutable/BlockNodeRecord';
import CharacterMetadata from '../immutable/CharacterMetadata';
import { DraftBlockRenderMap } from '../immutable/DraftBlockRenderMap';
import { DraftBlockType } from '../constants/DraftBlockType';
import { EntityMap } from '../immutable/EntityMap';

import ContentBlock from '../immutable/ContentBlock';
import ContentBlockNode from '../immutable/ContentBlockNode';

import convertFromHTMLToContentBlocks from '../encoding/convertFromHTMLToContentBlocks';
import generateRandomKey from '../keys/generateRandomKey';
import getSafeBodyFromHTML from './getSafeBodyFromHTML';
import gkx from '../../stubs/gkx';
import { List, Repeat } from 'immutable';
import sanitizeDraftText from '../encoding/sanitizeDraftText';

const experimentalTreeDataSupport = gkx('draft_tree_data_support');
const ContentBlockRecord = experimentalTreeDataSupport ? ContentBlockNode : ContentBlock;

const DraftPasteProcessor = {
    processHTML(html: string, blockRenderMap?: DraftBlockRenderMap): { contentBlocks: Array<BlockNodeRecord>; entityMap: EntityMap } {
        return convertFromHTMLToContentBlocks(html, getSafeBodyFromHTML, blockRenderMap);
    },

    processText(textBlocks: Array<string>, character: CharacterMetadata, type: DraftBlockType): Array<BlockNodeRecord> {
        return textBlocks.reduce((acc, textLine, index) => {
            textLine = sanitizeDraftText(textLine);
            const key = generateRandomKey();

            let blockNodeConfig = {
                key,
                type,
                text: textLine,
                characterList: List(Repeat(character, textLine.length))
            };

            // next block updates previous block
            if (experimentalTreeDataSupport && index !== 0) {
                const prevSiblingIndex = index - 1;
                // update previous block
                const previousBlock = (acc[prevSiblingIndex] = acc[prevSiblingIndex].merge({
                    nextSibling: key
                }));
                blockNodeConfig = {
                    ...blockNodeConfig,
                    prevSibling: previousBlock.getKey()
                } as any;
            }

            acc.push(new ContentBlockRecord(blockNodeConfig));

            return acc;
        }, []);
    }
};

export default DraftPasteProcessor;
