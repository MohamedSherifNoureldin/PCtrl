import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
export declare function useGridDimensions(apiRef: React.MutableRefObject<GridPrivateApiCommunity>, props: Pick<DataGridProcessedProps, 'onResize' | 'scrollbarSize' | 'pagination' | 'paginationMode' | 'autoHeight' | 'getRowHeight' | 'rowHeight' | 'columnHeaderHeight'>): void;
