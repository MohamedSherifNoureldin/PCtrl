"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridPagination = exports.paginationStateInitializer = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _filter = require("../filter");
var _density = require("../density");
var _utils = require("../../utils");
var _pipeProcessing = require("../../core/pipeProcessing");
var _gridPaginationSelector = require("./gridPaginationSelector");
var _gridRowsUtils = require("../rows/gridRowsUtils");
var _gridPaginationUtils = require("./gridPaginationUtils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const paginationStateInitializer = (state, props) => {
  const paginationModel = (0, _extends2.default)({}, (0, _gridPaginationUtils.getDefaultGridPaginationModel)(props.autoPageSize), props.paginationModel ?? props.initialState?.pagination?.paginationModel);
  (0, _gridPaginationUtils.throwIfPageSizeExceedsTheLimit)(paginationModel.pageSize, props.signature);
  return (0, _extends2.default)({}, state, {
    pagination: {
      paginationModel
    }
  });
};
exports.paginationStateInitializer = paginationStateInitializer;
const mergeStateWithPaginationModel = (rowCount, signature, paginationModelProp) => paginationState => {
  let paginationModel = paginationState.paginationModel;
  const pageSize = paginationModelProp?.pageSize ?? paginationModel.pageSize;
  const pageCount = (0, _gridPaginationUtils.getPageCount)(rowCount, pageSize);
  if (paginationModelProp && (paginationModelProp?.page !== paginationModel.page || paginationModelProp?.pageSize !== paginationModel.pageSize)) {
    paginationModel = paginationModelProp;
  }
  const validPage = (0, _gridPaginationUtils.getValidPage)(paginationModel.page, pageCount);
  if (validPage !== paginationModel.page) {
    paginationModel = (0, _extends2.default)({}, paginationModel, {
      page: validPage
    });
  }
  (0, _gridPaginationUtils.throwIfPageSizeExceedsTheLimit)(paginationModel.pageSize, signature);
  return {
    paginationModel
  };
};

/**
 * @requires useGridFilter (state)
 * @requires useGridDimensions (event) - can be after
 */
const useGridPagination = (apiRef, props) => {
  const logger = (0, _utils.useGridLogger)(apiRef, 'useGridPagination');
  const visibleTopLevelRowCount = (0, _utils.useGridSelector)(apiRef, _filter.gridFilteredTopLevelRowCountSelector);
  const densityFactor = (0, _utils.useGridSelector)(apiRef, _density.gridDensityFactorSelector);
  const rowHeight = Math.floor(props.rowHeight * densityFactor);
  apiRef.current.registerControlState({
    stateId: 'pagination',
    propModel: props.paginationModel,
    propOnChange: props.onPaginationModelChange,
    stateSelector: _gridPaginationSelector.gridPaginationModelSelector,
    changeEvent: 'paginationModelChange'
  });

  /**
   * API METHODS
   */
  const setPage = React.useCallback(page => {
    const currentModel = (0, _gridPaginationSelector.gridPaginationModelSelector)(apiRef);
    if (page === currentModel.page) {
      return;
    }
    logger.debug(`Setting page to ${page}`);
    apiRef.current.setPaginationModel({
      page,
      pageSize: currentModel.pageSize
    });
  }, [apiRef, logger]);
  const setPageSize = React.useCallback(pageSize => {
    const currentModel = (0, _gridPaginationSelector.gridPaginationModelSelector)(apiRef);
    if (pageSize === currentModel.pageSize) {
      return;
    }
    logger.debug(`Setting page size to ${pageSize}`);
    apiRef.current.setPaginationModel({
      pageSize,
      page: currentModel.page
    });
  }, [apiRef, logger]);
  const setPaginationModel = React.useCallback(paginationModel => {
    const currentModel = (0, _gridPaginationSelector.gridPaginationModelSelector)(apiRef);
    if (paginationModel === currentModel) {
      return;
    }
    logger.debug("Setting 'paginationModel' to", paginationModel);
    apiRef.current.updateControlState('pagination', mergeStateWithPaginationModel(props.rowCount ?? visibleTopLevelRowCount, props.signature, paginationModel), 'setPaginationModel');
    apiRef.current.forceUpdate();
  }, [apiRef, logger, props.rowCount, props.signature, visibleTopLevelRowCount]);
  const pageApi = {
    setPage,
    setPageSize,
    setPaginationModel
  };
  (0, _utils.useGridApiMethod)(apiRef, pageApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback((prevState, context) => {
    const paginationModel = (0, _gridPaginationSelector.gridPaginationModelSelector)(apiRef);
    const shouldExportPaginationModel =
    // Always export if the `exportOnlyDirtyModels` property is not activated
    !context.exportOnlyDirtyModels ||
    // Always export if the `paginationModel` is controlled
    props.paginationModel != null ||
    // Always export if the `paginationModel` has been initialized
    props.initialState?.pagination?.paginationModel != null ||
    // Export if `page` or `pageSize` is not equal to the default value
    paginationModel.page !== 0 && paginationModel.pageSize !== (0, _gridPaginationUtils.defaultPageSize)(props.autoPageSize);
    if (!shouldExportPaginationModel) {
      return prevState;
    }
    return (0, _extends2.default)({}, prevState, {
      pagination: (0, _extends2.default)({}, prevState.pagination, {
        paginationModel
      })
    });
  }, [apiRef, props.paginationModel, props.initialState?.pagination?.paginationModel, props.autoPageSize]);
  const stateRestorePreProcessing = React.useCallback((params, context) => {
    const paginationModel = context.stateToRestore.pagination?.paginationModel ? (0, _extends2.default)({}, (0, _gridPaginationUtils.getDefaultGridPaginationModel)(props.autoPageSize), context.stateToRestore.pagination?.paginationModel) : (0, _gridPaginationSelector.gridPaginationModelSelector)(apiRef);
    apiRef.current.updateControlState('pagination', mergeStateWithPaginationModel(props.rowCount ?? visibleTopLevelRowCount, props.signature, paginationModel), 'stateRestorePreProcessing');
    return params;
  }, [apiRef, props.autoPageSize, props.rowCount, props.signature, visibleTopLevelRowCount]);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'restoreState', stateRestorePreProcessing);

  /**
   * EVENTS
   */
  const handlePaginationModelChange = () => {
    const paginationModel = (0, _gridPaginationSelector.gridPaginationModelSelector)(apiRef);
    if (apiRef.current.virtualScrollerRef?.current) {
      apiRef.current.scrollToIndexes({
        rowIndex: paginationModel.page * paginationModel.pageSize
      });
    }
    apiRef.current.forceUpdate();
  };
  const handleUpdateAutoPageSize = React.useCallback(() => {
    const dimensions = apiRef.current.getRootDimensions();
    if (!props.autoPageSize || !dimensions) {
      return;
    }
    const pinnedRowsHeight = (0, _gridRowsUtils.calculatePinnedRowsHeight)(apiRef);
    const maximumPageSizeWithoutScrollBar = Math.floor((dimensions.viewportInnerSize.height - pinnedRowsHeight.top - pinnedRowsHeight.bottom) / rowHeight);
    apiRef.current.setPageSize(maximumPageSizeWithoutScrollBar);
  }, [apiRef, props.autoPageSize, rowHeight]);
  (0, _utils.useGridApiEventHandler)(apiRef, 'viewportInnerSizeChange', handleUpdateAutoPageSize);
  (0, _utils.useGridApiEventHandler)(apiRef, 'paginationModelChange', handlePaginationModelChange);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (props.paginationMode === 'server' && props.rowCount == null) {
        (0, _gridPaginationUtils.noRowCountInServerMode)();
      }
    }
  }, [props.rowCount, props.paginationMode]);
  React.useEffect(() => {
    apiRef.current.updateControlState('pagination', mergeStateWithPaginationModel(props.rowCount ?? visibleTopLevelRowCount, props.signature, props.paginationModel));
  }, [apiRef, props.paginationModel, props.rowCount, props.paginationMode, visibleTopLevelRowCount, props.signature]);
  React.useEffect(() => {
    handleUpdateAutoPageSize();
  }, [handleUpdateAutoPageSize]);
};
exports.useGridPagination = useGridPagination;