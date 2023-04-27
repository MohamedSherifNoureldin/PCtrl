"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridToolbar = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _GridToolbarContainer = require("../containers/GridToolbarContainer");
var _GridToolbarColumnsButton = require("./GridToolbarColumnsButton");
var _GridToolbarDensitySelector = require("./GridToolbarDensitySelector");
var _GridToolbarFilterButton = require("./GridToolbarFilterButton");
var _GridToolbarExport = require("./GridToolbarExport");
var _useGridRootProps = require("../../hooks/utils/useGridRootProps");
var _GridToolbarQuickFilter = require("./GridToolbarQuickFilter");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["className", "csvOptions", "printOptions", "excelOptions", "showQuickFilter", "quickFilterProps"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const GridToolbar = /*#__PURE__*/React.forwardRef(function GridToolbar(props, ref) {
  // TODO v6: think about where export option should be passed.
  // from componentProps={{ toolbarExport: { ...exportOption} }} seems to be more appropriate
  const {
      csvOptions,
      printOptions,
      excelOptions,
      showQuickFilter = false,
      quickFilterProps = {}
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  if (rootProps.disableColumnFilter && rootProps.disableColumnSelector && rootProps.disableDensitySelector && !showQuickFilter) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GridToolbarContainer.GridToolbarContainer, (0, _extends2.default)({
    ref: ref
  }, other, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_GridToolbarColumnsButton.GridToolbarColumnsButton, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridToolbarFilterButton.GridToolbarFilterButton, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridToolbarDensitySelector.GridToolbarDensitySelector, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridToolbarExport.GridToolbarExport, {
      csvOptions: csvOptions,
      printOptions: printOptions
      // TODO: remove the reference to excelOptions in community package
      ,
      excelOptions: excelOptions
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Box.default, {
      sx: {
        flex: 1
      }
    }), showQuickFilter && /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridToolbarQuickFilter.GridToolbarQuickFilter, (0, _extends2.default)({}, quickFilterProps))]
  }));
});
exports.GridToolbar = GridToolbar;
process.env.NODE_ENV !== "production" ? GridToolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Props passed to the quick filter component.
   */
  quickFilterProps: _propTypes.default.object,
  /**
   * Show the quick filter component.
   * @default false
   */
  showQuickFilter: _propTypes.default.bool,
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object])
} : void 0;