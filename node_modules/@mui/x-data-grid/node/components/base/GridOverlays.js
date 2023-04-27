"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridOverlays = GridOverlays;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _system = require("@mui/system");
var _utils = require("@mui/utils");
var _clsx = _interopRequireDefault(require("clsx"));
var _useGridSelector = require("../../hooks/utils/useGridSelector");
var _gridFilterSelector = require("../../hooks/features/filter/gridFilterSelector");
var _gridRowsSelector = require("../../hooks/features/rows/gridRowsSelector");
var _useGridApiContext = require("../../hooks/utils/useGridApiContext");
var _useGridRootProps = require("../../hooks/utils/useGridRootProps");
var _gridRowsUtils = require("../../hooks/features/rows/gridRowsUtils");
var _gridClasses = require("../../constants/gridClasses");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const GridOverlayWrapperRoot = (0, _system.styled)('div', {
  name: 'MuiDataGrid',
  slot: 'OverlayWrapper',
  overridesResolver: (props, styles) => styles.overlayWrapper
})({
  position: 'sticky',
  // To stay in place while scrolling
  top: 0,
  left: 0,
  width: 0,
  // To stay above the content instead of shifting it down
  height: 0,
  // To stay above the content instead of shifting it down
  zIndex: 4 // Should be above pinned columns, pinned rows and detail panel
});

const GridOverlayWrapperInner = (0, _system.styled)('div', {
  name: 'MuiDataGrid',
  slot: 'OverlayWrapperInner',
  overridesResolver: (props, styles) => styles.overlayWrapperInner
})({});
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['overlayWrapper'],
    inner: ['overlayWrapperInner']
  };
  return (0, _utils.unstable_composeClasses)(slots, _gridClasses.getDataGridUtilityClass, classes);
};
function GridOverlayWrapper(props) {
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const [viewportInnerSize, setViewportInnerSize] = React.useState(() => apiRef.current.getRootDimensions()?.viewportInnerSize ?? null);
  const handleViewportSizeChange = React.useCallback(() => {
    setViewportInnerSize(apiRef.current.getRootDimensions()?.viewportInnerSize ?? null);
  }, [apiRef]);
  (0, _utils.unstable_useEnhancedEffect)(() => {
    return apiRef.current.subscribeEvent('viewportInnerSizeChange', handleViewportSizeChange);
  }, [apiRef, handleViewportSizeChange]);
  let height = viewportInnerSize?.height ?? 0;
  if (rootProps.autoHeight && height === 0) {
    height = (0, _gridRowsUtils.getMinimalContentHeight)(apiRef, rootProps.rowHeight); // Give room to show the overlay when there no rows.
  }

  const classes = useUtilityClasses((0, _extends2.default)({}, props, {
    classes: rootProps.classes
  }));
  if (!viewportInnerSize) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(GridOverlayWrapperRoot, {
    className: (0, _clsx.default)(classes.root),
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(GridOverlayWrapperInner, (0, _extends2.default)({
      className: (0, _clsx.default)(classes.inner),
      style: {
        height,
        width: viewportInnerSize?.width ?? 0
      }
    }, props))
  });
}
function GridOverlays() {
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const totalRowCount = (0, _useGridSelector.useGridSelector)(apiRef, _gridRowsSelector.gridRowCountSelector);
  const visibleRowCount = (0, _useGridSelector.useGridSelector)(apiRef, _gridFilterSelector.gridExpandedRowCountSelector);
  const loading = (0, _useGridSelector.useGridSelector)(apiRef, _gridRowsSelector.gridRowsLoadingSelector);
  const showNoRowsOverlay = !loading && totalRowCount === 0;
  const showNoResultsOverlay = !loading && totalRowCount > 0 && visibleRowCount === 0;
  let overlay = null;
  if (showNoRowsOverlay) {
    overlay = /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.noRowsOverlay, (0, _extends2.default)({}, rootProps.slotProps?.noRowsOverlay));
  }
  if (showNoResultsOverlay) {
    overlay = /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.noResultsOverlay, (0, _extends2.default)({}, rootProps.slotProps?.noResultsOverlay));
  }
  if (loading) {
    overlay = /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.loadingOverlay, (0, _extends2.default)({}, rootProps.slotProps?.loadingOverlay));
  }
  if (overlay === null) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(GridOverlayWrapper, {
    children: overlay
  });
}