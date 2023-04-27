import * as React from 'react';
interface ScrollAreaProps {
    scrollDirection: 'left' | 'right';
}
declare function GridScrollAreaRaw(props: ScrollAreaProps): JSX.Element | null;
declare namespace GridScrollAreaRaw {
    var propTypes: any;
}
declare const GridScrollArea: React.MemoExoticComponent<typeof GridScrollAreaRaw>;
export { GridScrollArea };
