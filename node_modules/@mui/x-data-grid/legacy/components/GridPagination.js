import _extends from "@babel/runtime/helpers/esm/extends";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as React from 'react';
import TablePagination, { tablePaginationClasses } from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { gridFilteredTopLevelRowCountSelector } from '../hooks/features/filter';
import { gridPaginationModelSelector } from '../hooks/features/pagination/gridPaginationSelector';
import { jsx as _jsx } from "react/jsx-runtime";
var GridPaginationRoot = styled(TablePagination)(function (_ref) {
  var _ref2;
  var theme = _ref.theme;
  return _ref2 = {}, _defineProperty(_ref2, "& .".concat(tablePaginationClasses.selectLabel), _defineProperty({
    display: 'none'
  }, theme.breakpoints.up('sm'), {
    display: 'block'
  })), _defineProperty(_ref2, "& .".concat(tablePaginationClasses.input), _defineProperty({
    display: 'none'
  }, theme.breakpoints.up('sm'), {
    display: 'inline-flex'
  })), _ref2;
});
export var GridPagination = /*#__PURE__*/React.forwardRef(function GridPagination(props, ref) {
  var _rootProps$pageSizeOp;
  var apiRef = useGridApiContext();
  var rootProps = useGridRootProps();
  var paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  var visibleTopLevelRowCount = useGridSelector(apiRef, gridFilteredTopLevelRowCountSelector);
  var rowCount = React.useMemo(function () {
    var _ref3, _rootProps$rowCount;
    return (_ref3 = (_rootProps$rowCount = rootProps.rowCount) != null ? _rootProps$rowCount : visibleTopLevelRowCount) != null ? _ref3 : 0;
  }, [rootProps.rowCount, visibleTopLevelRowCount]);
  var lastPage = React.useMemo(function () {
    return Math.floor(rowCount / (paginationModel.pageSize || 1));
  }, [rowCount, paginationModel.pageSize]);
  var handlePageSizeChange = React.useCallback(function (event) {
    var pageSize = Number(event.target.value);
    apiRef.current.setPageSize(pageSize);
  }, [apiRef]);
  var handlePageChange = React.useCallback(function (_, page) {
    apiRef.current.setPage(page);
  }, [apiRef]);
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var warnedOnceMissingInPageSizeOptions = React.useRef(false);
    if (!warnedOnceMissingInPageSizeOptions.current && !rootProps.autoPageSize && !rootProps.pageSizeOptions.includes(paginationModel.pageSize)) {
      console.warn(["MUI: The page size `".concat(paginationModel.pageSize, "` is not preset in the `pageSizeOptions`"), "Add it to show the pagination select."].join('\n'));
      warnedOnceMissingInPageSizeOptions.current = true;
    }
  }
  return /*#__PURE__*/_jsx(GridPaginationRoot, _extends({
    ref: ref,
    component: "div",
    count: rowCount,
    page: paginationModel.page <= lastPage ? paginationModel.page : lastPage,
    rowsPerPageOptions: (_rootProps$pageSizeOp = rootProps.pageSizeOptions) != null && _rootProps$pageSizeOp.includes(paginationModel.pageSize) ? rootProps.pageSizeOptions : [],
    rowsPerPage: paginationModel.pageSize,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handlePageSizeChange
  }, apiRef.current.getLocaleText('MuiTablePagination'), props));
});