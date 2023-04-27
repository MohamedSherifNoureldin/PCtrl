import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useGridSelector } from '../../../../hooks/utils/useGridSelector';
import { gridSortModelSelector } from '../../../../hooks/features/sorting/gridSortingSelector';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
function GridColumnMenuSortItem(props) {
  var _colDef$sortingOrder;
  var colDef = props.colDef,
    onClick = props.onClick;
  var apiRef = useGridApiContext();
  var sortModel = useGridSelector(apiRef, gridSortModelSelector);
  var rootProps = useGridRootProps();
  var sortDirection = React.useMemo(function () {
    if (!colDef) {
      return null;
    }
    var sortItem = sortModel.find(function (item) {
      return item.field === colDef.field;
    });
    return sortItem == null ? void 0 : sortItem.sort;
  }, [colDef, sortModel]);
  var sortingOrder = (_colDef$sortingOrder = colDef.sortingOrder) != null ? _colDef$sortingOrder : rootProps.sortingOrder;
  var onSortMenuItemClick = React.useCallback(function (event) {
    onClick(event);
    var direction = event.currentTarget.getAttribute('data-value') || null;
    apiRef.current.sortColumn(colDef, direction === sortDirection ? null : direction);
  }, [apiRef, colDef, onClick, sortDirection]);
  if (!colDef || !colDef.sortable || !sortingOrder.some(function (item) {
    return !!item;
  })) {
    return null;
  }
  return /*#__PURE__*/_jsxs(React.Fragment, {
    children: [sortingOrder.includes('asc') && sortDirection !== 'asc' ? /*#__PURE__*/_jsxs(MenuItem, {
      onClick: onSortMenuItemClick,
      "data-value": "asc",
      children: [/*#__PURE__*/_jsx(ListItemIcon, {
        children: /*#__PURE__*/_jsx(rootProps.slots.columnMenuSortAscendingIcon, {
          fontSize: "small"
        })
      }), /*#__PURE__*/_jsx(ListItemText, {
        children: apiRef.current.getLocaleText('columnMenuSortAsc')
      })]
    }) : null, sortingOrder.includes('desc') && sortDirection !== 'desc' ? /*#__PURE__*/_jsxs(MenuItem, {
      onClick: onSortMenuItemClick,
      "data-value": "desc",
      children: [/*#__PURE__*/_jsx(ListItemIcon, {
        children: /*#__PURE__*/_jsx(rootProps.slots.columnMenuSortDescendingIcon, {
          fontSize: "small"
        })
      }), /*#__PURE__*/_jsx(ListItemText, {
        children: apiRef.current.getLocaleText('columnMenuSortDesc')
      })]
    }) : null, sortingOrder.includes(null) && sortDirection != null ? /*#__PURE__*/_jsxs(MenuItem, {
      onClick: onSortMenuItemClick,
      children: [/*#__PURE__*/_jsx(ListItemIcon, {}), /*#__PURE__*/_jsx(ListItemText, {
        children: apiRef.current.getLocaleText('columnMenuUnsort')
      })]
    }) : null]
  });
}
process.env.NODE_ENV !== "production" ? GridColumnMenuSortItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
} : void 0;
export { GridColumnMenuSortItem };