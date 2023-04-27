"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwIfPageSizeExceedsTheLimit = exports.noRowCountInServerMode = exports.getValidPage = exports.getPageCount = exports.getDefaultGridPaginationModel = exports.defaultPageSize = void 0;
var _warning = require("../../../utils/warning");
var _utils = require("../../utils");
const MAX_PAGE_SIZE = 100;
const defaultPageSize = autoPageSize => autoPageSize ? 0 : 100;
exports.defaultPageSize = defaultPageSize;
const getPageCount = (rowCount, pageSize) => {
  if (pageSize > 0 && rowCount > 0) {
    return Math.ceil(rowCount / pageSize);
  }
  return 0;
};
exports.getPageCount = getPageCount;
const noRowCountInServerMode = (0, _warning.buildWarning)(["MUI: the 'rowCount' prop is undefined while using paginationMode='server'", 'For more detail, see http://mui.com/components/data-grid/pagination/#basic-implementation'], 'error');
exports.noRowCountInServerMode = noRowCountInServerMode;
const getDefaultGridPaginationModel = autoPageSize => ({
  page: 0,
  pageSize: autoPageSize ? 0 : 100
});
exports.getDefaultGridPaginationModel = getDefaultGridPaginationModel;
const getValidPage = (page, pageCount = 0) => {
  if (pageCount === 0) {
    return page;
  }
  return Math.max(Math.min(page, pageCount - 1), 0);
};
exports.getValidPage = getValidPage;
const throwIfPageSizeExceedsTheLimit = (pageSize, signatureProp) => {
  if (signatureProp === _utils.GridSignature.DataGrid && pageSize > MAX_PAGE_SIZE) {
    throw new Error(['MUI: `pageSize` cannot exceed 100 in the MIT version of the DataGrid.', 'You need to upgrade to DataGridPro or DataGridPremium component to unlock this feature.'].join('\n'));
  }
};
exports.throwIfPageSizeExceedsTheLimit = throwIfPageSizeExceedsTheLimit;