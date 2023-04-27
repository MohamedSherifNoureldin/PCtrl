import * as React from 'react';
import { GridRenderContext } from '../../../models/params/gridScrollParams';
import { GridStateColDef } from '../../../models/colDef/gridColDef';
import { GridSortColumnLookup } from '../sorting';
import { GridFilterActiveItemsLookup } from '../filter';
import { GridColumnGroupIdentifier, GridColumnIdentifier } from '../focus';
import { GridColumnMenuState } from '../columnMenu';
import { GridColumnVisibilityModel } from '../columns';
import { GridGroupingStructure } from '../columnGrouping/gridColumnGroupsInterfaces';
export interface UseGridColumnHeadersProps {
    innerRef?: React.Ref<HTMLDivElement>;
    minColumnIndex?: number;
    visibleColumns: GridStateColDef[];
    sortColumnLookup: GridSortColumnLookup;
    filterColumnLookup: GridFilterActiveItemsLookup;
    columnPositions: number[];
    columnHeaderTabIndexState: GridColumnIdentifier | null;
    columnGroupHeaderTabIndexState: GridColumnGroupIdentifier | null;
    columnHeaderFocus: GridColumnIdentifier | null;
    columnGroupHeaderFocus: GridColumnGroupIdentifier | null;
    densityFactor: number;
    headerGroupingMaxDepth: number;
    columnMenuState: GridColumnMenuState;
    columnVisibility: GridColumnVisibilityModel;
    columnGroupsHeaderStructure: GridGroupingStructure[][];
    hasOtherElementInTabSequence: boolean;
}
interface GetHeadersParams {
    renderContext: GridRenderContext | null;
    minFirstColumn?: number;
    maxLastColumn?: number;
}
export declare const useGridColumnHeaders: (props: UseGridColumnHeadersProps) => {
    renderContext: GridRenderContext | null;
    getColumnHeaders: (params?: GetHeadersParams, other?: {}) => JSX.Element | null;
    getColumnGroupHeaders: (params?: GetHeadersParams) => JSX.Element[] | null;
    isDragging: boolean;
    getRootProps: (other?: {}) => {
        style: {
            minHeight: number;
            maxHeight: number;
            lineHeight: string;
        };
    };
    getInnerProps: () => {
        ref: ((instance: HTMLDivElement | null) => void) | null;
        role: string;
    };
};
export {};
