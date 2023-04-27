import * as React from 'react';
interface DataGridVirtualScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
    disableVirtualization?: boolean;
}
declare const DataGridVirtualScroller: React.ForwardRefExoticComponent<DataGridVirtualScrollerProps & React.RefAttributes<HTMLDivElement>>;
export { DataGridVirtualScroller };
