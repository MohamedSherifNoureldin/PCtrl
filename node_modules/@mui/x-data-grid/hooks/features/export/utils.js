import { gridColumnDefinitionsSelector, gridVisibleColumnDefinitionsSelector } from '../columns';
import { gridFilteredSortedRowIdsSelector } from '../filter';
import { gridPinnedRowsSelector, gridRowTreeSelector } from '../rows/gridRowsSelector';
export const getColumnsToExport = ({
  apiRef,
  options
}) => {
  const columns = gridColumnDefinitionsSelector(apiRef);
  if (options.fields) {
    return options.fields.map(field => columns.find(column => column.field === field)).filter(column => !!column);
  }
  const validColumns = options.allColumns ? columns : gridVisibleColumnDefinitionsSelector(apiRef);
  return validColumns.filter(column => !column.disableExport);
};
export const defaultGetRowsToExport = ({
  apiRef
}) => {
  var _pinnedRows$top, _pinnedRows$bottom;
  const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
  const rowTree = gridRowTreeSelector(apiRef);
  const selectedRows = apiRef.current.getSelectedRows();
  const bodyRows = filteredSortedRowIds.filter(id => rowTree[id].type !== 'footer');
  const pinnedRows = gridPinnedRowsSelector(apiRef);
  const topPinnedRowsIds = (pinnedRows == null ? void 0 : (_pinnedRows$top = pinnedRows.top) == null ? void 0 : _pinnedRows$top.map(row => row.id)) || [];
  const bottomPinnedRowsIds = (pinnedRows == null ? void 0 : (_pinnedRows$bottom = pinnedRows.bottom) == null ? void 0 : _pinnedRows$bottom.map(row => row.id)) || [];
  bodyRows.unshift(...topPinnedRowsIds);
  bodyRows.push(...bottomPinnedRowsIds);
  if (selectedRows.size > 0) {
    return bodyRows.filter(id => selectedRows.has(id));
  }
  return bodyRows;
};