import { viVN as viVNCore } from '@mui/material/locale';
import { getGridLocalization } from '../utils/getGridLocalization';
var viVNGrid = {
  // Root
  noRowsLabel: 'Không có dữ liệu',
  noResultsOverlayLabel: 'Không tìm thấy kết quả.',
  // Density selector toolbar button text
  toolbarDensity: 'Độ giãn',
  toolbarDensityLabel: 'Độ giãn',
  toolbarDensityCompact: 'Trung bình',
  toolbarDensityStandard: 'Tiêu chuẩn',
  toolbarDensityComfortable: 'Rộng',
  // Columns selector toolbar button text
  toolbarColumns: 'Cột',
  toolbarColumnsLabel: 'Chọn cột',
  // Filters toolbar button text
  toolbarFilters: 'Bộ lọc',
  toolbarFiltersLabel: 'Hiển thị bộ lọc',
  toolbarFiltersTooltipHide: 'Ẩn',
  toolbarFiltersTooltipShow: 'Hiện',
  toolbarFiltersTooltipActive: function toolbarFiltersTooltipActive(count) {
    return count > 1 ? "".concat(count, " b\u1ED9 l\u1ECDc ho\u1EA1t \u0111\u1ED9ng") : "".concat(count, " b\u1ED9 l\u1ECDc ho\u1EA1t \u0111\u1ED9ng");
  },
  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Tìm kiếm…',
  toolbarQuickFilterLabel: 'Tìm kiếm',
  toolbarQuickFilterDeleteIconLabel: 'Xóa tìm kiếm',
  // Export selector toolbar button text
  toolbarExport: 'Xuất',
  toolbarExportLabel: 'Xuất',
  toolbarExportCSV: 'Xuất CSV',
  toolbarExportPrint: 'In',
  toolbarExportExcel: 'Xuất Excel',
  // Columns panel text
  columnsPanelTextFieldLabel: 'Tìm kiếm',
  columnsPanelTextFieldPlaceholder: 'Tiêu đề cột',
  columnsPanelDragIconLabel: 'Sắp xếp',
  columnsPanelShowAllButton: 'Hiện tất cả',
  columnsPanelHideAllButton: 'Ẩn tất cả',
  // Filter panel text
  filterPanelAddFilter: 'Thêm bộ lọc',
  // filterPanelRemoveAll: 'Remove all',
  filterPanelDeleteIconLabel: 'Xóa',
  filterPanelLogicOperator: 'Toán tử logic',
  filterPanelOperator: 'Toán tử',
  filterPanelOperatorAnd: 'Và',
  filterPanelOperatorOr: 'Hoặc',
  filterPanelColumns: 'Cột',
  filterPanelInputLabel: 'Giá trị',
  filterPanelInputPlaceholder: 'Lọc giá trị',
  // Filter operators text
  filterOperatorContains: 'Chứa',
  filterOperatorEquals: 'Bằng',
  filterOperatorStartsWith: 'Bắt đầu bằng',
  filterOperatorEndsWith: 'Kết thúc bằng',
  filterOperatorIs: 'Là',
  filterOperatorNot: 'Không là',
  filterOperatorAfter: 'Trước',
  filterOperatorOnOrAfter: 'bằng hoặc sau',
  filterOperatorBefore: 'Sau',
  filterOperatorOnOrBefore: 'bằng hoặc trước',
  filterOperatorIsEmpty: 'Rỗng',
  filterOperatorIsNotEmpty: 'Khác rỗng',
  // filterOperatorIsAnyOf: 'is any of',

  // Filter values text
  filterValueAny: 'bất kỳ giá trị nào',
  filterValueTrue: 'Có',
  filterValueFalse: 'Không',
  // Column menu text
  columnMenuLabel: 'Danh mục',
  columnMenuShowColumns: 'Danh sách cột',
  // columnMenuManageColumns: 'Manage columns',
  columnMenuFilter: 'Bộ lọc',
  columnMenuHideColumn: 'Ẩn cột',
  columnMenuUnsort: 'Bỏ sắp xếp',
  columnMenuSortAsc: 'Sắp xếp tăng dần',
  columnMenuSortDesc: 'Sắp xếp giảm dần',
  // Column header text
  columnHeaderFiltersTooltipActive: function columnHeaderFiltersTooltipActive(count) {
    return count > 1 ? "".concat(count, " b\u1ED9 l\u1ECDc ho\u1EA1t \u0111\u1ED9ng") : "".concat(count, " b\u1ED9 l\u1ECDc ho\u1EA1t \u0111\u1ED9ng");
  },
  columnHeaderFiltersLabel: 'Bộ lọc',
  columnHeaderSortIconLabel: 'Sắp xếp',
  // Rows selected footer text
  footerRowSelected: function footerRowSelected(count) {
    return count > 1 ? "".concat(count.toLocaleString(), " h\xE0ng \u0111\xE3 ch\u1ECDn") : "".concat(count.toLocaleString(), " h\xE0ng \u0111\xE3 ch\u1ECDn");
  },
  // Total row amount footer text
  footerTotalRows: 'Tổng:',
  // Total visible row amount footer text
  footerTotalVisibleRows: function footerTotalVisibleRows(visibleCount, totalCount) {
    return "".concat(visibleCount.toLocaleString(), " / ").concat(totalCount.toLocaleString());
  },
  // Checkbox selection text
  checkboxSelectionHeaderName: 'Tích vào ô trống',
  checkboxSelectionSelectAllRows: 'Chọn tất cả hàng',
  checkboxSelectionUnselectAllRows: 'Bỏ chọn tất cả hàng',
  checkboxSelectionSelectRow: 'Chọn hàng',
  checkboxSelectionUnselectRow: 'Bỏ chọn hàng',
  // Boolean cell text
  booleanCellTrueLabel: 'Có',
  booleanCellFalseLabel: 'Không',
  // Actions cell more text
  actionsCellMore: 'Thêm',
  // Column pinning text
  pinToLeft: 'Ghim cột bên trái',
  pinToRight: 'Ghim cột bên phải',
  unpin: 'Bỏ ghim',
  // Tree Data
  treeDataGroupingHeaderName: 'Nhóm',
  treeDataExpand: 'mở rộng',
  treeDataCollapse: 'ẩn đi',
  // Grouping columns
  groupingColumnHeaderName: 'Nhóm',
  groupColumn: function groupColumn(name) {
    return "Nh\xF3m theo ".concat(name);
  },
  unGroupColumn: function unGroupColumn(name) {
    return "H\u1EE7y nh\xF3m theo ".concat(name);
  },
  // Master/detail
  detailPanelToggle: 'Ẩn/hiện chi tiết',
  expandDetailPanel: 'Mở rộng',
  collapseDetailPanel: 'Thu nhỏ',
  // Row reordering text
  rowReorderingHeaderName: 'Sắp xếp hàng'

  // Aggregation
  // aggregationMenuItemHeader: 'Aggregation',
  // aggregationFunctionLabelSum: 'sum',
  // aggregationFunctionLabelAvg: 'avg',
  // aggregationFunctionLabelMin: 'min',
  // aggregationFunctionLabelMax: 'max',
  // aggregationFunctionLabelSize: 'size',
};

export var viVN = getGridLocalization(viVNGrid, viVNCore);