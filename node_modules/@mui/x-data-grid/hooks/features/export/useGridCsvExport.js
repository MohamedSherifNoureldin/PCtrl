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
export const useGridCsvExport = apiRef => {
  const logger = useGridLogger(apiRef, 'useGridCsvExport');
  const getDataAsCsv = React.useCallback((options = {}) => {
    var _options$getRowsToExp, _options$includeHeade;
    logger.debug(`Get data as CSV`);
    const exportedColumns = getColumnsToExport({
      apiRef,
      options
    });
    const getRowsToExport = (_options$getRowsToExp = options.getRowsToExport) != null ? _options$getRowsToExp : defaultGetRowsToExport;
    const exportedRowIds = getRowsToExport({
      apiRef
    });
    return buildCSV({
      columns: exportedColumns,
      rowIds: exportedRowIds,
      getCellParams: apiRef.current.getCellParams,
      delimiterCharacter: options.delimiter || ',',
      includeHeaders: (_options$includeHeade = options.includeHeaders) != null ? _options$includeHeade : true
    });
  }, [logger, apiRef]);
  const exportDataAsCsv = React.useCallback(options => {
    logger.debug(`Export data as CSV`);
    const csv = getDataAsCsv(options);
    const blob = new Blob([options != null && options.utf8WithBom ? new Uint8Array([0xef, 0xbb, 0xbf]) : '', csv], {
      type: 'text/csv'
    });
    exportAs(blob, 'csv', options == null ? void 0 : options.fileName);
  }, [logger, getDataAsCsv]);
  const csvExportApi = {
    getDataAsCsv,
    exportDataAsCsv
  };
  useGridApiMethod(apiRef, csvExportApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const addExportMenuButtons = React.useCallback((initialValue, options) => {
    var _options$csvOptions;
    if ((_options$csvOptions = options.csvOptions) != null && _options$csvOptions.disableToolbarButton) {
      return initialValue;
    }
    return [...initialValue, {
      component: /*#__PURE__*/_jsx(GridCsvExportMenuItem, {
        options: options.csvOptions
      }),
      componentName: 'csvExport'
    }];
  }, []);
  useGridRegisterPipeProcessor(apiRef, 'exportMenu', addExportMenuButtons);
};