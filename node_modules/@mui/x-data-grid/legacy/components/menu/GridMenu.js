import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
var _excluded = ["open", "target", "onClickAway", "children", "position", "className", "onExited"];
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { unstable_composeClasses as composeClasses, HTMLElementType } from '@mui/utils';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { styled } from '@mui/material/styles';
import { getDataGridUtilityClass, gridClasses } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { jsx as _jsx } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['menu']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
var GridMenuRoot = styled(Popper, {
  name: 'MuiDataGrid',
  slot: 'Menu',
  overridesResolver: function overridesResolver(_, styles) {
    return styles.menu;
  }
})(function (_ref) {
  var theme = _ref.theme;
  return _defineProperty({
    zIndex: theme.zIndex.modal
  }, "& .".concat(gridClasses.menuList), {
    outline: 0
  });
});
var transformOrigin = {
  'bottom-start': 'top left',
  'bottom-end': 'top right'
};
function GridMenu(props) {
  var _rootProps$slotProps;
  var open = props.open,
    target = props.target,
    onClickAway = props.onClickAway,
    _children = props.children,
    position = props.position,
    className = props.className,
    onExited = props.onExited,
    other = _objectWithoutProperties(props, _excluded);
  var apiRef = useGridApiContext();
  var rootProps = useGridRootProps();
  var classes = useUtilityClasses(rootProps);
  React.useEffect(function () {
    // Emit menuOpen or menuClose events
    var eventName = open ? 'menuOpen' : 'menuClose';
    apiRef.current.publishEvent(eventName, {
      target: target
    });
  }, [apiRef, open, target]);
  var handleExited = function handleExited(popperOnExited) {
    return function (node) {
      if (popperOnExited) {
        popperOnExited();
      }
      if (onExited) {
        onExited(node);
      }
    };
  };
  return /*#__PURE__*/_jsx(GridMenuRoot, _extends({
    as: rootProps.slots.basePopper,
    className: clsx(className, classes.root),
    ownerState: rootProps,
    open: open,
    anchorEl: target,
    transition: true,
    placement: position
  }, other, (_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.basePopper, {
    children: function children(_ref3) {
      var TransitionProps = _ref3.TransitionProps,
        placement = _ref3.placement;
      return /*#__PURE__*/_jsx(ClickAwayListener, {
        onClickAway: onClickAway,
        mouseEvent: "onMouseDown",
        children: /*#__PURE__*/_jsx(Grow, _extends({}, TransitionProps, {
          style: {
            transformOrigin: transformOrigin[placement]
          },
          onExited: handleExited(TransitionProps == null ? void 0 : TransitionProps.onExited),
          children: /*#__PURE__*/_jsx(Paper, {
            children: _children
          })
        }))
      });
    }
  }));
}
process.env.NODE_ENV !== "production" ? GridMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  onClickAway: PropTypes.func.isRequired,
  onExited: PropTypes.func,
  /**
   * If `true`, the component is shown.
   */
  open: PropTypes.bool.isRequired,
  position: PropTypes.oneOf(['bottom-end', 'bottom-start', 'bottom', 'left-end', 'left-start', 'left', 'right-end', 'right-start', 'right', 'top-end', 'top-start', 'top']),
  target: HTMLElementType
} : void 0;
export { GridMenu };