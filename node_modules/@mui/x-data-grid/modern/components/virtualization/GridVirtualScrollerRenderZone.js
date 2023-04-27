import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["className"];
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { jsx as _jsx } from "react/jsx-runtime";
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['virtualScrollerRenderZone']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
const VirtualScrollerRenderZoneRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'VirtualScrollerRenderZone',
  overridesResolver: (props, styles) => styles.virtualScrollerRenderZone
})({
  position: 'absolute',
  display: 'flex',
  // Prevents margin collapsing when using `getRowSpacing`
  flexDirection: 'column'
});
const GridVirtualScrollerRenderZone = /*#__PURE__*/React.forwardRef(function GridVirtualScrollerRenderZone(props, ref) {
  const {
      className
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  return /*#__PURE__*/_jsx(VirtualScrollerRenderZoneRoot, _extends({
    ref: ref,
    className: clsx(classes.root, className),
    ownerState: rootProps
  }, other));
});
export { GridVirtualScrollerRenderZone };