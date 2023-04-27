/// <reference types="react" />
import { AutocompleteProps } from '@mui/material/Autocomplete';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
export type GridFilterInputMultipleValueProps = {
    type?: 'text' | 'number';
} & GridFilterInputValueProps & Omit<AutocompleteProps<string, true, false, true>, 'options' | 'renderInput'>;
declare function GridFilterInputMultipleValue(props: GridFilterInputMultipleValueProps): JSX.Element;
declare namespace GridFilterInputMultipleValue {
    var propTypes: any;
}
export { GridFilterInputMultipleValue };
