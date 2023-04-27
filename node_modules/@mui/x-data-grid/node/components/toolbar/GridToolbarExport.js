"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridCsvExportMenuItem = GridCsvExportMenuItem;
exports.GridPrintExportMenuItem = GridPrintExportMenuItem;
exports.GridToolbarExport = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));
var _useGridApiContext = require("../../hooks/utils/useGridApiContext");
var _GridToolbarExportContainer = require("./GridToolbarExportContainer");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["hideMenu", "options"],
  _excluded2 = ["hideMenu", "options"],
  _excluded3 = ["csvOptions", "printOptions", "excelOptions"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function GridCsvExportMenuItem(props) {
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const {
      hideMenu,
      options
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuItem.default, (0, _extends2.default)({
    onClick: () => {
      apiRef.current.exportDataAsCsv(options);
      hideMenu?.();
    }
  }, other, {
    children: apiRef.current.getLocaleText('toolbarExportCSV')
  }));
}
function GridPrintExportMenuItem(props) {
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const {
      hideMenu,
      options
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded2);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuItem.default, (0, _extends2.default)({
    onClick: () => {
      apiRef.current.exportDataAsPrint(options);
      hideMenu?.();
    }
  }, other, {
    children: apiRef.current.getLocaleText('toolbarExportPrint')
  }));
}
const GridToolbarExport = /*#__PURE__*/React.forwardRef(function GridToolbarExport(props, ref) {
  const {
      csvOptions = {},
      printOptions = {},
      excelOptions
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded3);
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const preProcessedButtons = apiRef.current.unstable_applyPipeProcessors('exportMenu', [], {
    excelOptions,
    csvOptions,
    printOptions
  }).sort((a, b) => a.componentName > b.componentName ? 1 : -1);
  if (preProcessedButtons.length === 0) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridToolbarExportContainer.GridToolbarExportContainer, (0, _extends2.default)({}, other, {
    ref: ref,
    children: preProcessedButtons.map((button, index) => /*#__PURE__*/React.cloneElement(button.component, {
      key: index
    }))
  }));
});
exports.GridToolbarExport = GridToolbarExport;
process.env.NODE_ENV !== "production" ? GridToolbarExport.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  csvOptions: _propTypes.default.object,
  printOptions: _propTypes.default.object
} : void 0;