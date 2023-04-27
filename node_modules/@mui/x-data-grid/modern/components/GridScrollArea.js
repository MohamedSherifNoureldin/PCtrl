import _extends from "@babel/runtime/helpers/esm/extends";
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
const CLIFF = 1;
const SLOP = 1.5;
const useUtilityClasses = ownerState => {
  const {
    scrollDirection,
    classes
  } = ownerState;
  const slots = {
    root: ['scrollArea', `scrollArea--${scrollDirection}`]
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridScrollAreaRawRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ScrollArea',
  overridesResolver: (props, styles) => [{
    [`&.${gridClasses['scrollArea--left']}`]: styles['scrollArea--left']
  }, {
    [`&.${gridClasses['scrollArea--right']}`]: styles['scrollArea--right']
  }, styles.scrollArea]
})(() => ({
  position: 'absolute',
  top: 0,
  zIndex: 101,
  width: 20,
  bottom: 0,
  [`&.${gridClasses['scrollArea--left']}`]: {
    left: 0
  },
  [`&.${gridClasses['scrollArea--right']}`]: {
    right: 0
  }
}));
function GridScrollAreaRaw(props) {
  const {
    scrollDirection
  } = props;
  const rootRef = React.useRef(null);
  const apiRef = useGridApiContext();
  const timeout = React.useRef();
  const [dragging, setDragging] = React.useState(false);
  const densityFactor = useGridSelector(apiRef, gridDensityFactorSelector);
  const scrollPosition = React.useRef({
    left: 0,
    top: 0
  });
  const rootProps = useGridRootProps();
  const ownerState = _extends({}, rootProps, {
    scrollDirection
  });
  const classes = useUtilityClasses(ownerState);
  const headerHeight = Math.floor(rootProps.columnHeaderHeight * densityFactor);
  const handleScrolling = React.useCallback(newScrollPosition => {
    scrollPosition.current = newScrollPosition;
  }, []);
  const handleDragOver = React.useCallback(event => {
    let offset;
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
    timeout.current = setTimeout(() => {
      apiRef.current.scroll({
        left: scrollPosition.current.left + offset,
        top: scrollPosition.current.top
      });
    });
  }, [scrollDirection, apiRef]);
  React.useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);
  const toggleDragging = React.useCallback(() => {
    setDragging(prevDragging => !prevDragging);
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
const GridScrollArea = /*#__PURE__*/React.memo(GridScrollAreaRaw);
export { GridScrollArea };