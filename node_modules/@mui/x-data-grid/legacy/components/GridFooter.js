import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { gridTopLevelRowCountSelector } from '../hooks/features/rows/gridRowsSelector';
import { selectedGridRowsCountSelector } from '../hooks/features/rowSelection/gridRowSelectionSelector';
import { gridFilteredTopLevelRowCountSelector } from '../hooks/features/filter/gridFilterSelector';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridRowCount } from './GridRowCount';
import { GridSelectedRowCount } from './GridSelectedRowCount';
import { GridFooterContainer } from './containers/GridFooterContainer';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
var GridFooter = /*#__PURE__*/React.forwardRef(function GridFooter(props, ref) {
  var _rootProps$slotProps;
  var apiRef = useGridApiContext();
  var rootProps = useGridRootProps();
  var totalTopLevelRowCount = useGridSelector(apiRef, gridTopLevelRowCountSelector);
  var selectedRowCount = useGridSelector(apiRef, selectedGridRowsCountSelector);
  var visibleTopLevelRowCount = useGridSelector(apiRef, gridFilteredTopLevelRowCountSelector);
  var selectedRowCountElement = !rootProps.hideFooterSelectedRowCount && selectedRowCount > 0 ? /*#__PURE__*/_jsx(GridSelectedRowCount, {
    selectedRowCount: selectedRowCount
  }) : /*#__PURE__*/_jsx("div", {});
  var rowCountElement = !rootProps.hideFooterRowCount && !rootProps.pagination ? /*#__PURE__*/_jsx(GridRowCount, {
    rowCount: totalTopLevelRowCount,
    visibleRowCount: visibleTopLevelRowCount
  }) : null;
  var paginationElement = rootProps.pagination && !rootProps.hideFooterPagination && rootProps.slots.pagination && /*#__PURE__*/_jsx(rootProps.slots.pagination, _extends({}, (_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.pagination));
  return /*#__PURE__*/_jsxs(GridFooterContainer, _extends({
    ref: ref
  }, props, {
    children: [selectedRowCountElement, rowCountElement, paginationElement]
  }));
});
process.env.NODE_ENV !== "production" ? GridFooter.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;
export { GridFooter };