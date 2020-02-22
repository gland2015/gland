/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

"use strict";

import gkx from "./gkx";

const experimentalTreeDataSupport = gkx("draft_tree_data_support");
import DraftEditorContentsExperimental from "../component/contents/exploration/DraftEditorContentsExperimental.react";
import DraftEditorContents from "../component/contents/DraftEditorContents-core.react";

let theExport = experimentalTreeDataSupport ? DraftEditorContentsExperimental : DraftEditorContents;
export default theExport;
