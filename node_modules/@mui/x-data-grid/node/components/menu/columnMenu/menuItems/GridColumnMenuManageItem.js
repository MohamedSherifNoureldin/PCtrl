"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridColumnMenuManageItem = GridColumnMenuManageItem;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));
var _ListItemIcon = _interopRequireDefault(require("@mui/material/ListItemIcon"));
var _ListItemText = _interopRequireDefault(require("@mui/material/ListItemText"));
var _gridPreferencePanelsValue = require("../../../../hooks/features/preferencesPanel/gridPreferencePanelsValue");
var _useGridApiContext = require("../../../../hooks/utils/useGridApiContext");
var _useGridRootProps = require("../../../../hooks/utils/useGridRootProps");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function GridColumnMenuManageItem(props) {
  const {
    onClick
  } = props;
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const showColumns = React.useCallback(event => {
    onClick(event); // hide column menu
    apiRef.current.showPreferences(_gridPreferencePanelsValue.GridPreferencePanelsValue.columns);
  }, [apiRef, onClick]);
  if (rootProps.disableColumnSelector) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_MenuItem.default, {
    onClick: showColumns,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ListItemIcon.default, {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.columnMenuManageColumnsIcon, {
        fontSize: "small"
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ListItemText.default, {
      children: apiRef.current.getLocaleText('columnMenuManageColumns')
    })]
  });
}
process.env.NODE_ENV !== "production" ? GridColumnMenuManageItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: _propTypes.default.object.isRequired,
  onClick: _propTypes.default.func.isRequired
} : void 0;