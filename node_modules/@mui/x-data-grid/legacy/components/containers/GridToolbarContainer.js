import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["className", "children"];
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/system';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['toolbarContainer']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
var GridToolbarContainerRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ToolbarContainer',
  overridesResolver: function overridesResolver(_, styles) {
    return styles.toolbarContainer;
  }
})(function (_ref) {
  var theme = _ref.theme;
  return {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    padding: theme.spacing(0.5, 0.5, 0)
  };
});
var GridToolbarContainer = /*#__PURE__*/React.forwardRef(function GridToolbarContainer(props, ref) {
  var className = props.className,
    children = props.children,
    other = _objectWithoutProperties(props, _excluded);
  var rootProps = useGridRootProps();
  var classes = useUtilityClasses(rootProps);
  if (!children) {
    return null;
  }
  return /*#__PURE__*/_jsx(GridToolbarContainerRoot, _extends({
    ref: ref,
    className: clsx(className, classes.root),
    ownerState: rootProps
  }, other, {
    children: children
  }));
});
process.env.NODE_ENV !== "production" ? GridToolbarContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;
export { GridToolbarContainer };