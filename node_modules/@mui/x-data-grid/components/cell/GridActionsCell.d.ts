/// <reference types="react" />
import { GridRenderCellParams } from '../../models/params/gridCellParams';
import { GridMenuProps } from '../menu/GridMenu';
interface GridActionsCellProps extends Omit<GridRenderCellParams, 'value' | 'formattedValue' | 'api'> {
    value?: GridRenderCellParams['value'];
    formattedValue?: GridRenderCellParams['formattedValue'];
    position?: GridMenuProps['position'];
}
declare function GridActionsCell(props: GridActionsCellProps): JSX.Element;
declare namespace GridActionsCell {
    var propTypes: any;
}
export { GridActionsCell };
export declare const renderActionsCell: (params: GridRenderCellParams) => JSX.Element;
