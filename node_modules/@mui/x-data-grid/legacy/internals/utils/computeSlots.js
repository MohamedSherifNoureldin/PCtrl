import _extends from "@babel/runtime/helpers/esm/extends";
import { uncapitalizeObjectKeys } from './slotsMigration';

// TODO v7: Remove `components` and usages of `UncapitalizeObjectKeys` type
// after converting keys in Grid(Pro|Premium)SlotsComponent to camelCase.
// https://github.com/mui/mui-x/issues/7940
export function computeSlots(_ref) {
  var defaultSlots = _ref.defaultSlots,
    slots = _ref.slots,
    components = _ref.components;
  var overrides = slots != null ? slots : components ? uncapitalizeObjectKeys(components) : null;
  if (!overrides || Object.keys(overrides).length === 0) {
    return defaultSlots;
  }
  return _extends({}, defaultSlots, overrides);
}