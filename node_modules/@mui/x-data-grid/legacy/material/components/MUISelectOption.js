import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["native"];
import * as React from 'react';
import MUIMenuItem from '@mui/material/MenuItem';
import { jsx as _jsx } from "react/jsx-runtime";
export default function MUISelectOption(_ref) {
  var native = _ref.native,
    props = _objectWithoutProperties(_ref, _excluded);
  if (native) {
    return /*#__PURE__*/_jsx("option", _extends({}, props));
  }
  return /*#__PURE__*/_jsx(MUIMenuItem, _extends({}, props));
}