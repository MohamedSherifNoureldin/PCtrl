import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["className"];
import * as React from 'react';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled } from '@mui/system';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['columnHeaders', 'withBorderColor']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
var GridColumnHeadersRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnHeaders',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.columnHeaders;
  }
})({
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  borderBottom: '1px solid',
  borderTopLeftRadius: 'var(--unstable_DataGrid-radius)',
  borderTopRightRadius: 'var(--unstable_DataGrid-radius)'
});
export var GridBaseColumnHeaders = /*#__PURE__*/React.forwardRef(function GridColumnHeaders(props, ref) {
  var className = props.className,
    other = _objectWithoutProperties(props, _excluded);
  var rootProps = useGridRootProps();
  var classes = useUtilityClasses(rootProps);
  return /*#__PURE__*/_jsx(GridColumnHeadersRoot, _extends({
    ref: ref,
    className: clsx(className, classes.root),
    ownerState: rootProps
  }, other));
});