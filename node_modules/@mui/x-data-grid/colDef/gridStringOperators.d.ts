import { GridFilterOperator } from '../models/gridFilterOperator';
import { GridCellParams } from '../models';
export declare const getGridStringQuickFilterFn: (value: any) => (({ formattedValue: columnValue }: GridCellParams) => boolean) | null;
export declare const getGridStringOperators: (disableTrim?: boolean) => GridFilterOperator<any, number | string | null, any>[];
