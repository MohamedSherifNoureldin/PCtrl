"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridMenu = GridMenu;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clsx = _interopRequireDefault(require("clsx"));
var _ClickAwayListener = _interopRequireDefault(require("@mui/material/ClickAwayListener"));
var _utils = require("@mui/utils");
var _Grow = _interopRequireDefault(require("@mui/material/Grow"));
var _Paper = _interopRequireDefault(require("@mui/material/Paper"));
var _Popper = _interopRequireDefault(require("@mui/material/Popper"));
var _styles = require("@mui/material/styles");
var _gridClasses = require("../../constants/gridClasses");
var _useGridRootProps = require("../../hooks/utils/useGridRootProps");
var _useGridApiContext = require("../../hooks/utils/useGridApiContext");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["open", "target", "onClickAway", "children", "position", "className", "onExited"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['menu']
  };
  return (0, _utils.unstable_composeClasses)(slots, _gridClasses.getDataGridUtilityClass, classes);
};
const GridMenuRoot = (0, _styles.styled)(_Popper.default, {
  name: 'MuiDataGrid',
  slot: 'Menu',
  overridesResolver: (_, styles) => styles.menu
})(({
  theme
}) => ({
  zIndex: theme.zIndex.modal,
  [`& .${_gridClasses.gridClasses.menuList}`]: {
    outline: 0
  }
}));
const transformOrigin = {
  'bottom-start': 'top left',
  'bottom-end': 'top right'
};
function GridMenu(props) {
  const {
      open,
      target,
      onClickAway,
      children,
      position,
      className,
      onExited
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const classes = useUtilityClasses(rootProps);
  React.useEffect(() => {
    // Emit menuOpen or menuClose events
    const eventName = open ? 'menuOpen' : 'menuClose';
    apiRef.current.publishEvent(eventName, {
      target
    });
  }, [apiRef, open, target]);
  const handleExited = popperOnExited => node => {
    if (popperOnExited) {
      popperOnExited();
    }
    if (onExited) {
      onExited(node);
    }
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(GridMenuRoot, (0, _extends2.default)({
    as: rootProps.slots.basePopper,
    className: (0, _clsx.default)(className, classes.root),
    ownerState: rootProps,
    open: open,
    anchorEl: target,
    transition: true,
    placement: position
  }, other, rootProps.slotProps?.basePopper, {
    children: ({
      TransitionProps,
      placement
    }) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_ClickAwayListener.default, {
      onClickAway: onClickAway,
      mouseEvent: "onMouseDown",
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grow.default, (0, _extends2.default)({}, TransitionProps, {
        style: {
          transformOrigin: transformOrigin[placement]
        },
        onExited: handleExited(TransitionProps?.onExited),
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Paper.default, {
          children: children
        })
      }))
    })
  }));
}
process.env.NODE_ENV !== "production" ? GridMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: _propTypes.default.node,
  onClickAway: _propTypes.default.func.isRequired,
  onExited: _propTypes.default.func,
  /**
   * If `true`, the component is shown.
   */
  open: _propTypes.default.bool.isRequired,
  position: _propTypes.default.oneOf(['bottom-end', 'bottom-start', 'bottom', 'left-end', 'left-start', 'left', 'right-end', 'right-start', 'right', 'top-end', 'top-start', 'top']),
  target: _utils.HTMLElementType
} : void 0;