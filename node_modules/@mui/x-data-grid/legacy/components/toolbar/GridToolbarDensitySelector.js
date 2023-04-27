import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["onClick"];
import * as React from 'react';
import { unstable_useId as useId, unstable_useForkRef as useForkRef } from '@mui/utils';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { gridDensityValueSelector } from '../../hooks/features/density/densitySelector';
import { isHideMenuKey, isTabKey } from '../../utils/keyboardUtils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { GridMenu } from '../menu/GridMenu';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridClasses } from '../../constants/gridClasses';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
export var GridToolbarDensitySelector = /*#__PURE__*/React.forwardRef(function GridToolbarDensitySelector(props, ref) {
  var _rootProps$slotProps;
  var onClick = props.onClick,
    other = _objectWithoutProperties(props, _excluded);
  var apiRef = useGridApiContext();
  var rootProps = useGridRootProps();
  var densityValue = useGridSelector(apiRef, gridDensityValueSelector);
  var densityButtonId = useId();
  var densityMenuId = useId();
  var _React$useState = React.useState(false),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    open = _React$useState2[0],
    setOpen = _React$useState2[1];
  var buttonRef = React.useRef(null);
  var handleRef = useForkRef(ref, buttonRef);
  var densityOptions = [{
    icon: /*#__PURE__*/_jsx(rootProps.slots.densityCompactIcon, {}),
    label: apiRef.current.getLocaleText('toolbarDensityCompact'),
    value: 'compact'
  }, {
    icon: /*#__PURE__*/_jsx(rootProps.slots.densityStandardIcon, {}),
    label: apiRef.current.getLocaleText('toolbarDensityStandard'),
    value: 'standard'
  }, {
    icon: /*#__PURE__*/_jsx(rootProps.slots.densityComfortableIcon, {}),
    label: apiRef.current.getLocaleText('toolbarDensityComfortable'),
    value: 'comfortable'
  }];
  var startIcon = React.useMemo(function () {
    switch (densityValue) {
      case 'compact':
        return /*#__PURE__*/_jsx(rootProps.slots.densityCompactIcon, {});
      case 'comfortable':
        return /*#__PURE__*/_jsx(rootProps.slots.densityComfortableIcon, {});
      default:
        return /*#__PURE__*/_jsx(rootProps.slots.densityStandardIcon, {});
    }
  }, [densityValue, rootProps]);
  var handleDensitySelectorOpen = function handleDensitySelectorOpen(event) {
    setOpen(function (prevOpen) {
      return !prevOpen;
    });
    onClick == null ? void 0 : onClick(event);
  };
  var handleDensitySelectorClickAway = function handleDensitySelectorClickAway(event) {
    var _buttonRef$current;
    if (buttonRef.current === event.target || // if user clicked on the icon
    (_buttonRef$current = buttonRef.current) != null && _buttonRef$current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  var handleDensityUpdate = function handleDensityUpdate(newDensity) {
    apiRef.current.setDensity(newDensity);
    setOpen(false);
  };
  var handleListKeyDown = function handleListKeyDown(event) {
    if (isTabKey(event.key)) {
      event.preventDefault();
    }
    if (isHideMenuKey(event.key)) {
      setOpen(false);
    }
  };

  // Disable the button if the corresponding is disabled
  if (rootProps.disableDensitySelector) {
    return null;
  }
  var densityElements = densityOptions.map(function (option, index) {
    return /*#__PURE__*/_jsxs(MenuItem, {
      onClick: function onClick() {
        return handleDensityUpdate(option.value);
      },
      selected: option.value === densityValue,
      children: [/*#__PURE__*/_jsx(ListItemIcon, {
        children: option.icon
      }), option.label]
    }, index);
  });
  return /*#__PURE__*/_jsxs(React.Fragment, {
    children: [/*#__PURE__*/_jsx(rootProps.slots.baseButton, _extends({
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
    }, (_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.baseButton, {
      children: apiRef.current.getLocaleText('toolbarDensity')
    })), /*#__PURE__*/_jsx(GridMenu, {
      open: open,
      target: buttonRef.current,
      onClickAway: handleDensitySelectorClickAway,
      position: "bottom-start",
      children: /*#__PURE__*/_jsx(MenuList, {
        id: densityMenuId,
        className: gridClasses.menuList,
        "aria-labelledby": densityButtonId,
        onKeyDown: handleListKeyDown,
        autoFocusItem: open,
        children: densityElements
      })
    })]
  });
});