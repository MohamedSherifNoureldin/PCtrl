"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridRowsMeta = exports.rowsMetaStateInitializer = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _utils = require("@mui/utils");
var _useGridVisibleRows = require("../../utils/useGridVisibleRows");
var _useGridApiMethod = require("../../utils/useGridApiMethod");
var _useGridSelector = require("../../utils/useGridSelector");
var _densitySelector = require("../density/densitySelector");
var _gridFilterSelector = require("../filter/gridFilterSelector");
var _gridPaginationSelector = require("../pagination/gridPaginationSelector");
var _gridSortingSelector = require("../sorting/gridSortingSelector");
var _pipeProcessing = require("../../core/pipeProcessing");
var _gridRowsSelector = require("./gridRowsSelector");
var _useDataGridProps = require("../../../DataGrid/useDataGridProps");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const rowsMetaStateInitializer = state => (0, _extends2.default)({}, state, {
  rowsMeta: {
    currentPageTotalHeight: 0,
    positions: []
  }
});
exports.rowsMetaStateInitializer = rowsMetaStateInitializer;
let warnedOnceInvalidRowHeight = false;
const getValidRowHeight = (rowHeightProp, defaultRowHeight, warningMessage) => {
  if (typeof rowHeightProp === 'number' && rowHeightProp > 0) {
    return rowHeightProp;
  }
  if (process.env.NODE_ENV !== 'production' && !warnedOnceInvalidRowHeight && typeof rowHeightProp !== 'undefined' && rowHeightProp !== null) {
    console.warn(warningMessage);
    warnedOnceInvalidRowHeight = true;
  }
  return defaultRowHeight;
};
const rowHeightWarning = [`MUI: The \`rowHeight\` prop should be a number greater than 0.`, `The default value will be used instead.`].join('\n');
const getRowHeightWarning = [`MUI: The \`getRowHeight\` prop should return a number greater than 0 or 'auto'.`, `The default value will be used instead.`].join('\n');

/**
 * @requires useGridPageSize (method)
 * @requires useGridPage (method)
 */
const useGridRowsMeta = (apiRef, props) => {
  const {
    getRowHeight: getRowHeightProp,
    getRowSpacing,
    getEstimatedRowHeight
  } = props;
  const rowsHeightLookup = React.useRef({});

  // Inspired by https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/utils/CellSizeAndPositionManager.js
  const lastMeasuredRowIndex = React.useRef(-1);
  const hasRowWithAutoHeight = React.useRef(false);
  const densityFactor = (0, _useGridSelector.useGridSelector)(apiRef, _densitySelector.gridDensityFactorSelector);
  const filterModel = (0, _useGridSelector.useGridSelector)(apiRef, _gridFilterSelector.gridFilterModelSelector);
  const paginationState = (0, _useGridSelector.useGridSelector)(apiRef, _gridPaginationSelector.gridPaginationSelector);
  const sortModel = (0, _useGridSelector.useGridSelector)(apiRef, _gridSortingSelector.gridSortModelSelector);
  const currentPage = (0, _useGridVisibleRows.useGridVisibleRows)(apiRef, props);
  const pinnedRows = (0, _useGridSelector.useGridSelector)(apiRef, _gridRowsSelector.gridPinnedRowsSelector);
  const validRowHeight = getValidRowHeight(props.rowHeight, _useDataGridProps.DATA_GRID_PROPS_DEFAULT_VALUES.rowHeight, rowHeightWarning);
  const rowHeight = Math.floor(validRowHeight * densityFactor);
  const hydrateRowsMeta = React.useCallback(() => {
    hasRowWithAutoHeight.current = false;
    const calculateRowProcessedSizes = row => {
      if (!rowsHeightLookup.current[row.id]) {
        rowsHeightLookup.current[row.id] = {
          sizes: {
            baseCenter: rowHeight
          },
          isResized: false,
          autoHeight: false,
          needsFirstMeasurement: true // Assume all rows will need to be measured by default
        };
      }

      const {
        isResized,
        needsFirstMeasurement,
        sizes
      } = rowsHeightLookup.current[row.id];
      let baseRowHeight = typeof rowHeight === 'number' && rowHeight > 0 ? rowHeight : 52;
      const existingBaseRowHeight = sizes.baseCenter;
      if (isResized) {
        // Do not recalculate resized row height and use the value from the lookup
        baseRowHeight = existingBaseRowHeight;
      } else if (getRowHeightProp) {
        const rowHeightFromUser = getRowHeightProp((0, _extends2.default)({}, row, {
          densityFactor
        }));
        if (rowHeightFromUser === 'auto') {
          if (needsFirstMeasurement) {
            const estimatedRowHeight = getEstimatedRowHeight ? getEstimatedRowHeight((0, _extends2.default)({}, row, {
              densityFactor
            })) : rowHeight;

            // If the row was not measured yet use the estimated row height
            baseRowHeight = estimatedRowHeight ?? rowHeight;
          } else {
            baseRowHeight = existingBaseRowHeight;
          }
          hasRowWithAutoHeight.current = true;
          rowsHeightLookup.current[row.id].autoHeight = true;
        } else {
          // Default back to base rowHeight if getRowHeight returns invalid value.
          baseRowHeight = getValidRowHeight(rowHeightFromUser, rowHeight, getRowHeightWarning);
          rowsHeightLookup.current[row.id].needsFirstMeasurement = false;
          rowsHeightLookup.current[row.id].autoHeight = false;
        }
      } else {
        rowsHeightLookup.current[row.id].needsFirstMeasurement = false;
      }
      const existingBaseSizes = Object.entries(sizes).reduce((acc, [key, size]) => {
        if (/^base[A-Z]/.test(key)) {
          acc[key] = size;
        }
        return acc;
      }, {});

      // We use an object to make simple to check if a height is already added or not
      const initialHeights = (0, _extends2.default)({}, existingBaseSizes, {
        baseCenter: baseRowHeight
      });
      if (getRowSpacing) {
        const indexRelativeToCurrentPage = apiRef.current.getRowIndexRelativeToVisibleRows(row.id);
        const spacing = getRowSpacing((0, _extends2.default)({}, row, {
          isFirstVisible: indexRelativeToCurrentPage === 0,
          isLastVisible: indexRelativeToCurrentPage === currentPage.rows.length - 1,
          indexRelativeToCurrentPage
        }));
        initialHeights.spacingTop = spacing.top ?? 0;
        initialHeights.spacingBottom = spacing.bottom ?? 0;
      }
      const processedSizes = apiRef.current.unstable_applyPipeProcessors('rowHeight', initialHeights, row);
      rowsHeightLookup.current[row.id].sizes = processedSizes;
      return processedSizes;
    };
    const positions = [];
    const currentPageTotalHeight = currentPage.rows.reduce((acc, row) => {
      positions.push(acc);
      let maximumBaseSize = 0;
      let otherSizes = 0;
      const processedSizes = calculateRowProcessedSizes(row);
      Object.entries(processedSizes).forEach(([size, value]) => {
        if (/^base[A-Z]/.test(size)) {
          maximumBaseSize = value > maximumBaseSize ? value : maximumBaseSize;
        } else {
          otherSizes += value;
        }
      });
      return acc + maximumBaseSize + otherSizes;
    }, 0);
    pinnedRows?.top?.forEach(row => {
      calculateRowProcessedSizes(row);
    });
    pinnedRows?.bottom?.forEach(row => {
      calculateRowProcessedSizes(row);
    });
    apiRef.current.setState(state => {
      return (0, _extends2.default)({}, state, {
        rowsMeta: {
          currentPageTotalHeight,
          positions
        }
      });
    });
    if (!hasRowWithAutoHeight.current) {
      // No row has height=auto, so all rows are already measured
      lastMeasuredRowIndex.current = Infinity;
    }
    apiRef.current.forceUpdate();
  }, [apiRef, currentPage.rows, rowHeight, getRowHeightProp, getRowSpacing, getEstimatedRowHeight, pinnedRows, densityFactor]);
  const getRowHeight = React.useCallback(rowId => {
    const height = rowsHeightLookup.current[rowId];
    return height ? height.sizes.baseCenter : rowHeight;
  }, [rowHeight]);
  const getRowInternalSizes = rowId => rowsHeightLookup.current[rowId]?.sizes;
  const setRowHeight = React.useCallback((id, height) => {
    rowsHeightLookup.current[id].sizes.baseCenter = height;
    rowsHeightLookup.current[id].isResized = true;
    rowsHeightLookup.current[id].needsFirstMeasurement = false;
    hydrateRowsMeta();
  }, [hydrateRowsMeta]);
  const debouncedHydrateRowsMeta = React.useMemo(() => (0, _utils.unstable_debounce)(hydrateRowsMeta), [hydrateRowsMeta]);
  const storeMeasuredRowHeight = React.useCallback((id, height, position) => {
    if (!rowsHeightLookup.current[id] || !rowsHeightLookup.current[id].autoHeight) {
      return;
    }

    // Only trigger hydration if the value is different, otherwise we trigger a loop
    const needsHydration = rowsHeightLookup.current[id].sizes[`base${(0, _utils.unstable_capitalize)(position)}`] !== height;
    rowsHeightLookup.current[id].needsFirstMeasurement = false;
    rowsHeightLookup.current[id].sizes[`base${(0, _utils.unstable_capitalize)(position)}`] = height;
    if (needsHydration) {
      debouncedHydrateRowsMeta();
    }
  }, [debouncedHydrateRowsMeta]);
  const rowHasAutoHeight = React.useCallback(id => {
    return rowsHeightLookup.current[id]?.autoHeight || false;
  }, []);
  const getLastMeasuredRowIndex = React.useCallback(() => {
    return lastMeasuredRowIndex.current;
  }, []);
  const setLastMeasuredRowIndex = React.useCallback(index => {
    if (hasRowWithAutoHeight.current && index > lastMeasuredRowIndex.current) {
      lastMeasuredRowIndex.current = index;
    }
  }, []);
  const resetRowHeights = React.useCallback(() => {
    rowsHeightLookup.current = {};
    hydrateRowsMeta();
  }, [hydrateRowsMeta]);

  // The effect is used to build the rows meta data - currentPageTotalHeight and positions.
  // Because of variable row height this is needed for the virtualization
  React.useEffect(() => {
    hydrateRowsMeta();
  }, [rowHeight, filterModel, paginationState, sortModel, hydrateRowsMeta]);
  (0, _pipeProcessing.useGridRegisterPipeApplier)(apiRef, 'rowHeight', hydrateRowsMeta);
  const rowsMetaApi = {
    unstable_setLastMeasuredRowIndex: setLastMeasuredRowIndex,
    unstable_getRowHeight: getRowHeight,
    unstable_getRowInternalSizes: getRowInternalSizes,
    unstable_setRowHeight: setRowHeight,
    unstable_storeRowHeightMeasurement: storeMeasuredRowHeight,
    resetRowHeights
  };
  const rowsMetaPrivateApi = {
    getLastMeasuredRowIndex,
    rowHasAutoHeight
  };
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, rowsMetaApi, 'public');
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, rowsMetaPrivateApi, 'private');
};
exports.useGridRowsMeta = useGridRowsMeta;