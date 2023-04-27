/// <reference types="react" />
import { SelectProps, SelectChangeEvent } from '@mui/material/Select';
import { GridRenderEditCellParams } from '../../models/params/gridCellParams';
import { GridSingleSelectColDef } from '../../models/colDef/gridColDef';
export interface GridEditSingleSelectCellProps extends GridRenderEditCellParams, Omit<SelectProps, 'id' | 'tabIndex' | 'value'>, Pick<GridSingleSelectColDef, 'getOptionLabel' | 'getOptionValue'> {
    /**
     * Callback called when the value is changed by the user.
     * @param {SelectChangeEvent<any>} event The event source of the callback.
     * @param {any} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
     * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
     */
    onValueChange?: (event: SelectChangeEvent<any>, newValue: any) => Promise<void> | void;
    /**
     * If true, the select opens by default.
     */
    initialOpen?: boolean;
}
declare function GridEditSingleSelectCell(props: GridEditSingleSelectCellProps): JSX.Element | null;
declare namespace GridEditSingleSelectCell {
    var propTypes: any;
}
export { GridEditSingleSelectCell };
export declare const renderEditSingleSelectCell: (params: GridEditSingleSelectCellProps) => JSX.Element;
