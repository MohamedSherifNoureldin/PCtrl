import { GridFilterOperator } from '../models/gridFilterOperator';
import { GridCellParams } from '../models';
export declare const getGridNumericQuickFilterFn: (value: any) => (({ value: columnValue }: GridCellParams) => boolean) | null;
export declare const getGridNumericOperators: () => GridFilterOperator<any, number | string | null, any>[];
