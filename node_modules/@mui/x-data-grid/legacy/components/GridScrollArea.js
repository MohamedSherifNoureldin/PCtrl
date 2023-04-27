import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled } from '@mui/system';
import { useGridApiEventHandler } from '../hooks/utils/useGridApiEventHandler';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass, gridClasses } from '../constants/gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { gridDensityFactorSelector } from '../hooks/features/density/densitySelector';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { jsx as _jsx } from "react/jsx-runtime";
var CLIFF = 1;
var SLOP = 1.5;
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var scrollDirection = ownerState.scrollDirection,
    classes = ownerState.classes;
  var slots = {
    root: ['scrollArea', "scrollArea--".concat(scrollDirection)]
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
var GridScrollAreaRawRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ScrollArea',
  overridesResolver: function overridesResolver(props, styles) {
    return [_defineProperty({}, "&.".concat(gridClasses['scrollArea--left']), styles['scrollArea--left']), _defineProperty({}, "&.".concat(gridClasses['scrollArea--right']), styles['scrollArea--right']), styles.scrollArea];
  }
})(function () {
  var _ref3;
  return _ref3 = {
    position: 'absolute',
    top: 0,
    zIndex: 101,
    width: 20,
    bottom: 0
  }, _defineProperty(_ref3, "&.".concat(gridClasses['scrollArea--left']), {
    left: 0
  }), _defineProperty(_ref3, "&.".concat(gridClasses['scrollArea--right']), {
    right: 0
  }), _ref3;
});
function GridScrollAreaRaw(props) {
  var scrollDirection = props.scrollDirection;
  var rootRef = React.useRef(null);
  var apiRef = useGridApiContext();
  var timeout = React.useRef();
  var _React$useState = React.useState(false),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    dragging = _React$useState2[0],
    setDragging = _React$useState2[1];
  var densityFactor = useGridSelector(apiRef, gridDensityFactorSelector);
  var scrollPosition = React.useRef({
    left: 0,
    top: 0
  });
  var rootProps = useGridRootProps();
  var ownerState = _extends({}, rootProps, {
    scrollDirection: scrollDirection
  });
  var classes = useUtilityClasses(ownerState);
  var headerHeight = Math.floor(rootProps.columnHeaderHeight * densityFactor);
  var handleScrolling = React.useCallback(function (newScrollPosition) {
    scrollPosition.current = newScrollPosition;
  }, []);
  var handleDragOver = React.useCallback(function (event) {
    var offset;
    if (scrollDirection === 'left') {
      offset = event.clientX - rootRef.current.getBoundingClientRect().right;
    } else if (scrollDirection === 'right') {
      offset = Math.max(1, event.clientX - rootRef.current.getBoundingClientRect().left);
    } else {
      throw new Error('MUI: Wrong drag direction');
    }
    offset = (offset - CLIFF) * SLOP + CLIFF;
    clearTimeout(timeout.current);
    // Avoid freeze and inertia.
    timeout.current = setTimeout(function () {
      apiRef.current.scroll({
        left: scrollPosition.current.left + offset,
        top: scrollPosition.current.top
      });
    });
  }, [scrollDirection, apiRef]);
  React.useEffect(function () {
    return function () {
      clearTimeout(timeout.current);
    };
  }, []);
  var toggleDragging = React.useCallback(function () {
    setDragging(function (prevDragging) {
      return !prevDragging;
    });
  }, []);
  useGridApiEventHandler(apiRef, 'scrollPositionChange', handleScrolling);
  useGridApiEventHandler(apiRef, 'columnHeaderDragStart', toggleDragging);
  useGridApiEventHandler(apiRef, 'columnHeaderDragEnd', toggleDragging);
  return dragging ? /*#__PURE__*/_jsx(GridScrollAreaRawRoot, {
    ref: rootRef,
    className: clsx(classes.root),
    ownerState: ownerState,
    onDragOver: handleDragOver,
    style: {
      height: headerHeight
    }
  }) : null;
}
process.env.NODE_ENV !== "production" ? GridScrollAreaRaw.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  scrollDirection: PropTypes.oneOf(['left', 'right']).isRequired
} : void 0;
var GridScrollArea = /*#__PURE__*/React.memo(GridScrollAreaRaw);
export { GridScrollArea };