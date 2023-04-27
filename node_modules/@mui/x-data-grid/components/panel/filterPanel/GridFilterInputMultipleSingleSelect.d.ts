/// <reference types="react" />
import { AutocompleteProps } from '@mui/material/Autocomplete';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import type { GridSingleSelectColDef, ValueOptions } from '../../../models/colDef/gridColDef';
export interface GridFilterInputMultipleSingleSelectProps extends Omit<AutocompleteProps<ValueOptions, true, false, true>, 'options' | 'renderInput' | 'onChange' | 'value' | 'id' | 'filterOptions' | 'isOptionEqualToValue' | 'multiple' | 'color' | 'getOptionLabel'>, Pick<GridSingleSelectColDef, 'getOptionLabel' | 'getOptionValue'>, GridFilterInputValueProps {
    type?: 'singleSelect';
}
declare function GridFilterInputMultipleSingleSelect(props: GridFilterInputMultipleSingleSelectProps): JSX.Element;
declare namespace GridFilterInputMultipleSingleSelect {
    var propTypes: any;
}
export { GridFilterInputMultipleSingleSelect };
