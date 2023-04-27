import { buildWarning } from '../../../utils/warning';
import { GridSignature } from '../../utils';
var MAX_PAGE_SIZE = 100;
export var defaultPageSize = function defaultPageSize(autoPageSize) {
  return autoPageSize ? 0 : 100;
};
export var getPageCount = function getPageCount(rowCount, pageSize) {
  if (pageSize > 0 && rowCount > 0) {
    return Math.ceil(rowCount / pageSize);
  }
  return 0;
};
export var noRowCountInServerMode = buildWarning(["MUI: the 'rowCount' prop is undefined while using paginationMode='server'", 'For more detail, see http://mui.com/components/data-grid/pagination/#basic-implementation'], 'error');
export var getDefaultGridPaginationModel = function getDefaultGridPaginationModel(autoPageSize) {
  return {
    page: 0,
    pageSize: autoPageSize ? 0 : 100
  };
};
export var getValidPage = function getValidPage(page) {
  var pageCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (pageCount === 0) {
    return page;
  }
  return Math.max(Math.min(page, pageCount - 1), 0);
};
export var throwIfPageSizeExceedsTheLimit = function throwIfPageSizeExceedsTheLimit(pageSize, signatureProp) {
  if (signatureProp === GridSignature.DataGrid && pageSize > MAX_PAGE_SIZE) {
    throw new Error(['MUI: `pageSize` cannot exceed 100 in the MIT version of the DataGrid.', 'You need to upgrade to DataGridPro or DataGridPremium component to unlock this feature.'].join('\n'));
  }
};