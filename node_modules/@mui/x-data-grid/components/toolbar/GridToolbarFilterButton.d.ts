import * as React from 'react';
import { ButtonProps } from '@mui/material/Button';
import { TooltipProps } from '@mui/material/Tooltip';
export interface GridToolbarFilterButtonProps extends Omit<TooltipProps, 'title' | 'children' | 'componentsProps'> {
    /**
     * The props used for each slot inside.
     * @default {}
     */
    componentsProps?: {
        button?: ButtonProps;
    };
}
declare const GridToolbarFilterButton: React.ForwardRefExoticComponent<Omit<GridToolbarFilterButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;
export { GridToolbarFilterButton };
