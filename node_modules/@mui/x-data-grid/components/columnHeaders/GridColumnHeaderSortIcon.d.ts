import * as React from 'react';
import { GridSortDirection } from '../../models/gridSortModel';
export interface GridColumnHeaderSortIconProps {
    direction: GridSortDirection;
    index: number | undefined;
    sortingOrder: GridSortDirection[];
}
declare function GridColumnHeaderSortIconRaw(props: GridColumnHeaderSortIconProps): JSX.Element | null;
declare namespace GridColumnHeaderSortIconRaw {
    var propTypes: any;
}
declare const GridColumnHeaderSortIcon: React.MemoExoticComponent<typeof GridColumnHeaderSortIconRaw>;
export { GridColumnHeaderSortIcon };
