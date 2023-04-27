import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["className", "style"];
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { jsx as _jsx } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes,
    overflowedContent = ownerState.overflowedContent;
  var slots = {
    root: ['virtualScrollerContent', overflowedContent && 'virtualScrollerContent--overflowed']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
var VirtualScrollerContentRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'VirtualScrollerContent',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.virtualScrollerContent;
  }
})({});
var GridVirtualScrollerContent = /*#__PURE__*/React.forwardRef(function GridVirtualScrollerContent(props, ref) {
  var className = props.className,
    style = props.style,
    other = _objectWithoutProperties(props, _excluded);
  var rootProps = useGridRootProps();
  var ownerState = _extends({}, rootProps, {
    overflowedContent: !rootProps.autoHeight && (style == null ? void 0 : style.minHeight) === 'auto'
  });
  var classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/_jsx(VirtualScrollerContentRoot, _extends({
    ref: ref,
    className: clsx(classes.root, className),
    ownerState: ownerState,
    style: style
  }, other));
});
export { GridVirtualScrollerContent };