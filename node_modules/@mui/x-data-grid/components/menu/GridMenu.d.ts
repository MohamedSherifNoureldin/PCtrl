import * as React from 'react';
import { ClickAwayListenerProps } from '@mui/material/ClickAwayListener';
import { GrowProps } from '@mui/material/Grow';
import { PopperProps } from '@mui/material/Popper';
type MenuPosition = 'bottom-end' | 'bottom-start' | 'bottom' | 'left-end' | 'left-start' | 'left' | 'right-end' | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top' | undefined;
export interface GridMenuProps extends Omit<PopperProps, 'onKeyDown' | 'children'> {
    open: boolean;
    target: HTMLElement | null;
    onClickAway: ClickAwayListenerProps['onClickAway'];
    position?: MenuPosition;
    onExited?: GrowProps['onExited'];
    children: React.ReactNode;
}
declare function GridMenu(props: GridMenuProps): JSX.Element;
declare namespace GridMenu {
    var propTypes: any;
}
export { GridMenu };
