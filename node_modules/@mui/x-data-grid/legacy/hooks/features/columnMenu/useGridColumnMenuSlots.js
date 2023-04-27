import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["displayOrder"];
import * as React from 'react';
import Divider from '@mui/material/Divider';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
var useGridColumnMenuSlots = function useGridColumnMenuSlots(props) {
  var apiRef = useGridPrivateApiContext();
  var defaultSlots = props.defaultSlots,
    defaultSlotProps = props.defaultSlotProps,
    _props$slots = props.slots,
    slots = _props$slots === void 0 ? {} : _props$slots,
    _props$slotProps = props.slotProps,
    slotProps = _props$slotProps === void 0 ? {} : _props$slotProps,
    hideMenu = props.hideMenu,
    colDef = props.colDef,
    _props$addDividers = props.addDividers,
    addDividers = _props$addDividers === void 0 ? true : _props$addDividers;
  var processedComponents = React.useMemo(function () {
    return _extends({}, defaultSlots, slots);
  }, [defaultSlots, slots]);
  var processedSlotProps = React.useMemo(function () {
    if (!slotProps || Object.keys(slotProps).length === 0) {
      return defaultSlotProps;
    }
    var mergedProps = _extends({}, slotProps);
    Object.entries(defaultSlotProps).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        currentSlotProps = _ref2[1];
      mergedProps[key] = _extends({}, currentSlotProps, slotProps[key] || {});
    });
    return mergedProps;
  }, [defaultSlotProps, slotProps]);
  var defaultItems = apiRef.current.unstable_applyPipeProcessors('columnMenu', [], props.colDef);
  var userItems = React.useMemo(function () {
    var defaultComponentKeys = Object.keys(defaultSlots);
    return Object.keys(slots).filter(function (key) {
      return !defaultComponentKeys.includes(key);
    });
  }, [slots, defaultSlots]);
  return React.useMemo(function () {
    var uniqueItems = Array.from(new Set([].concat(_toConsumableArray(defaultItems), _toConsumableArray(userItems))));
    var cleansedItems = uniqueItems.filter(function (key) {
      return processedComponents[key] != null;
    });
    var sorted = cleansedItems.sort(function (a, b) {
      var leftItemProps = processedSlotProps[a];
      var rightItemProps = processedSlotProps[b];
      var leftDisplayOrder = Number.isFinite(leftItemProps == null ? void 0 : leftItemProps.displayOrder) ? leftItemProps.displayOrder : 100;
      var rightDisplayOrder = Number.isFinite(rightItemProps == null ? void 0 : rightItemProps.displayOrder) ? rightItemProps.displayOrder : 100;
      return leftDisplayOrder - rightDisplayOrder;
    });
    return sorted.reduce(function (acc, key, index) {
      var itemProps = {
        colDef: colDef,
        onClick: hideMenu
      };
      var processedComponentProps = processedSlotProps[key];
      if (processedComponentProps) {
        var displayOrder = processedComponentProps.displayOrder,
          customProps = _objectWithoutProperties(processedComponentProps, _excluded);
        itemProps = _extends({}, itemProps, customProps);
      }
      return addDividers && index !== sorted.length - 1 ? [].concat(_toConsumableArray(acc), [[processedComponents[key], itemProps], [Divider, {}]]) : [].concat(_toConsumableArray(acc), [[processedComponents[key], itemProps]]);
    }, []);
  }, [addDividers, colDef, defaultItems, hideMenu, processedComponents, processedSlotProps, userItems]);
};
export { useGridColumnMenuSlots };