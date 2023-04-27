import * as React from 'react';
import { DataGridProps } from '../models/props/DataGridProps';
import { GridValidRowModel } from '../models/gridRows';
interface DataGridComponent {
    <R extends GridValidRowModel = any>(props: DataGridProps<R> & React.RefAttributes<HTMLDivElement>): JSX.Element;
    propTypes?: any;
}
export declare const DataGrid: DataGridComponent;
export {};
