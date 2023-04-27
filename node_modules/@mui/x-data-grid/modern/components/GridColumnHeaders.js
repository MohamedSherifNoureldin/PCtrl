import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["innerRef", "className", "visibleColumns", "sortColumnLookup", "filterColumnLookup", "columnPositions", "columnHeaderTabIndexState", "columnGroupHeaderTabIndexState", "columnHeaderFocus", "columnGroupHeaderFocus", "densityFactor", "headerGroupingMaxDepth", "columnMenuState", "columnVisibility", "columnGroupsHeaderStructure", "hasOtherElementInTabSequence"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridColumnHeaders } from '../hooks/features/columnHeaders/useGridColumnHeaders';
import { GridScrollArea } from './GridScrollArea';
import { GridBaseColumnHeaders } from './columnHeaders/GridBaseColumnHeaders';
import { GridColumnHeadersInner } from './columnHeaders/GridColumnHeadersInner';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const GridColumnHeaders = /*#__PURE__*/React.forwardRef(function GridColumnsHeaders(props, ref) {
  const {
      innerRef,
      visibleColumns,
      sortColumnLookup,
      filterColumnLookup,
      columnPositions,
      columnHeaderTabIndexState,
      columnGroupHeaderTabIndexState,
      columnHeaderFocus,
      columnGroupHeaderFocus,
      densityFactor,
      headerGroupingMaxDepth,
      columnMenuState,
      columnVisibility,
      columnGroupsHeaderStructure,
      hasOtherElementInTabSequence
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const {
    isDragging,
    getRootProps,
    getInnerProps,
    getColumnHeaders,
    getColumnGroupHeaders
  } = useGridColumnHeaders({
    innerRef,
    visibleColumns,
    sortColumnLookup,
    filterColumnLookup,
    columnPositions,
    columnHeaderTabIndexState,
    columnGroupHeaderTabIndexState,
    columnHeaderFocus,
    columnGroupHeaderFocus,
    densityFactor,
    headerGroupingMaxDepth,
    columnMenuState,
    columnVisibility,
    columnGroupsHeaderStructure,
    hasOtherElementInTabSequence
  });
  return /*#__PURE__*/_jsxs(GridBaseColumnHeaders, _extends({
    ref: ref
  }, getRootProps(other), {
    children: [/*#__PURE__*/_jsx(GridScrollArea, {
      scrollDirection: "left"
    }), /*#__PURE__*/_jsxs(GridColumnHeadersInner, _extends({
      isDragging: isDragging
    }, getInnerProps(), {
      children: [getColumnGroupHeaders(), getColumnHeaders()]
    })), /*#__PURE__*/_jsx(GridScrollArea, {
      scrollDirection: "right"
    })]
  }));
});
process.env.NODE_ENV !== "production" ? GridColumnHeaders.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  columnGroupHeaderFocus: PropTypes.shape({
    depth: PropTypes.number.isRequired,
    field: PropTypes.string.isRequired
  }),
  columnGroupHeaderTabIndexState: PropTypes.shape({
    depth: PropTypes.number.isRequired,
    field: PropTypes.string.isRequired
  }),
  columnGroupsHeaderStructure: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
    columnFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    groupId: PropTypes.string
  }))).isRequired,
  columnHeaderFocus: PropTypes.shape({
    field: PropTypes.string.isRequired
  }),
  columnHeaderTabIndexState: PropTypes.shape({
    field: PropTypes.string.isRequired
  }),
  columnMenuState: PropTypes.shape({
    field: PropTypes.string,
    open: PropTypes.bool.isRequired
  }).isRequired,
  columnPositions: PropTypes.arrayOf(PropTypes.number).isRequired,
  columnVisibility: PropTypes.object.isRequired,
  densityFactor: PropTypes.number.isRequired,
  filterColumnLookup: PropTypes.object.isRequired,
  hasOtherElementInTabSequence: PropTypes.bool.isRequired,
  headerGroupingMaxDepth: PropTypes.number.isRequired,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
    current: PropTypes.object
  })]),
  minColumnIndex: PropTypes.number,
  sortColumnLookup: PropTypes.object.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.object).isRequired
} : void 0;
export { GridColumnHeaders };