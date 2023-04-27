import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridFilterFormProps } from './GridFilterForm';
import { GridColDef, GridStateColDef } from '../../../models/colDef/gridColDef';
export interface GetColumnForNewFilterArgs {
    currentFilters: GridFilterItem[];
    columns: GridStateColDef[];
}
export interface GridFilterPanelProps extends Pick<GridFilterFormProps, 'logicOperators' | 'columnsSort'> {
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx?: SxProps<Theme>;
    /**
     * Function that returns the next filter item to be picked as default filter.
     * @param {GetColumnForNewFilterArgs} args Currently configured filters and columns.
     * @returns {GridColDef['field']} The field to be used for the next filter or `null` to prevent adding a filter.
     */
    getColumnForNewFilter?: (args: GetColumnForNewFilterArgs) => GridColDef['field'] | null;
    /**
     * Props passed to each filter form.
     */
    filterFormProps?: Pick<GridFilterFormProps, 'columnsSort' | 'deleteIconProps' | 'logicOperatorInputProps' | 'operatorInputProps' | 'columnInputProps' | 'valueInputProps' | 'filterColumns'>;
    disableAddFilterButton?: boolean;
    disableRemoveAllButton?: boolean;
    /**
     * @ignore - do not document.
     */
    children?: React.ReactNode;
}
declare const GridFilterPanel: React.ForwardRefExoticComponent<GridFilterPanelProps & React.RefAttributes<HTMLDivElement>>;
export { GridFilterPanel };
