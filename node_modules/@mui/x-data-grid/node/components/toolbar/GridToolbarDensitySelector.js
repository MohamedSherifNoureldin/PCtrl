"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridToolbarDensitySelector = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _utils = require("@mui/utils");
var _MenuList = _interopRequireDefault(require("@mui/material/MenuList"));
var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));
var _ListItemIcon = _interopRequireDefault(require("@mui/material/ListItemIcon"));
var _densitySelector = require("../../hooks/features/density/densitySelector");
var _keyboardUtils = require("../../utils/keyboardUtils");
var _useGridApiContext = require("../../hooks/utils/useGridApiContext");
var _useGridSelector = require("../../hooks/utils/useGridSelector");
var _GridMenu = require("../menu/GridMenu");
var _useGridRootProps = require("../../hooks/utils/useGridRootProps");
var _gridClasses = require("../../constants/gridClasses");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["onClick"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const GridToolbarDensitySelector = /*#__PURE__*/React.forwardRef(function GridToolbarDensitySelector(props, ref) {
  const {
      onClick
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const densityValue = (0, _useGridSelector.useGridSelector)(apiRef, _densitySelector.gridDensityValueSelector);
  const densityButtonId = (0, _utils.unstable_useId)();
  const densityMenuId = (0, _utils.unstable_useId)();
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef(null);
  const handleRef = (0, _utils.unstable_useForkRef)(ref, buttonRef);
  const densityOptions = [{
    icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.densityCompactIcon, {}),
    label: apiRef.current.getLocaleText('toolbarDensityCompact'),
    value: 'compact'
  }, {
    icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.densityStandardIcon, {}),
    label: apiRef.current.getLocaleText('toolbarDensityStandard'),
    value: 'standard'
  }, {
    icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.densityComfortableIcon, {}),
    label: apiRef.current.getLocaleText('toolbarDensityComfortable'),
    value: 'comfortable'
  }];
  const startIcon = React.useMemo(() => {
    switch (densityValue) {
      case 'compact':
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.densityCompactIcon, {});
      case 'comfortable':
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.densityComfortableIcon, {});
      default:
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.densityStandardIcon, {});
    }
  }, [densityValue, rootProps]);
  const handleDensitySelectorOpen = event => {
    setOpen(prevOpen => !prevOpen);
    onClick?.(event);
  };
  const handleDensitySelectorClickAway = event => {
    if (buttonRef.current === event.target ||
    // if user clicked on the icon
    buttonRef.current?.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  const handleDensityUpdate = newDensity => {
    apiRef.current.setDensity(newDensity);
    setOpen(false);
  };
  const handleListKeyDown = event => {
    if ((0, _keyboardUtils.isTabKey)(event.key)) {
      event.preventDefault();
    }
    if ((0, _keyboardUtils.isHideMenuKey)(event.key)) {
      setOpen(false);
    }
  };

  // Disable the button if the corresponding is disabled
  if (rootProps.disableDensitySelector) {
    return null;
  }
  const densityElements = densityOptions.map((option, index) => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_MenuItem.default, {
    onClick: () => handleDensityUpdate(option.value),
    selected: option.value === densityValue,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ListItemIcon.default, {
      children: option.icon
    }), option.label]
  }, index));
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.baseButton, (0, _extends2.default)({
      ref: handleRef,
      size: "small",
      startIcon: startIcon,
      "aria-label": apiRef.current.getLocaleText('toolbarDensityLabel'),
      "aria-expanded": open ? 'true' : undefined,
      "aria-haspopup": "menu",
      "aria-controls": densityMenuId,
      id: densityButtonId
    }, other, {
      onClick: handleDensitySelectorOpen
    }, rootProps.slotProps?.baseButton, {
      children: apiRef.current.getLocaleText('toolbarDensity')
    })), /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridMenu.GridMenu, {
      open: open,
      target: buttonRef.current,
      onClickAway: handleDensitySelectorClickAway,
      position: "bottom-start",
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuList.default, {
        id: densityMenuId,
        className: _gridClasses.gridClasses.menuList,
        "aria-labelledby": densityButtonId,
        onKeyDown: handleListKeyDown,
        autoFocusItem: open,
        children: densityElements
      })
    })]
  });
});
exports.GridToolbarDensitySelector = GridToolbarDensitySelector;