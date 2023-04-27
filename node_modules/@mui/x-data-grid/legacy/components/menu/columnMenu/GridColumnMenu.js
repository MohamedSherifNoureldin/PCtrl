import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["defaultSlots", "defaultSlotProps", "slots", "slotProps"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridColumnMenuSlots } from '../../../hooks/features/columnMenu/useGridColumnMenuSlots';
import { GridColumnMenuContainer } from './GridColumnMenuContainer';
import { GridColumnMenuColumnsItem } from './menuItems/GridColumnMenuColumnsItem';
import { GridColumnMenuFilterItem } from './menuItems/GridColumnMenuFilterItem';
import { GridColumnMenuSortItem } from './menuItems/GridColumnMenuSortItem';
import { jsx as _jsx } from "react/jsx-runtime";
export var GRID_COLUMN_MENU_SLOTS = {
  columnMenuSortItem: GridColumnMenuSortItem,
  columnMenuFilterItem: GridColumnMenuFilterItem,
  columnMenuColumnsItem: GridColumnMenuColumnsItem
};
export var GRID_COLUMN_MENU_SLOT_PROPS = {
  columnMenuSortItem: {
    displayOrder: 10
  },
  columnMenuFilterItem: {
    displayOrder: 20
  },
  columnMenuColumnsItem: {
    displayOrder: 30
  }
};
var GridGenericColumnMenu = /*#__PURE__*/React.forwardRef(function GridGenericColumnMenu(props, ref) {
  var defaultSlots = props.defaultSlots,
    defaultSlotProps = props.defaultSlotProps,
    slots = props.slots,
    slotProps = props.slotProps,
    other = _objectWithoutProperties(props, _excluded);
  var orderedSlots = useGridColumnMenuSlots(_extends({}, other, {
    defaultSlots: defaultSlots,
    defaultSlotProps: defaultSlotProps,
    slots: slots,
    slotProps: slotProps
  }));
  return /*#__PURE__*/_jsx(GridColumnMenuContainer, _extends({
    ref: ref
  }, other, {
    children: orderedSlots.map(function (_ref, index) {
      var _ref2 = _slicedToArray(_ref, 2),
        Component = _ref2[0],
        otherProps = _ref2[1];
      return /*#__PURE__*/_jsx(Component, _extends({}, otherProps), index);
    })
  }));
});
var GridColumnMenu = /*#__PURE__*/React.forwardRef(function GridColumnMenu(props, ref) {
  return /*#__PURE__*/_jsx(GridGenericColumnMenu, _extends({}, props, {
    ref: ref,
    defaultSlots: GRID_COLUMN_MENU_SLOTS,
    defaultSlotProps: GRID_COLUMN_MENU_SLOT_PROPS
  }));
});
process.env.NODE_ENV !== "production" ? GridColumnMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
  /**
   * Could be used to pass new props or override props specific to a column menu component
   * e.g. `displayOrder`
   */
  slotProps: PropTypes.object,
  /**
   * `slots` could be used to add new and (or) override default column menu items
   * If you register a nee component you must pass it's `displayOrder` in `slotProps`
   * or it will be placed in the end of the list
   */
  slots: PropTypes.object
} : void 0;
export { GridColumnMenu, GridGenericColumnMenu };