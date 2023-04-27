"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridColumnHeaders = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _useGridColumnHeaders = require("../hooks/features/columnHeaders/useGridColumnHeaders");
var _GridScrollArea = require("./GridScrollArea");
var _GridBaseColumnHeaders = require("./columnHeaders/GridBaseColumnHeaders");
var _GridColumnHeadersInner = require("./columnHeaders/GridColumnHeadersInner");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["innerRef", "className", "visibleColumns", "sortColumnLookup", "filterColumnLookup", "columnPositions", "columnHeaderTabIndexState", "columnGroupHeaderTabIndexState", "columnHeaderFocus", "columnGroupHeaderFocus", "densityFactor", "headerGroupingMaxDepth", "columnMenuState", "columnVisibility", "columnGroupsHeaderStructure", "hasOtherElementInTabSequence"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const GridColumnHeaders = /*#__PURE__*/React.forwardRef(function GridColumnsHeaders(props, ref) {
  const {
      innerRef,
      visibleColumns,
      sortColumnLookup,
      filterColumnLookup,
      columnPositions,
      columnHeaderTabIndexState,
      columnGroupHeaderTabIndexState,
      columnHeaderFocus,
      columnGroupHeaderFocus,
      densityFactor,
      headerGroupingMaxDepth,
      columnMenuState,
      columnVisibility,
      columnGroupsHeaderStructure,
      hasOtherElementInTabSequence
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const {
    isDragging,
    getRootProps,
    getInnerProps,
    getColumnHeaders,
    getColumnGroupHeaders
  } = (0, _useGridColumnHeaders.useGridColumnHeaders)({
    innerRef,
    visibleColumns,
    sortColumnLookup,
    filterColumnLookup,
    columnPositions,
    columnHeaderTabIndexState,
    columnGroupHeaderTabIndexState,
    columnHeaderFocus,
    columnGroupHeaderFocus,
    densityFactor,
    headerGroupingMaxDepth,
    columnMenuState,
    columnVisibility,
    columnGroupsHeaderStructure,
    hasOtherElementInTabSequence
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GridBaseColumnHeaders.GridBaseColumnHeaders, (0, _extends2.default)({
    ref: ref
  }, getRootProps(other), {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_GridScrollArea.GridScrollArea, {
      scrollDirection: "left"
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GridColumnHeadersInner.GridColumnHeadersInner, (0, _extends2.default)({
      isDragging: isDragging
    }, getInnerProps(), {
      children: [getColumnGroupHeaders(), getColumnHeaders()]
    })), /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridScrollArea.GridScrollArea, {
      scrollDirection: "right"
    })]
  }));
});
exports.GridColumnHeaders = GridColumnHeaders;
process.env.NODE_ENV !== "production" ? GridColumnHeaders.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  columnGroupHeaderFocus: _propTypes.default.shape({
    depth: _propTypes.default.number.isRequired,
    field: _propTypes.default.string.isRequired
  }),
  columnGroupHeaderTabIndexState: _propTypes.default.shape({
    depth: _propTypes.default.number.isRequired,
    field: _propTypes.default.string.isRequired
  }),
  columnGroupsHeaderStructure: _propTypes.default.arrayOf(_propTypes.default.arrayOf(_propTypes.default.shape({
    columnFields: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
    groupId: _propTypes.default.string
  }))).isRequired,
  columnHeaderFocus: _propTypes.default.shape({
    field: _propTypes.default.string.isRequired
  }),
  columnHeaderTabIndexState: _propTypes.default.shape({
    field: _propTypes.default.string.isRequired
  }),
  columnMenuState: _propTypes.default.shape({
    field: _propTypes.default.string,
    open: _propTypes.default.bool.isRequired
  }).isRequired,
  columnPositions: _propTypes.default.arrayOf(_propTypes.default.number).isRequired,
  columnVisibility: _propTypes.default.object.isRequired,
  densityFactor: _propTypes.default.number.isRequired,
  filterColumnLookup: _propTypes.default.object.isRequired,
  hasOtherElementInTabSequence: _propTypes.default.bool.isRequired,
  headerGroupingMaxDepth: _propTypes.default.number.isRequired,
  innerRef: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.shape({
    current: _propTypes.default.object
  })]),
  minColumnIndex: _propTypes.default.number,
  sortColumnLookup: _propTypes.default.object.isRequired,
  visibleColumns: _propTypes.default.arrayOf(_propTypes.default.object).isRequired
} : void 0;