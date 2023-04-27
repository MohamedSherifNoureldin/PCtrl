"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridColumnHeaderFilterIconButton = GridColumnHeaderFilterIconButton;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _utils = require("@mui/utils");
var _Badge = _interopRequireDefault(require("@mui/material/Badge"));
var _gridPreferencePanelSelector = require("../../hooks/features/preferencesPanel/gridPreferencePanelSelector");
var _gridPreferencePanelsValue = require("../../hooks/features/preferencesPanel/gridPreferencePanelsValue");
var _useGridApiContext = require("../../hooks/utils/useGridApiContext");
var _gridClasses = require("../../constants/gridClasses");
var _useGridRootProps = require("../../hooks/utils/useGridRootProps");
var _GridIconButtonContainer = require("./GridIconButtonContainer");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    icon: ['filterIcon']
  };
  return (0, _utils.unstable_composeClasses)(slots, _gridClasses.getDataGridUtilityClass, classes);
};
function GridColumnHeaderFilterIconButton(props) {
  const {
    counter,
    field,
    onClick
  } = props;
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const ownerState = (0, _extends2.default)({}, props, {
    classes: rootProps.classes
  });
  const classes = useUtilityClasses(ownerState);
  const toggleFilter = React.useCallback(event => {
    event.preventDefault();
    event.stopPropagation();
    const {
      open,
      openedPanelValue
    } = (0, _gridPreferencePanelSelector.gridPreferencePanelStateSelector)(apiRef.current.state);
    if (open && openedPanelValue === _gridPreferencePanelsValue.GridPreferencePanelsValue.filters) {
      apiRef.current.hideFilterPanel();
    } else {
      apiRef.current.showFilterPanel();
    }
    if (onClick) {
      onClick(apiRef.current.getColumnHeaderParams(field), event);
    }
  }, [apiRef, field, onClick]);
  if (!counter) {
    return null;
  }
  const iconButton = /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.baseIconButton, (0, _extends2.default)({
    onClick: toggleFilter,
    color: "default",
    "aria-label": apiRef.current.getLocaleText('columnHeaderFiltersLabel'),
    size: "small",
    tabIndex: -1
  }, rootProps.slotProps?.baseIconButton, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.columnFilteredIcon, {
      className: classes.icon,
      fontSize: "small"
    })
  }));
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.baseTooltip, (0, _extends2.default)({
    title: apiRef.current.getLocaleText('columnHeaderFiltersTooltipActive')(counter),
    enterDelay: 1000
  }, rootProps.slotProps?.baseTooltip, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GridIconButtonContainer.GridIconButtonContainer, {
      children: [counter > 1 && /*#__PURE__*/(0, _jsxRuntime.jsx)(_Badge.default, {
        badgeContent: counter,
        color: "default",
        children: iconButton
      }), counter === 1 && iconButton]
    })
  }));
}
process.env.NODE_ENV !== "production" ? GridColumnHeaderFilterIconButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  counter: _propTypes.default.number,
  field: _propTypes.default.string.isRequired,
  onClick: _propTypes.default.func
} : void 0;