import React from 'react';
import { Map } from 'immutable';

import { DraftBlockElement } from '../../component';
import { DraftWrapperElement } from '../../component';

export const blockRenderMap:any = Map({
    unstyled: {
        element: DraftBlockElement,
        wrapper: <DraftWrapperElement />
    }
});


export * from './blockData'