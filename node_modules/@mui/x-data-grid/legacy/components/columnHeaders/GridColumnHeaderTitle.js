import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["className"];
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled } from '@mui/system';
import { isOverflown } from '../../utils/domUtils';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['columnHeaderTitle']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
var GridColumnHeaderTitleRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnHeaderTitle',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.columnHeaderTitle;
  }
})({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  fontWeight: 'var(--unstable_DataGrid-headWeight)'
});
var ColumnHeaderInnerTitle = /*#__PURE__*/React.forwardRef(function ColumnHeaderInnerTitle(props, ref) {
  var className = props.className,
    other = _objectWithoutProperties(props, _excluded);
  var rootProps = useGridRootProps();
  var classes = useUtilityClasses(rootProps);
  return /*#__PURE__*/_jsx(GridColumnHeaderTitleRoot, _extends({
    ref: ref,
    className: clsx(classes.root, className),
    ownerState: rootProps
  }, other));
});
// No React.memo here as if we display the sort icon, we need to recalculate the isOver
function GridColumnHeaderTitle(props) {
  var _rootProps$slotProps;
  var label = props.label,
    description = props.description;
  var rootProps = useGridRootProps();
  var titleRef = React.useRef(null);
  var _React$useState = React.useState(''),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    tooltip = _React$useState2[0],
    setTooltip = _React$useState2[1];
  var handleMouseOver = React.useCallback(function () {
    if (!description && titleRef != null && titleRef.current) {
      var isOver = isOverflown(titleRef.current);
      if (isOver) {
        setTooltip(label);
      } else {
        setTooltip('');
      }
    }
  }, [description, label]);
  return /*#__PURE__*/_jsx(rootProps.slots.baseTooltip, _extends({
    title: description || tooltip
  }, (_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.baseTooltip, {
    children: /*#__PURE__*/_jsx(ColumnHeaderInnerTitle, {
      onMouseOver: handleMouseOver,
      ref: titleRef,
      children: label
    })
  }));
}
process.env.NODE_ENV !== "production" ? GridColumnHeaderTitle.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  columnWidth: PropTypes.number.isRequired,
  description: PropTypes.node,
  label: PropTypes.string.isRequired
} : void 0;
export { GridColumnHeaderTitle };