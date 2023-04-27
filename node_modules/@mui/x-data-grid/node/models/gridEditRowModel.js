"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridRowModes = exports.GridEditModes = exports.GridCellModes = void 0;
var GridEditModes = /*#__PURE__*/function (GridEditModes) {
  GridEditModes["Cell"] = "cell";
  GridEditModes["Row"] = "row";
  return GridEditModes;
}(GridEditModes || {});
exports.GridEditModes = GridEditModes;
var GridCellModes = /*#__PURE__*/function (GridCellModes) {
  GridCellModes["Edit"] = "edit";
  GridCellModes["View"] = "view";
  return GridCellModes;
}(GridCellModes || {});
exports.GridCellModes = GridCellModes;
var GridRowModes = /*#__PURE__*/function (GridRowModes) {
  GridRowModes["Edit"] = "edit";
  GridRowModes["View"] = "view";
  return GridRowModes;
}(GridRowModes || {});
exports.GridRowModes = GridRowModes;