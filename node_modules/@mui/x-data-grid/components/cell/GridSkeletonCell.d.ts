import * as React from 'react';
export interface GridSkeletonCellProps {
    width: number;
    contentWidth: number;
    field: string;
    align: string;
}
declare function GridSkeletonCell(props: React.HTMLAttributes<HTMLDivElement> & GridSkeletonCellProps): JSX.Element;
declare namespace GridSkeletonCell {
    var propTypes: any;
}
export { GridSkeletonCell };
