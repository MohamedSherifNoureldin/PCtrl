import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["components", "componentsProps"];
import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { GRID_DEFAULT_LOCALE_TEXT } from '../constants';
import { DATA_GRID_DEFAULT_SLOTS_COMPONENTS } from '../constants/defaultGridSlotsComponents';
import { GridEditModes } from '../models';
import { computeSlots, uncapitalizeObjectKeys } from '../internals/utils';
var DATA_GRID_FORCED_PROPS = {
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
export var DATA_GRID_PROPS_DEFAULT_VALUES = {
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
var defaultSlots = uncapitalizeObjectKeys(DATA_GRID_DEFAULT_SLOTS_COMPONENTS);
export var useDataGridProps = function useDataGridProps(inProps) {
  var _useThemeProps = useThemeProps({
      props: inProps,
      name: 'MuiDataGrid'
    }),
    components = _useThemeProps.components,
    componentsProps = _useThemeProps.componentsProps,
    themedProps = _objectWithoutProperties(_useThemeProps, _excluded);
  var localeText = React.useMemo(function () {
    return _extends({}, GRID_DEFAULT_LOCALE_TEXT, themedProps.localeText);
  }, [themedProps.localeText]);
  var slots = React.useMemo(function () {
    return computeSlots({
      defaultSlots: defaultSlots,
      slots: themedProps.slots,
      components: components
    });
  }, [components, themedProps.slots]);
  return React.useMemo(function () {
    var _themedProps$slotProp;
    return _extends({}, DATA_GRID_PROPS_DEFAULT_VALUES, themedProps, {
      localeText: localeText,
      slots: slots,
      slotProps: (_themedProps$slotProp = themedProps.slotProps) != null ? _themedProps$slotProp : componentsProps
    }, DATA_GRID_FORCED_PROPS);
  }, [themedProps, localeText, slots, componentsProps]);
};