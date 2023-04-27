import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { gridFilteredTopLevelRowCountSelector } from '../filter';
import { gridDensityFactorSelector } from '../density';
import { useGridLogger, useGridSelector, useGridApiMethod, useGridApiEventHandler } from '../../utils';
import { useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { gridPaginationModelSelector } from './gridPaginationSelector';
import { calculatePinnedRowsHeight } from '../rows/gridRowsUtils';
import { getPageCount, noRowCountInServerMode, defaultPageSize, throwIfPageSizeExceedsTheLimit, getDefaultGridPaginationModel, getValidPage } from './gridPaginationUtils';
export var paginationStateInitializer = function paginationStateInitializer(state, props) {
  var _props$paginationMode, _props$initialState, _props$initialState$p;
  var paginationModel = _extends({}, getDefaultGridPaginationModel(props.autoPageSize), (_props$paginationMode = props.paginationModel) != null ? _props$paginationMode : (_props$initialState = props.initialState) == null ? void 0 : (_props$initialState$p = _props$initialState.pagination) == null ? void 0 : _props$initialState$p.paginationModel);
  throwIfPageSizeExceedsTheLimit(paginationModel.pageSize, props.signature);
  return _extends({}, state, {
    pagination: {
      paginationModel: paginationModel
    }
  });
};
var mergeStateWithPaginationModel = function mergeStateWithPaginationModel(rowCount, signature, paginationModelProp) {
  return function (paginationState) {
    var _paginationModelProp$;
    var paginationModel = paginationState.paginationModel;
    var pageSize = (_paginationModelProp$ = paginationModelProp == null ? void 0 : paginationModelProp.pageSize) != null ? _paginationModelProp$ : paginationModel.pageSize;
    var pageCount = getPageCount(rowCount, pageSize);
    if (paginationModelProp && ((paginationModelProp == null ? void 0 : paginationModelProp.page) !== paginationModel.page || (paginationModelProp == null ? void 0 : paginationModelProp.pageSize) !== paginationModel.pageSize)) {
      paginationModel = paginationModelProp;
    }
    var validPage = getValidPage(paginationModel.page, pageCount);
    if (validPage !== paginationModel.page) {
      paginationModel = _extends({}, paginationModel, {
        page: validPage
      });
    }
    throwIfPageSizeExceedsTheLimit(paginationModel.pageSize, signature);
    return {
      paginationModel: paginationModel
    };
  };
};

/**
 * @requires useGridFilter (state)
 * @requires useGridDimensions (event) - can be after
 */
export var useGridPagination = function useGridPagination(apiRef, props) {
  var _props$initialState3, _props$initialState3$;
  var logger = useGridLogger(apiRef, 'useGridPagination');
  var visibleTopLevelRowCount = useGridSelector(apiRef, gridFilteredTopLevelRowCountSelector);
  var densityFactor = useGridSelector(apiRef, gridDensityFactorSelector);
  var rowHeight = Math.floor(props.rowHeight * densityFactor);
  apiRef.current.registerControlState({
    stateId: 'pagination',
    propModel: props.paginationModel,
    propOnChange: props.onPaginationModelChange,
    stateSelector: gridPaginationModelSelector,
    changeEvent: 'paginationModelChange'
  });

  /**
   * API METHODS
   */
  var setPage = React.useCallback(function (page) {
    var currentModel = gridPaginationModelSelector(apiRef);
    if (page === currentModel.page) {
      return;
    }
    logger.debug("Setting page to ".concat(page));
    apiRef.current.setPaginationModel({
      page: page,
      pageSize: currentModel.pageSize
    });
  }, [apiRef, logger]);
  var setPageSize = React.useCallback(function (pageSize) {
    var currentModel = gridPaginationModelSelector(apiRef);
    if (pageSize === currentModel.pageSize) {
      return;
    }
    logger.debug("Setting page size to ".concat(pageSize));
    apiRef.current.setPaginationModel({
      pageSize: pageSize,
      page: currentModel.page
    });
  }, [apiRef, logger]);
  var setPaginationModel = React.useCallback(function (paginationModel) {
    var _props$rowCount;
    var currentModel = gridPaginationModelSelector(apiRef);
    if (paginationModel === currentModel) {
      return;
    }
    logger.debug("Setting 'paginationModel' to", paginationModel);
    apiRef.current.updateControlState('pagination', mergeStateWithPaginationModel((_props$rowCount = props.rowCount) != null ? _props$rowCount : visibleTopLevelRowCount, props.signature, paginationModel), 'setPaginationModel');
    apiRef.current.forceUpdate();
  }, [apiRef, logger, props.rowCount, props.signature, visibleTopLevelRowCount]);
  var pageApi = {
    setPage: setPage,
    setPageSize: setPageSize,
    setPaginationModel: setPaginationModel
  };
  useGridApiMethod(apiRef, pageApi, 'public');

  /**
   * PRE-PROCESSING
   */
  var stateExportPreProcessing = React.useCallback(function (prevState, context) {
    var _props$initialState2, _props$initialState2$;
    var paginationModel = gridPaginationModelSelector(apiRef);
    var shouldExportPaginationModel =
    // Always export if the `exportOnlyDirtyModels` property is not activated
    !context.exportOnlyDirtyModels ||
    // Always export if the `paginationModel` is controlled
    props.paginationModel != null ||
    // Always export if the `paginationModel` has been initialized
    ((_props$initialState2 = props.initialState) == null ? void 0 : (_props$initialState2$ = _props$initialState2.pagination) == null ? void 0 : _props$initialState2$.paginationModel) != null ||
    // Export if `page` or `pageSize` is not equal to the default value
    paginationModel.page !== 0 && paginationModel.pageSize !== defaultPageSize(props.autoPageSize);
    if (!shouldExportPaginationModel) {
      return prevState;
    }
    return _extends({}, prevState, {
      pagination: _extends({}, prevState.pagination, {
        paginationModel: paginationModel
      })
    });
  }, [apiRef, props.paginationModel, (_props$initialState3 = props.initialState) == null ? void 0 : (_props$initialState3$ = _props$initialState3.pagination) == null ? void 0 : _props$initialState3$.paginationModel, props.autoPageSize]);
  var stateRestorePreProcessing = React.useCallback(function (params, context) {
    var _context$stateToResto, _context$stateToResto2, _props$rowCount2;
    var paginationModel = (_context$stateToResto = context.stateToRestore.pagination) != null && _context$stateToResto.paginationModel ? _extends({}, getDefaultGridPaginationModel(props.autoPageSize), (_context$stateToResto2 = context.stateToRestore.pagination) == null ? void 0 : _context$stateToResto2.paginationModel) : gridPaginationModelSelector(apiRef);
    apiRef.current.updateControlState('pagination', mergeStateWithPaginationModel((_props$rowCount2 = props.rowCount) != null ? _props$rowCount2 : visibleTopLevelRowCount, props.signature, paginationModel), 'stateRestorePreProcessing');
    return params;
  }, [apiRef, props.autoPageSize, props.rowCount, props.signature, visibleTopLevelRowCount]);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

  /**
   * EVENTS
   */
  var handlePaginationModelChange = function handlePaginationModelChange() {
    var _apiRef$current$virtu;
    var paginationModel = gridPaginationModelSelector(apiRef);
    if ((_apiRef$current$virtu = apiRef.current.virtualScrollerRef) != null && _apiRef$current$virtu.current) {
      apiRef.current.scrollToIndexes({
        rowIndex: paginationModel.page * paginationModel.pageSize
      });
    }
    apiRef.current.forceUpdate();
  };
  var handleUpdateAutoPageSize = React.useCallback(function () {
    var dimensions = apiRef.current.getRootDimensions();
    if (!props.autoPageSize || !dimensions) {
      return;
    }
    var pinnedRowsHeight = calculatePinnedRowsHeight(apiRef);
    var maximumPageSizeWithoutScrollBar = Math.floor((dimensions.viewportInnerSize.height - pinnedRowsHeight.top - pinnedRowsHeight.bottom) / rowHeight);
    apiRef.current.setPageSize(maximumPageSizeWithoutScrollBar);
  }, [apiRef, props.autoPageSize, rowHeight]);
  useGridApiEventHandler(apiRef, 'viewportInnerSizeChange', handleUpdateAutoPageSize);
  useGridApiEventHandler(apiRef, 'paginationModelChange', handlePaginationModelChange);

  /**
   * EFFECTS
   */
  React.useEffect(function () {
    if (process.env.NODE_ENV !== 'production') {
      if (props.paginationMode === 'server' && props.rowCount == null) {
        noRowCountInServerMode();
      }
    }
  }, [props.rowCount, props.paginationMode]);
  React.useEffect(function () {
    var _props$rowCount3;
    apiRef.current.updateControlState('pagination', mergeStateWithPaginationModel((_props$rowCount3 = props.rowCount) != null ? _props$rowCount3 : visibleTopLevelRowCount, props.signature, props.paginationModel));
  }, [apiRef, props.paginationModel, props.rowCount, props.paginationMode, visibleTopLevelRowCount, props.signature]);
  React.useEffect(function () {
    handleUpdateAutoPageSize();
  }, [handleUpdateAutoPageSize]);
};