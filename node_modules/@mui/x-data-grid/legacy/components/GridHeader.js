import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
export function GridHeader() {
  var _rootProps$slotProps, _rootProps$slotProps2;
  var rootProps = useGridRootProps();
  return /*#__PURE__*/_jsxs(React.Fragment, {
    children: [/*#__PURE__*/_jsx(rootProps.slots.preferencesPanel, _extends({}, (_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.preferencesPanel)), rootProps.slots.toolbar && /*#__PURE__*/_jsx(rootProps.slots.toolbar, _extends({}, (_rootProps$slotProps2 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps2.toolbar))]
  });
}