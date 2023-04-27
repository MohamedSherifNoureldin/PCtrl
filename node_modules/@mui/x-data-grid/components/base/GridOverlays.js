import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { styled } from '@mui/system';
import { unstable_composeClasses as composeClasses, unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';
import clsx from 'clsx';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridExpandedRowCountSelector } from '../../hooks/features/filter/gridFilterSelector';
import { gridRowCountSelector, gridRowsLoadingSelector } from '../../hooks/features/rows/gridRowsSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getMinimalContentHeight } from '../../hooks/features/rows/gridRowsUtils';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { jsx as _jsx } from "react/jsx-runtime";
const GridOverlayWrapperRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'OverlayWrapper',
  overridesResolver: (props, styles) => styles.overlayWrapper
})({
  position: 'sticky',
  // To stay in place while scrolling
  top: 0,
  left: 0,
  width: 0,
  // To stay above the content instead of shifting it down
  height: 0,
  // To stay above the content instead of shifting it down
  zIndex: 4 // Should be above pinned columns, pinned rows and detail panel
});

const GridOverlayWrapperInner = styled('div', {
  name: 'MuiDataGrid',
  slot: 'OverlayWrapperInner',
  overridesResolver: (props, styles) => styles.overlayWrapperInner
})({});
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['overlayWrapper'],
    inner: ['overlayWrapperInner']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridOverlayWrapper(props) {
  var _viewportInnerSize$he, _viewportInnerSize$wi;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const [viewportInnerSize, setViewportInnerSize] = React.useState(() => {
    var _apiRef$current$getRo, _apiRef$current$getRo2;
    return (_apiRef$current$getRo = (_apiRef$current$getRo2 = apiRef.current.getRootDimensions()) == null ? void 0 : _apiRef$current$getRo2.viewportInnerSize) != null ? _apiRef$current$getRo : null;
  });
  const handleViewportSizeChange = React.useCallback(() => {
    var _apiRef$current$getRo3, _apiRef$current$getRo4;
    setViewportInnerSize((_apiRef$current$getRo3 = (_apiRef$current$getRo4 = apiRef.current.getRootDimensions()) == null ? void 0 : _apiRef$current$getRo4.viewportInnerSize) != null ? _apiRef$current$getRo3 : null);
  }, [apiRef]);
  useEnhancedEffect(() => {
    return apiRef.current.subscribeEvent('viewportInnerSizeChange', handleViewportSizeChange);
  }, [apiRef, handleViewportSizeChange]);
  let height = (_viewportInnerSize$he = viewportInnerSize == null ? void 0 : viewportInnerSize.height) != null ? _viewportInnerSize$he : 0;
  if (rootProps.autoHeight && height === 0) {
    height = getMinimalContentHeight(apiRef, rootProps.rowHeight); // Give room to show the overlay when there no rows.
  }

  const classes = useUtilityClasses(_extends({}, props, {
    classes: rootProps.classes
  }));
  if (!viewportInnerSize) {
    return null;
  }
  return /*#__PURE__*/_jsx(GridOverlayWrapperRoot, {
    className: clsx(classes.root),
    children: /*#__PURE__*/_jsx(GridOverlayWrapperInner, _extends({
      className: clsx(classes.inner),
      style: {
        height,
        width: (_viewportInnerSize$wi = viewportInnerSize == null ? void 0 : viewportInnerSize.width) != null ? _viewportInnerSize$wi : 0
      }
    }, props))
  });
}
export function GridOverlays() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const visibleRowCount = useGridSelector(apiRef, gridExpandedRowCountSelector);
  const loading = useGridSelector(apiRef, gridRowsLoadingSelector);
  const showNoRowsOverlay = !loading && totalRowCount === 0;
  const showNoResultsOverlay = !loading && totalRowCount > 0 && visibleRowCount === 0;
  let overlay = null;
  if (showNoRowsOverlay) {
    var _rootProps$slotProps;
    overlay = /*#__PURE__*/_jsx(rootProps.slots.noRowsOverlay, _extends({}, (_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.noRowsOverlay));
  }
  if (showNoResultsOverlay) {
    var _rootProps$slotProps2;
    overlay = /*#__PURE__*/_jsx(rootProps.slots.noResultsOverlay, _extends({}, (_rootProps$slotProps2 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps2.noResultsOverlay));
  }
  if (loading) {
    var _rootProps$slotProps3;
    overlay = /*#__PURE__*/_jsx(rootProps.slots.loadingOverlay, _extends({}, (_rootProps$slotProps3 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps3.loadingOverlay));
  }
  if (overlay === null) {
    return null;
  }
  return /*#__PURE__*/_jsx(GridOverlayWrapper, {
    children: overlay
  });
}