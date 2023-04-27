"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridPagination = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _TablePagination = _interopRequireWildcard(require("@mui/material/TablePagination"));
var _styles = require("@mui/material/styles");
var _useGridSelector = require("../hooks/utils/useGridSelector");
var _useGridApiContext = require("../hooks/utils/useGridApiContext");
var _useGridRootProps = require("../hooks/utils/useGridRootProps");
var _filter = require("../hooks/features/filter");
var _gridPaginationSelector = require("../hooks/features/pagination/gridPaginationSelector");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const GridPaginationRoot = (0, _styles.styled)(_TablePagination.default)(({
  theme
}) => ({
  [`& .${_TablePagination.tablePaginationClasses.selectLabel}`]: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  [`& .${_TablePagination.tablePaginationClasses.input}`]: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'inline-flex'
    }
  }
}));
const GridPagination = /*#__PURE__*/React.forwardRef(function GridPagination(props, ref) {
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const paginationModel = (0, _useGridSelector.useGridSelector)(apiRef, _gridPaginationSelector.gridPaginationModelSelector);
  const visibleTopLevelRowCount = (0, _useGridSelector.useGridSelector)(apiRef, _filter.gridFilteredTopLevelRowCountSelector);
  const rowCount = React.useMemo(() => rootProps.rowCount ?? visibleTopLevelRowCount ?? 0, [rootProps.rowCount, visibleTopLevelRowCount]);
  const lastPage = React.useMemo(() => Math.floor(rowCount / (paginationModel.pageSize || 1)), [rowCount, paginationModel.pageSize]);
  const handlePageSizeChange = React.useCallback(event => {
    const pageSize = Number(event.target.value);
    apiRef.current.setPageSize(pageSize);
  }, [apiRef]);
  const handlePageChange = React.useCallback((_, page) => {
    apiRef.current.setPage(page);
  }, [apiRef]);
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const warnedOnceMissingInPageSizeOptions = React.useRef(false);
    if (!warnedOnceMissingInPageSizeOptions.current && !rootProps.autoPageSize && !rootProps.pageSizeOptions.includes(paginationModel.pageSize)) {
      console.warn([`MUI: The page size \`${paginationModel.pageSize}\` is not preset in the \`pageSizeOptions\``, `Add it to show the pagination select.`].join('\n'));
      warnedOnceMissingInPageSizeOptions.current = true;
    }
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(GridPaginationRoot, (0, _extends2.default)({
    ref: ref,
    component: "div",
    count: rowCount,
    page: paginationModel.page <= lastPage ? paginationModel.page : lastPage,
    rowsPerPageOptions: rootProps.pageSizeOptions?.includes(paginationModel.pageSize) ? rootProps.pageSizeOptions : [],
    rowsPerPage: paginationModel.pageSize,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handlePageSizeChange
  }, apiRef.current.getLocaleText('MuiTablePagination'), props));
});
exports.GridPagination = GridPagination;