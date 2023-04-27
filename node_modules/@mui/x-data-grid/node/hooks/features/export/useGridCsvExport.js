"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridCsvExport = void 0;
var React = _interopRequireWildcard(require("react"));
var _useGridApiMethod = require("../../utils/useGridApiMethod");
var _useGridLogger = require("../../utils/useGridLogger");
var _exportAs = require("../../../utils/exportAs");
var _csvSerializer = require("./serializers/csvSerializer");
var _utils = require("./utils");
var _pipeProcessing = require("../../core/pipeProcessing");
var _GridToolbarExport = require("../../../components/toolbar/GridToolbarExport");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/**
 * @requires useGridColumns (state)
 * @requires useGridFilter (state)
 * @requires useGridSorting (state)
 * @requires useGridSelection (state)
 * @requires useGridParamsApi (method)
 */
const useGridCsvExport = apiRef => {
  const logger = (0, _useGridLogger.useGridLogger)(apiRef, 'useGridCsvExport');
  const getDataAsCsv = React.useCallback((options = {}) => {
    logger.debug(`Get data as CSV`);
    const exportedColumns = (0, _utils.getColumnsToExport)({
      apiRef,
      options
    });
    const getRowsToExport = options.getRowsToExport ?? _utils.defaultGetRowsToExport;
    const exportedRowIds = getRowsToExport({
      apiRef
    });
    return (0, _csvSerializer.buildCSV)({
      columns: exportedColumns,
      rowIds: exportedRowIds,
      getCellParams: apiRef.current.getCellParams,
      delimiterCharacter: options.delimiter || ',',
      includeHeaders: options.includeHeaders ?? true
    });
  }, [logger, apiRef]);
  const exportDataAsCsv = React.useCallback(options => {
    logger.debug(`Export data as CSV`);
    const csv = getDataAsCsv(options);
    const blob = new Blob([options?.utf8WithBom ? new Uint8Array([0xef, 0xbb, 0xbf]) : '', csv], {
      type: 'text/csv'
    });
    (0, _exportAs.exportAs)(blob, 'csv', options?.fileName);
  }, [logger, getDataAsCsv]);
  const csvExportApi = {
    getDataAsCsv,
    exportDataAsCsv
  };
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, csvExportApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const addExportMenuButtons = React.useCallback((initialValue, options) => {
    if (options.csvOptions?.disableToolbarButton) {
      return initialValue;
    }
    return [...initialValue, {
      component: /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridToolbarExport.GridCsvExportMenuItem, {
        options: options.csvOptions
      }),
      componentName: 'csvExport'
    }];
  }, []);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'exportMenu', addExportMenuButtons);
};
exports.useGridCsvExport = useGridCsvExport;