"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeSlots = computeSlots;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _slotsMigration = require("./slotsMigration");
// TODO v7: Remove `components` and usages of `UncapitalizeObjectKeys` type
// after converting keys in Grid(Pro|Premium)SlotsComponent to camelCase.
// https://github.com/mui/mui-x/issues/7940
function computeSlots({
  defaultSlots,
  slots,
  components
}) {
  const overrides = slots ?? (components ? (0, _slotsMigration.uncapitalizeObjectKeys)(components) : null);
  if (!overrides || Object.keys(overrides).length === 0) {
    return defaultSlots;
  }
  return (0, _extends2.default)({}, defaultSlots, overrides);
}