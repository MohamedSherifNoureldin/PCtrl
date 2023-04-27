"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridPreferencesPanel = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _gridColumnsSelector = require("../../hooks/features/columns/gridColumnsSelector");
var _useGridSelector = require("../../hooks/utils/useGridSelector");
var _gridPreferencePanelSelector = require("../../hooks/features/preferencesPanel/gridPreferencePanelSelector");
var _gridPreferencePanelsValue = require("../../hooks/features/preferencesPanel/gridPreferencePanelsValue");
var _useGridApiContext = require("../../hooks/utils/useGridApiContext");
var _useGridRootProps = require("../../hooks/utils/useGridRootProps");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const GridPreferencesPanel = /*#__PURE__*/React.forwardRef(function GridPreferencesPanel(props, ref) {
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const columns = (0, _useGridSelector.useGridSelector)(apiRef, _gridColumnsSelector.gridColumnDefinitionsSelector);
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const preferencePanelState = (0, _useGridSelector.useGridSelector)(apiRef, _gridPreferencePanelSelector.gridPreferencePanelStateSelector);
  const panelContent = apiRef.current.unstable_applyPipeProcessors('preferencePanel', null, preferencePanelState.openedPanelValue ?? _gridPreferencePanelsValue.GridPreferencePanelsValue.filters);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.panel, (0, _extends2.default)({
    ref: ref,
    as: rootProps.slots.basePopper,
    open: columns.length > 0 && preferencePanelState.open
  }, rootProps.slotProps?.panel, props, rootProps.slotProps?.basePopper, {
    children: panelContent
  }));
});
exports.GridPreferencesPanel = GridPreferencesPanel;