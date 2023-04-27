import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["field", "align", "width", "contentWidth"];
import * as React from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';
import { unstable_composeClasses as composeClasses, unstable_capitalize as capitalize } from '@mui/utils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { jsx as _jsx } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var align = ownerState.align,
    classes = ownerState.classes;
  var slots = {
    root: ['cell', 'cellSkeleton', "cell--text".concat(capitalize(align)), 'withBorderColor']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridSkeletonCell(props) {
  var field = props.field,
    align = props.align,
    width = props.width,
    contentWidth = props.contentWidth,
    other = _objectWithoutProperties(props, _excluded);
  var rootProps = useGridRootProps();
  var ownerState = {
    classes: rootProps.classes,
    align: align
  };
  var classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/_jsx("div", _extends({
    className: classes.root,
    style: {
      width: width
    }
  }, other, {
    children: /*#__PURE__*/_jsx(Skeleton, {
      width: "".concat(contentWidth, "%")
    })
  }));
}
process.env.NODE_ENV !== "production" ? GridSkeletonCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  align: PropTypes.string.isRequired,
  contentWidth: PropTypes.number.isRequired,
  field: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired
} : void 0;
export { GridSkeletonCell };