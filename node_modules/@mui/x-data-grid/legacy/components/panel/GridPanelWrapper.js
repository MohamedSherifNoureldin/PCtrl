import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["className", "slotProps"];
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import TrapFocus from '@mui/material/Unstable_TrapFocus';
import { styled } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['panelWrapper']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
var GridPanelWrapperRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PanelWrapper',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.panelWrapper;
  }
})({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  '&:focus': {
    outline: 0
  }
});
var isEnabled = function isEnabled() {
  return true;
};
var GridPanelWrapper = /*#__PURE__*/React.forwardRef(function GridPanelWrapper(props, ref) {
  var className = props.className,
    _props$slotProps = props.slotProps,
    slotProps = _props$slotProps === void 0 ? {} : _props$slotProps,
    other = _objectWithoutProperties(props, _excluded);
  var rootProps = useGridRootProps();
  var classes = useUtilityClasses(rootProps);
  return /*#__PURE__*/_jsx(TrapFocus, _extends({
    open: true,
    disableEnforceFocus: true,
    isEnabled: isEnabled
  }, slotProps.TrapFocus, {
    children: /*#__PURE__*/_jsx(GridPanelWrapperRoot, _extends({
      ref: ref,
      tabIndex: -1,
      className: clsx(className, classes.root),
      ownerState: rootProps
    }, other))
  }));
});
process.env.NODE_ENV !== "production" ? GridPanelWrapper.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  slotProps: PropTypes.object
} : void 0;
export { GridPanelWrapper };