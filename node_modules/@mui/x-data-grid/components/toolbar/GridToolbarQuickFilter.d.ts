/// <reference types="react" />
import { TextFieldProps } from '@mui/material/TextField';
import { GridFilterModel } from '../../models/gridFilterModel';
export type GridToolbarQuickFilterProps = TextFieldProps & {
    /**
     * Function responsible for parsing text input in an array of independent values for quick filtering.
     * @param {string} input The value entered by the user
     * @returns {any[]} The array of value on which quick filter is applied
     */
    quickFilterParser?: (input: string) => any[];
    /**
     * Function responsible for formatting values of quick filter in a string when the model is modified
     * @param {any[]} values The new values passed to the quick filter model
     * @returns {string} The string to display in the text field
     */
    quickFilterFormatter?: (values: GridFilterModel['quickFilterValues']) => string;
    /**
     * The debounce time in milliseconds.
     * @default 500
     */
    debounceMs?: number;
};
declare function GridToolbarQuickFilter(props: GridToolbarQuickFilterProps): JSX.Element;
declare namespace GridToolbarQuickFilter {
    var propTypes: any;
}
export { GridToolbarQuickFilter };
