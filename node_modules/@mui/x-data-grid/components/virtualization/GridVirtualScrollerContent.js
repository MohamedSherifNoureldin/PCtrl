import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["className", "style"];
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { jsx as _jsx } from "react/jsx-runtime";
const useUtilityClasses = ownerState => {
  const {
    classes,
    overflowedContent
  } = ownerState;
  const slots = {
    root: ['virtualScrollerContent', overflowedContent && 'virtualScrollerContent--overflowed']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
const VirtualScrollerContentRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'VirtualScrollerContent',
  overridesResolver: (props, styles) => styles.virtualScrollerContent
})({});
const GridVirtualScrollerContent = /*#__PURE__*/React.forwardRef(function GridVirtualScrollerContent(props, ref) {
  const {
      className,
      style
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const rootProps = useGridRootProps();
  const ownerState = _extends({}, rootProps, {
    overflowedContent: !rootProps.autoHeight && (style == null ? void 0 : style.minHeight) === 'auto'
  });
  const classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/_jsx(VirtualScrollerContentRoot, _extends({
    ref: ref,
    className: clsx(classes.root, className),
    ownerState: ownerState,
    style: style
  }, other));
});
export { GridVirtualScrollerContent };