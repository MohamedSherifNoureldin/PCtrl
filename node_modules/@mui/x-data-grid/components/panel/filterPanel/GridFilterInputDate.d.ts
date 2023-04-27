/// <reference types="react" />
import { TextFieldProps } from '@mui/material/TextField';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
export type GridFilterInputDateProps = GridFilterInputValueProps & TextFieldProps & {
    type?: 'date' | 'datetime-local';
};
export declare const SUBMIT_FILTER_DATE_STROKE_TIME = 500;
declare function GridFilterInputDate(props: GridFilterInputDateProps): JSX.Element;
declare namespace GridFilterInputDate {
    var propTypes: any;
}
export { GridFilterInputDate };
