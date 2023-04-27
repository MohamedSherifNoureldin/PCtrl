import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["components", "componentsProps"];
import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { GRID_DEFAULT_LOCALE_TEXT } from '../constants';
import { DATA_GRID_DEFAULT_SLOTS_COMPONENTS } from '../constants/defaultGridSlotsComponents';
import { GridEditModes } from '../models';
import { computeSlots, uncapitalizeObjectKeys } from '../internals/utils';
const DATA_GRID_FORCED_PROPS = {
  disableMultipleColumnsFiltering: true,
  disableMultipleColumnsSorting: true,
  disableMultipleRowSelection: true,
  throttleRowsMs: undefined,
  hideFooterRowCount: false,
  pagination: true,
  checkboxSelectionVisibleOnly: false,
  disableColumnReorder: true,
  disableColumnResize: true,
  keepColumnPositionIfDraggedOutside: false,
  signature: 'DataGrid'
};

/**
 * The default values of `DataGridPropsWithDefaultValues` to inject in the props of DataGrid.
 */
export const DATA_GRID_PROPS_DEFAULT_VALUES = {
  autoHeight: false,
  autoPageSize: false,
  checkboxSelection: false,
  checkboxSelectionVisibleOnly: false,
  columnBuffer: 3,
  rowBuffer: 3,
  columnThreshold: 3,
  rowThreshold: 3,
  rowSelection: true,
  density: 'standard',
  disableColumnFilter: false,
  disableColumnMenu: false,
  disableColumnSelector: false,
  disableDensitySelector: false,
  disableMultipleColumnsFiltering: false,
  disableMultipleRowSelection: false,
  disableMultipleColumnsSorting: false,
  disableRowSelectionOnClick: false,
  disableVirtualization: false,
  editMode: GridEditModes.Cell,
  filterMode: 'client',
  columnHeaderHeight: 56,
  hideFooter: false,
  hideFooterPagination: false,
  hideFooterRowCount: false,
  hideFooterSelectedRowCount: false,
  logger: console,
  logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'warn',
  pagination: false,
  paginationMode: 'client',
  rowHeight: 52,
  pageSizeOptions: [25, 50, 100],
  rowSpacingType: 'margin',
  showCellVerticalBorder: false,
  showColumnVerticalBorder: false,
  sortingOrder: ['asc', 'desc', null],
  sortingMode: 'client',
  throttleRowsMs: 0,
  disableColumnReorder: false,
  disableColumnResize: false,
  keepNonExistentRowsSelected: false,
  keepColumnPositionIfDraggedOutside: false
};
const defaultSlots = uncapitalizeObjectKeys(DATA_GRID_DEFAULT_SLOTS_COMPONENTS);
export const useDataGridProps = inProps => {
  const _useThemeProps = useThemeProps({
      props: inProps,
      name: 'MuiDataGrid'
    }),
    {
      components,
      componentsProps
    } = _useThemeProps,
    themedProps = _objectWithoutPropertiesLoose(_useThemeProps, _excluded);
  const localeText = React.useMemo(() => _extends({}, GRID_DEFAULT_LOCALE_TEXT, themedProps.localeText), [themedProps.localeText]);
  const slots = React.useMemo(() => computeSlots({
    defaultSlots,
    slots: themedProps.slots,
    components
  }), [components, themedProps.slots]);
  return React.useMemo(() => _extends({}, DATA_GRID_PROPS_DEFAULT_VALUES, themedProps, {
    localeText,
    slots,
    slotProps: themedProps.slotProps ?? componentsProps
  }, DATA_GRID_FORCED_PROPS), [themedProps, localeText, slots, componentsProps]);
};