import { GridColTypeDef } from '../models/colDef/gridColDef';
import { GridValueFormatterParams } from '../models/params/gridCellParams';
export declare function gridDateFormatter({ value, field, id }: GridValueFormatterParams<Date>): string;
export declare function gridDateTimeFormatter({ value, field, id }: GridValueFormatterParams<Date>): string;
export declare const GRID_DATE_COL_DEF: GridColTypeDef<Date, string>;
export declare const GRID_DATETIME_COL_DEF: GridColTypeDef<Date, string>;
