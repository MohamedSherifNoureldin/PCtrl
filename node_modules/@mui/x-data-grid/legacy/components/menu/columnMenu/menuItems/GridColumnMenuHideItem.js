import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';
import { gridVisibleColumnDefinitionsSelector } from '../../../../hooks/features/columns';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
function GridColumnMenuHideItem(props) {
  var colDef = props.colDef,
    onClick = props.onClick;
  var apiRef = useGridApiContext();
  var rootProps = useGridRootProps();
  var visibleColumns = gridVisibleColumnDefinitionsSelector(apiRef);
  var columnsWithMenu = visibleColumns.filter(function (col) {
    return col.disableColumnMenu !== true;
  });
  // do not allow to hide the last column with menu
  var disabled = columnsWithMenu.length === 1;
  var toggleColumn = React.useCallback(function (event) {
    /**
     * Disabled `MenuItem` would trigger `click` event
     * after imperative `.click()` call on HTML element.
     * Also, click is triggered in testing environment as well.
     */
    if (disabled) {
      return;
    }
    apiRef.current.setColumnVisibility(colDef.field, false);
    onClick(event);
  }, [apiRef, colDef.field, onClick, disabled]);
  if (rootProps.disableColumnSelector) {
    return null;
  }
  if (colDef.hideable === false) {
    return null;
  }
  return /*#__PURE__*/_jsxs(MenuItem, {
    onClick: toggleColumn,
    disabled: disabled,
    children: [/*#__PURE__*/_jsx(ListItemIcon, {
      children: /*#__PURE__*/_jsx(rootProps.slots.columnMenuHideIcon, {
        fontSize: "small"
      })
    }), /*#__PURE__*/_jsx(ListItemText, {
      children: apiRef.current.getLocaleText('columnMenuHideColumn')
    })]
  });
}
process.env.NODE_ENV !== "production" ? GridColumnMenuHideItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
} : void 0;
export { GridColumnMenuHideItem };