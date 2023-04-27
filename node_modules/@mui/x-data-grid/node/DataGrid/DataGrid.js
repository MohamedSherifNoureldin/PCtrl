"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataGrid = void 0;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _utils = require("@mui/utils");
var _components = require("../components");
var _GridContextProvider = require("../context/GridContextProvider");
var _useDataGridComponent = require("./useDataGridComponent");
var _useDataGridProps = require("./useDataGridProps");
var _DataGridVirtualScroller = require("../components/DataGridVirtualScroller");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const DataGridRaw = /*#__PURE__*/React.forwardRef(function DataGrid(inProps, ref) {
  const props = (0, _useDataGridProps.useDataGridProps)(inProps);
  const privateApiRef = (0, _useDataGridComponent.useDataGridComponent)(props.apiRef, props);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridContextProvider.GridContextProvider, {
    privateApiRef: privateApiRef,
    props: props,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_components.GridRoot, {
      className: props.className,
      style: props.style,
      sx: props.sx,
      ref: ref,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_components.GridHeader, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_components.GridBody, {
        VirtualScrollerComponent: _DataGridVirtualScroller.DataGridVirtualScroller
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_components.GridFooterPlaceholder, {})]
    })
  });
});
const DataGrid = /*#__PURE__*/React.memo(DataGridRaw);
exports.DataGrid = DataGrid;
DataGridRaw.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The ref object that allows grid manipulation. Can be instantiated with `useGridApiRef()`.
   */
  apiRef: _propTypes.default.shape({
    current: _propTypes.default.object.isRequired
  }),
  /**
   * The label of the grid.
   */
  'aria-label': _propTypes.default.string,
  /**
   * The id of the element containing a label for the grid.
   */
  'aria-labelledby': _propTypes.default.string,
  /**
   * If `true`, the grid height is dynamic and follow the number of rows in the grid.
   * @default false
   */
  autoHeight: _propTypes.default.bool,
  /**
   * If `true`, the pageSize is calculated according to the container size and the max number of rows to avoid rendering a vertical scroll bar.
   * @default false
   */
  autoPageSize: _propTypes.default.bool,
  /**
   * Controls the modes of the cells.
   */
  cellModesModel: _propTypes.default.object,
  /**
   * If `true`, the grid get a first column with a checkbox that allows to select rows.
   * @default false
   */
  checkboxSelection: _propTypes.default.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object,
  /**
   * Number of extra columns to be rendered before/after the visible slice.
   * @default 3
   */
  columnBuffer: _propTypes.default.number,
  columnGroupingModel: _propTypes.default.arrayOf(_propTypes.default.object),
  /**
   * Sets the height in pixel of the column headers in the grid.
   * @default 56
   */
  columnHeaderHeight: _propTypes.default.number,
  /**
   * Set of columns of type [[GridColDef[]]].
   */
  columns: (0, _utils.chainPropTypes)(_propTypes.default.array.isRequired, props => {
    // @ts-ignore because otherwise `build:api` doesn't work
    if (props.columns && props.columns.some(column => column.resizable)) {
      return new Error([`MUI: \`column.resizable = true\` is not a valid prop.`, 'Column resizing is not available in the MIT version.', '', 'You need to upgrade to DataGridPro or DataGridPremium component to unlock this feature.'].join('\n'));
    }
    return null;
  }),
  /**
   * Number of rows from the `columnBuffer` that can be visible before a new slice is rendered.
   * @default 3
   */
  columnThreshold: _propTypes.default.number,
  /**
   * Set the column visibility model of the grid.
   * If defined, the grid will ignore the `hide` property in [[GridColDef]].
   */
  columnVisibilityModel: _propTypes.default.object,
  /**
   * Overridable components.
   * @deprecated Use `slots` instead.
   */
  components: _propTypes.default.object,
  /**
   * Overridable components props dynamically passed to the component at rendering.
   * @deprecated Use the `slotProps` prop instead.
   */
  componentsProps: _propTypes.default.object,
  /**
   * Set the density of the grid.
   * @default "standard"
   */
  density: _propTypes.default.oneOf(['comfortable', 'compact', 'standard']),
  /**
   * If `true`, column filters are disabled.
   * @default false
   */
  disableColumnFilter: _propTypes.default.bool,
  /**
   * If `true`, the column menu is disabled.
   * @default false
   */
  disableColumnMenu: _propTypes.default.bool,
  /**
   * If `true`, hiding/showing columns is disabled.
   * @default false
   */
  disableColumnSelector: _propTypes.default.bool,
  /**
   * If `true`, the density selector is disabled.
   * @default false
   */
  disableDensitySelector: _propTypes.default.bool,
  /**
   * If `true`, the selection on click on a row or cell is disabled.
   * @default false
   */
  disableRowSelectionOnClick: _propTypes.default.bool,
  /**
   * If `true`, the virtualization is disabled.
   * @default false
   */
  disableVirtualization: _propTypes.default.bool,
  /**
   * Controls whether to use the cell or row editing.
   * @default "cell"
   */
  editMode: _propTypes.default.oneOf(['cell', 'row']),
  /**
   * Unstable features, breaking changes might be introduced.
   * For each feature, if the flag is not explicitly set to `true`, the feature will be fully disabled and any property / method call will not have any effect.
   */
  experimentalFeatures: _propTypes.default.shape({
    columnGrouping: _propTypes.default.bool,
    warnIfFocusStateIsNotSynced: _propTypes.default.bool
  }),
  /**
   * Filtering can be processed on the server or client-side.
   * Set it to 'server' if you would like to handle filtering on the server-side.
   * @default "client"
   */
  filterMode: _propTypes.default.oneOf(['client', 'server']),
  /**
   * Set the filter model of the grid.
   */
  filterModel: _propTypes.default.shape({
    items: _propTypes.default.arrayOf(_propTypes.default.shape({
      field: _propTypes.default.string.isRequired,
      id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
      operator: _propTypes.default.string.isRequired,
      value: _propTypes.default.any
    })).isRequired,
    logicOperator: _propTypes.default.oneOf(['and', 'or']),
    quickFilterLogicOperator: _propTypes.default.oneOf(['and', 'or']),
    quickFilterValues: _propTypes.default.array
  }),
  /**
   * Function that applies CSS classes dynamically on cells.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @returns {string} The CSS class to apply to the cell.
   */
  getCellClassName: _propTypes.default.func,
  /**
   * Function that returns the element to render in row detail.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @returns {JSX.Element} The row detail element.
   */
  getDetailPanelContent: _propTypes.default.func,
  /**
   * Function that returns the estimated height for a row.
   * Only works if dynamic row height is used.
   * Once the row height is measured this value is discarded.
   * @param {GridRowHeightParams} params With all properties from [[GridRowHeightParams]].
   * @returns {number | null} The estimated row height value. If `null` or `undefined` then the default row height, based on the density, is applied.
   */
  getEstimatedRowHeight: _propTypes.default.func,
  /**
   * Function that applies CSS classes dynamically on rows.
   * @param {GridRowClassNameParams} params With all properties from [[GridRowClassNameParams]].
   * @returns {string} The CSS class to apply to the row.
   */
  getRowClassName: _propTypes.default.func,
  /**
   * Function that sets the row height per row.
   * @param {GridRowHeightParams} params With all properties from [[GridRowHeightParams]].
   * @returns {GridRowHeightReturnValue} The row height value. If `null` or `undefined` then the default row height is applied. If "auto" then the row height is calculated based on the content.
   */
  getRowHeight: _propTypes.default.func,
  /**
   * Return the id of a given [[GridRowModel]].
   */
  getRowId: _propTypes.default.func,
  /**
   * Function that allows to specify the spacing between rows.
   * @param {GridRowSpacingParams} params With all properties from [[GridRowSpacingParams]].
   * @returns {GridRowSpacing} The row spacing values.
   */
  getRowSpacing: _propTypes.default.func,
  /**
   * If `true`, the footer component is hidden.
   * @default false
   */
  hideFooter: _propTypes.default.bool,
  /**
   * If `true`, the pagination component in the footer is hidden.
   * @default false
   */
  hideFooterPagination: _propTypes.default.bool,
  /**
   * If `true`, the selected row count in the footer is hidden.
   * @default false
   */
  hideFooterSelectedRowCount: _propTypes.default.bool,
  /**
   * The initial state of the DataGrid.
   * The data in it will be set in the state on initialization but will not be controlled.
   * If one of the data in `initialState` is also being controlled, then the control state wins.
   */
  initialState: _propTypes.default.object,
  /**
   * Callback fired when a cell is rendered, returns true if the cell is editable.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @returns {boolean} A boolean indicating if the cell is editable.
   */
  isCellEditable: _propTypes.default.func,
  /**
   * Determines if a row can be selected.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @returns {boolean} A boolean indicating if the cell is selectable.
   */
  isRowSelectable: _propTypes.default.func,
  /**
   * If `true`, the selection model will retain selected rows that do not exist.
   * Useful when using server side pagination and row selections need to be retained
   * when changing pages.
   * @default false
   */
  keepNonExistentRowsSelected: _propTypes.default.bool,
  /**
   * If `true`, a  loading overlay is displayed.
   */
  loading: _propTypes.default.bool,
  /**
   * Set the locale text of the grid.
   * You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/grid/x-data-grid/src/constants/localeTextConstants.ts) in the GitHub repository.
   */
  localeText: _propTypes.default.object,
  /**
   * Pass a custom logger in the components that implements the [[Logger]] interface.
   * @default console
   */
  logger: _propTypes.default.shape({
    debug: _propTypes.default.func.isRequired,
    error: _propTypes.default.func.isRequired,
    info: _propTypes.default.func.isRequired,
    warn: _propTypes.default.func.isRequired
  }),
  /**
   * Allows to pass the logging level or false to turn off logging.
   * @default "error" ("warn" in dev mode)
   */
  logLevel: _propTypes.default.oneOf(['debug', 'error', 'info', 'warn', false]),
  /**
   * Nonce of the inline styles for [Content Security Policy](https://www.w3.org/TR/2016/REC-CSP2-20161215/#script-src-the-nonce-attribute).
   */
  nonce: _propTypes.default.string,
  /**
   * Callback fired when any cell is clicked.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellClick: _propTypes.default.func,
  /**
   * Callback fired when a double click event comes from a cell element.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellDoubleClick: _propTypes.default.func,
  /**
   * Callback fired when the cell turns to edit mode.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.KeyboardEvent | React.MouseEvent>} event The event that caused this prop to be called.
   */
  onCellEditStart: _propTypes.default.func,
  /**
   * Callback fired when the cell turns to view mode.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<MuiBaseEvent>} event The event that caused this prop to be called.
   */
  onCellEditStop: _propTypes.default.func,
  /**
   * Callback fired when a keydown event comes from a cell element.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.KeyboardEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellKeyDown: _propTypes.default.func,
  /**
   * Callback fired when the `cellModesModel` prop changes.
   * @param {GridCellModesModel} cellModesModel Object containing which cells are in "edit" mode.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellModesModelChange: _propTypes.default.func,
  /**
   * Callback fired when a click event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderClick: _propTypes.default.func,
  /**
   * Callback fired when a double click event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderDoubleClick: _propTypes.default.func,
  /**
   * Callback fired when a mouse enter event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderEnter: _propTypes.default.func,
  /**
   * Callback fired when a mouse leave event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderLeave: _propTypes.default.func,
  /**
   * Callback fired when a mouseout event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderOut: _propTypes.default.func,
  /**
   * Callback fired when a mouseover event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderOver: _propTypes.default.func,
  /**
   * Callback fired when a column is reordered.
   * @param {GridColumnOrderChangeParams} params With all properties from [[GridColumnOrderChangeParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnOrderChange: _propTypes.default.func,
  /**
   * Callback fired when the column visibility model changes.
   * @param {GridColumnVisibilityModel} model The new model.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnVisibilityModelChange: _propTypes.default.func,
  /**
   * Callback fired when the Filter model changes before the filters are applied.
   * @param {GridFilterModel} model With all properties from [[GridFilterModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onFilterModelChange: _propTypes.default.func,
  /**
   * Callback fired when the menu is closed.
   * @param {GridMenuParams} params With all properties from [[GridMenuParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onMenuClose: _propTypes.default.func,
  /**
   * Callback fired when the menu is opened.
   * @param {GridMenuParams} params With all properties from [[GridMenuParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onMenuOpen: _propTypes.default.func,
  /**
   * Callback fired when the pagination model has changed.
   * @param {GridPaginationModel} model Updated pagination model.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPaginationModelChange: _propTypes.default.func,
  /**
   * Callback fired when the preferences panel is closed.
   * @param {GridPreferencePanelParams} params With all properties from [[GridPreferencePanelParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPreferencePanelClose: _propTypes.default.func,
  /**
   * Callback fired when the preferences panel is opened.
   * @param {GridPreferencePanelParams} params With all properties from [[GridPreferencePanelParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPreferencePanelOpen: _propTypes.default.func,
  /**
   * Callback called when `processRowUpdate` throws an error or rejects.
   * @param {any} error The error thrown.
   */
  onProcessRowUpdateError: _propTypes.default.func,
  /**
   * Callback fired when the grid is resized.
   * @param {ElementSize} containerSize With all properties from [[ElementSize]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onResize: _propTypes.default.func,
  /**
   * Callback fired when a row is clicked.
   * Not called if the target clicked is an interactive element added by the built-in columns.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowClick: _propTypes.default.func,
  /**
   * Callback fired when a double click event comes from a row container element.
   * @param {GridRowParams} params With all properties from [[RowParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowDoubleClick: _propTypes.default.func,
  /**
   * Callback fired when the row changes are committed.
   * @param {GridRowId} id The row id.
   * @param {MuiEvent<MuiBaseEvent>} event The event that caused this prop to be called.
   */
  onRowEditCommit: _propTypes.default.func,
  /**
   * Callback fired when the row turns to edit mode.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {MuiEvent<React.KeyboardEvent | React.MouseEvent>} event The event that caused this prop to be called.
   */
  onRowEditStart: _propTypes.default.func,
  /**
   * Callback fired when the row turns to view mode.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {MuiEvent<MuiBaseEvent>} event The event that caused this prop to be called.
   */
  onRowEditStop: _propTypes.default.func,
  /**
   * Callback fired when the `rowModesModel` prop changes.
   * @param {GridRowModesModel} rowModesModel Object containing which rows are in "edit" mode.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowModesModelChange: _propTypes.default.func,
  /**
   * Callback fired when the selection state of one or multiple rows changes.
   * @param {GridRowSelectionModel} rowSelectionModel With all the row ids [[GridSelectionModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowSelectionModelChange: _propTypes.default.func,
  /**
   * Callback fired when the sort model changes before a column is sorted.
   * @param {GridSortModel} model With all properties from [[GridSortModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onSortModelChange: _propTypes.default.func,
  /**
   * Callback fired when the state of the grid is updated.
   * @param {GridState} state The new state.
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   * @ignore - do not document.
   */
  onStateChange: _propTypes.default.func,
  /**
   * Select the pageSize dynamically using the component UI.
   * @default [25, 50, 100]
   */
  pageSizeOptions: _propTypes.default.arrayOf(_propTypes.default.number),
  pagination: props => {
    if (props.pagination === false) {
      return new Error(['MUI: `<DataGrid pagination={false} />` is not a valid prop.', 'Infinite scrolling is not available in the MIT version.', '', 'You need to upgrade to DataGridPro or DataGridPremium component to disable the pagination.'].join('\n'));
    }
    return null;
  },
  /**
   * Pagination can be processed on the server or client-side.
   * Set it to 'client' if you would like to handle the pagination on the client-side.
   * Set it to 'server' if you would like to handle the pagination on the server-side.
   * @default "client"
   */
  paginationMode: _propTypes.default.oneOf(['client', 'server']),
  /**
   * The pagination model of type [[GridPaginationModel]] which refers to current `page` and `pageSize`.
   */
  paginationModel: _propTypes.default.shape({
    page: _propTypes.default.number.isRequired,
    pageSize: _propTypes.default.number.isRequired
  }),
  /**
   * Callback called before updating a row with new values in the row and cell editing.
   * @template R
   * @param {R} newRow Row object with the new values.
   * @param {R} oldRow Row object with the old values.
   * @returns {Promise<R> | R} The final values to update the row.
   */
  processRowUpdate: _propTypes.default.func,
  /**
   * Number of extra rows to be rendered before/after the visible slice.
   * @default 3
   */
  rowBuffer: _propTypes.default.number,
  /**
   * Set the total number of rows, if it is different from the length of the value `rows` prop.
   * If some rows have children (for instance in the tree data), this number represents the amount of top level rows.
   */
  rowCount: _propTypes.default.number,
  /**
   * Sets the height in pixel of a row in the grid.
   * @default 52
   */
  rowHeight: _propTypes.default.number,
  /**
   * Controls the modes of the rows.
   */
  rowModesModel: _propTypes.default.object,
  /**
   * Set of rows of type [[GridRowsProp]].
   */
  rows: _propTypes.default.arrayOf(_propTypes.default.object).isRequired,
  /**
   * If `false`, the row selection mode is disabled.
   * @default true
   */
  rowSelection: _propTypes.default.bool,
  /**
   * Sets the row selection model of the grid.
   */
  rowSelectionModel: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired), _propTypes.default.number, _propTypes.default.string]),
  /**
   * Sets the type of space between rows added by `getRowSpacing`.
   * @default "margin"
   */
  rowSpacingType: _propTypes.default.oneOf(['border', 'margin']),
  /**
   * Number of rows from the `rowBuffer` that can be visible before a new slice is rendered.
   * @default 3
   */
  rowThreshold: _propTypes.default.number,
  /**
   * Override the height/width of the grid inner scrollbar.
   */
  scrollbarSize: _propTypes.default.number,
  /**
   * If `true`, the vertical borders of the cells are displayed.
   * @default false
   */
  showCellVerticalBorder: _propTypes.default.bool,
  /**
   * If `true`, the right border of the column headers are displayed.
   * @default false
   */
  showColumnVerticalBorder: _propTypes.default.bool,
  /**
   * Overridable components props dynamically passed to the component at rendering.
   */
  slotProps: _propTypes.default.object,
  /**
   * Overridable components.
   */
  slots: _propTypes.default.object,
  /**
   * Sorting can be processed on the server or client-side.
   * Set it to 'client' if you would like to handle sorting on the client-side.
   * Set it to 'server' if you would like to handle sorting on the server-side.
   * @default "client"
   */
  sortingMode: _propTypes.default.oneOf(['client', 'server']),
  /**
   * The order of the sorting sequence.
   * @default ['asc', 'desc', null]
   */
  sortingOrder: _propTypes.default.arrayOf(_propTypes.default.oneOf(['asc', 'desc'])),
  /**
   * Set the sort model of the grid.
   */
  sortModel: _propTypes.default.arrayOf(_propTypes.default.shape({
    field: _propTypes.default.string.isRequired,
    sort: _propTypes.default.oneOf(['asc', 'desc'])
  })),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object])
};