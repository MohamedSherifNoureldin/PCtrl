/// <reference types="react" />
import { TextFieldProps } from '@mui/material/TextField';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
export declare const SUBMIT_FILTER_STROKE_TIME = 500;
export interface GridTypeFilterInputValueProps extends GridFilterInputValueProps {
    type?: 'text' | 'number' | 'date' | 'datetime-local';
}
declare function GridFilterInputValue(props: GridTypeFilterInputValueProps & TextFieldProps): JSX.Element;
declare namespace GridFilterInputValue {
    var propTypes: any;
}
export { GridFilterInputValue };
