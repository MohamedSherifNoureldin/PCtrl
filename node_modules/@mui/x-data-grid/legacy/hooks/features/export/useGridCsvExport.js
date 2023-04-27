import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import * as React from 'react';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { exportAs } from '../../../utils/exportAs';
import { buildCSV } from './serializers/csvSerializer';
import { getColumnsToExport, defaultGetRowsToExport } from './utils';
import { useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { GridCsvExportMenuItem } from '../../../components/toolbar/GridToolbarExport';

/**
 * @requires useGridColumns (state)
 * @requires useGridFilter (state)
 * @requires useGridSorting (state)
 * @requires useGridSelection (state)
 * @requires useGridParamsApi (method)
 */
import { jsx as _jsx } from "react/jsx-runtime";
export var useGridCsvExport = function useGridCsvExport(apiRef) {
  var logger = useGridLogger(apiRef, 'useGridCsvExport');
  var getDataAsCsv = React.useCallback(function () {
    var _options$getRowsToExp, _options$includeHeade;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    logger.debug("Get data as CSV");
    var exportedColumns = getColumnsToExport({
      apiRef: apiRef,
      options: options
    });
    var getRowsToExport = (_options$getRowsToExp = options.getRowsToExport) != null ? _options$getRowsToExp : defaultGetRowsToExport;
    var exportedRowIds = getRowsToExport({
      apiRef: apiRef
    });
    return buildCSV({
      columns: exportedColumns,
      rowIds: exportedRowIds,
      getCellParams: apiRef.current.getCellParams,
      delimiterCharacter: options.delimiter || ',',
      includeHeaders: (_options$includeHeade = options.includeHeaders) != null ? _options$includeHeade : true
    });
  }, [logger, apiRef]);
  var exportDataAsCsv = React.useCallback(function (options) {
    logger.debug("Export data as CSV");
    var csv = getDataAsCsv(options);
    var blob = new Blob([options != null && options.utf8WithBom ? new Uint8Array([0xef, 0xbb, 0xbf]) : '', csv], {
      type: 'text/csv'
    });
    exportAs(blob, 'csv', options == null ? void 0 : options.fileName);
  }, [logger, getDataAsCsv]);
  var csvExportApi = {
    getDataAsCsv: getDataAsCsv,
    exportDataAsCsv: exportDataAsCsv
  };
  useGridApiMethod(apiRef, csvExportApi, 'public');

  /**
   * PRE-PROCESSING
   */
  var addExportMenuButtons = React.useCallback(function (initialValue, options) {
    var _options$csvOptions;
    if ((_options$csvOptions = options.csvOptions) != null && _options$csvOptions.disableToolbarButton) {
      return initialValue;
    }
    return [].concat(_toConsumableArray(initialValue), [{
      component: /*#__PURE__*/_jsx(GridCsvExportMenuItem, {
        options: options.csvOptions
      }),
      componentName: 'csvExport'
    }]);
  }, []);
  useGridRegisterPipeProcessor(apiRef, 'exportMenu', addExportMenuButtons);
};