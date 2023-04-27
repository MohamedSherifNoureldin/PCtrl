/// <reference types="react" />
import { TextFieldProps } from '@mui/material/TextField';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import { GridSingleSelectColDef } from '../../../models/colDef/gridColDef';
export type GridFilterInputSingleSelectProps = GridFilterInputValueProps & TextFieldProps & Pick<GridSingleSelectColDef, 'getOptionLabel' | 'getOptionValue'> & {
    type?: 'singleSelect';
};
declare function GridFilterInputSingleSelect(props: GridFilterInputSingleSelectProps): JSX.Element | null;
declare namespace GridFilterInputSingleSelect {
    var propTypes: any;
}
export { GridFilterInputSingleSelect };
