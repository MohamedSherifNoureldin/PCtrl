import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["hideMenu", "options"],
  _excluded2 = ["hideMenu", "options"],
  _excluded3 = ["csvOptions", "printOptions", "excelOptions"];
import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridToolbarExportContainer } from './GridToolbarExportContainer';
import { jsx as _jsx } from "react/jsx-runtime";
export function GridCsvExportMenuItem(props) {
  var apiRef = useGridApiContext();
  var hideMenu = props.hideMenu,
    options = props.options,
    other = _objectWithoutProperties(props, _excluded);
  return /*#__PURE__*/_jsx(MenuItem, _extends({
    onClick: function onClick() {
      apiRef.current.exportDataAsCsv(options);
      hideMenu == null ? void 0 : hideMenu();
    }
  }, other, {
    children: apiRef.current.getLocaleText('toolbarExportCSV')
  }));
}
export function GridPrintExportMenuItem(props) {
  var apiRef = useGridApiContext();
  var hideMenu = props.hideMenu,
    options = props.options,
    other = _objectWithoutProperties(props, _excluded2);
  return /*#__PURE__*/_jsx(MenuItem, _extends({
    onClick: function onClick() {
      apiRef.current.exportDataAsPrint(options);
      hideMenu == null ? void 0 : hideMenu();
    }
  }, other, {
    children: apiRef.current.getLocaleText('toolbarExportPrint')
  }));
}
var GridToolbarExport = /*#__PURE__*/React.forwardRef(function GridToolbarExport(props, ref) {
  var _props$csvOptions = props.csvOptions,
    csvOptions = _props$csvOptions === void 0 ? {} : _props$csvOptions,
    _props$printOptions = props.printOptions,
    printOptions = _props$printOptions === void 0 ? {} : _props$printOptions,
    excelOptions = props.excelOptions,
    other = _objectWithoutProperties(props, _excluded3);
  var apiRef = useGridApiContext();
  var preProcessedButtons = apiRef.current.unstable_applyPipeProcessors('exportMenu', [], {
    excelOptions: excelOptions,
    csvOptions: csvOptions,
    printOptions: printOptions
  }).sort(function (a, b) {
    return a.componentName > b.componentName ? 1 : -1;
  });
  if (preProcessedButtons.length === 0) {
    return null;
  }
  return /*#__PURE__*/_jsx(GridToolbarExportContainer, _extends({}, other, {
    ref: ref,
    children: preProcessedButtons.map(function (button, index) {
      return /*#__PURE__*/React.cloneElement(button.component, {
        key: index
      });
    })
  }));
});
process.env.NODE_ENV !== "production" ? GridToolbarExport.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  csvOptions: PropTypes.object,
  printOptions: PropTypes.object
} : void 0;
export { GridToolbarExport };