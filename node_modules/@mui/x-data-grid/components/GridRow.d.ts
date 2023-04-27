import * as React from 'react';
import { GridRowId, GridRowModel } from '../models/gridRows';
import { GridStateColDef } from '../models/colDef/gridColDef';
export interface GridRowProps extends React.HTMLAttributes<HTMLDivElement> {
    rowId: GridRowId;
    selected: boolean;
    /**
     * Index of the row in the whole sorted and filtered dataset.
     * If some rows above have expanded children, this index also take those children into account.
     */
    index: number;
    rowHeight: number | 'auto';
    containerWidth: number;
    firstColumnToRender: number;
    lastColumnToRender: number;
    visibleColumns: GridStateColDef[];
    renderedColumns: GridStateColDef[];
    position: 'left' | 'center' | 'right';
    /**
     * Determines which cell has focus.
     * If `null`, no cell in this row has focus.
     */
    focusedCell: string | null;
    /**
     * Determines which cell should be tabbable by having tabIndex=0.
     * If `null`, no cell in this row is in the tab sequence.
     */
    tabbableCell: string | null;
    row?: GridRowModel;
    isLastVisible?: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
    [x: string]: any;
}
declare const GridRow: React.ForwardRefExoticComponent<Omit<GridRowProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
export { GridRow };
