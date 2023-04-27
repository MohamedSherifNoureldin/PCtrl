import type { GridColDef, GridSingleSelectColDef, ValueOptions } from '../../../models/colDef/gridColDef';
export declare function isSingleSelectColDef(colDef: GridColDef | null): colDef is GridSingleSelectColDef;
export declare function getValueFromValueOptions(value: string, valueOptions: any[] | undefined, getOptionValue: NonNullable<GridSingleSelectColDef['getOptionValue']>): any;
export declare const getLabelFromValueOption: (valueOption: ValueOptions) => string;
