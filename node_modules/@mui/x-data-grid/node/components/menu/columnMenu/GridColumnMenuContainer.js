"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridColumnMenuContainer = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _clsx = _interopRequireDefault(require("clsx"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var React = _interopRequireWildcard(require("react"));
var _MenuList = _interopRequireDefault(require("@mui/material/MenuList"));
var _styles = require("@mui/material/styles");
var _keyboardUtils = require("../../../utils/keyboardUtils");
var _gridClasses = require("../../../constants/gridClasses");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["hideMenu", "colDef", "id", "labelledby", "className", "children", "open"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const StyledMenuList = (0, _styles.styled)(_MenuList.default)(() => ({
  minWidth: 248
}));
const GridColumnMenuContainer = /*#__PURE__*/React.forwardRef(function GridColumnMenuContainer(props, ref) {
  const {
      hideMenu,
      id,
      labelledby,
      className,
      children,
      open
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const handleListKeyDown = React.useCallback(event => {
    if ((0, _keyboardUtils.isTabKey)(event.key)) {
      event.preventDefault();
    }
    if ((0, _keyboardUtils.isHideMenuKey)(event.key)) {
      hideMenu(event);
    }
  }, [hideMenu]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(StyledMenuList, (0, _extends2.default)({
    id: id,
    ref: ref,
    className: (0, _clsx.default)(_gridClasses.gridClasses.menuList, className),
    "aria-labelledby": labelledby,
    onKeyDown: handleListKeyDown,
    autoFocus: open
  }, other, {
    children: children
  }));
});
exports.GridColumnMenuContainer = GridColumnMenuContainer;
process.env.NODE_ENV !== "production" ? GridColumnMenuContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: _propTypes.default.object.isRequired,
  hideMenu: _propTypes.default.func.isRequired,
  id: _propTypes.default.string,
  labelledby: _propTypes.default.string,
  open: _propTypes.default.bool.isRequired
} : void 0;