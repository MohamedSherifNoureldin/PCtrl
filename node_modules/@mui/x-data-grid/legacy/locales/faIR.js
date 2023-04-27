import { faIR as faIRCore } from '@mui/material/locale';
import { getGridLocalization } from '../utils/getGridLocalization';
var faIRGrid = {
  // Root
  noRowsLabel: 'بدون سطر',
  noResultsOverlayLabel: 'نتیجه ای پیدا نشد.',
  // Density selector toolbar button text
  toolbarDensity: 'تراکم',
  toolbarDensityLabel: 'تراکم',
  toolbarDensityCompact: 'فشرده',
  toolbarDensityStandard: 'استاندارد',
  toolbarDensityComfortable: 'راحت',
  // Columns selector toolbar button text
  toolbarColumns: 'ستون‌ها',
  toolbarColumnsLabel: 'ستون‌ها را انتخاب کنید',
  // Filters toolbar button text
  toolbarFilters: 'فیلترها',
  toolbarFiltersLabel: 'نمایش فیلترها',
  toolbarFiltersTooltipHide: 'مخفی کردن فیلترها',
  toolbarFiltersTooltipShow: 'نمایش فیلترها',
  toolbarFiltersTooltipActive: function toolbarFiltersTooltipActive(count) {
    return count !== 1 ? "".concat(count, " \u0641\u06CC\u0644\u062A\u0631\u0647\u0627\u06CC \u0641\u0639\u0627\u0644") : "".concat(count, " \u0641\u06CC\u0644\u062A\u0631 \u0641\u0639\u0627\u0644");
  },
  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'جستجو...',
  toolbarQuickFilterLabel: 'جستجو',
  toolbarQuickFilterDeleteIconLabel: 'حذف',
  // Export selector toolbar button text
  toolbarExport: 'خروجی',
  toolbarExportLabel: 'خروجی',
  toolbarExportCSV: 'دانلود به صورت CSV',
  toolbarExportPrint: 'چاپ',
  toolbarExportExcel: 'دانلود به صورت اکسل',
  // Columns panel text
  columnsPanelTextFieldLabel: 'پیداکردن ستون',
  columnsPanelTextFieldPlaceholder: 'عنوان ستون',
  columnsPanelDragIconLabel: 'جا‌به‌جایی ستون',
  columnsPanelShowAllButton: 'نمایش همه',
  columnsPanelHideAllButton: 'مخفی همه',
  // Filter panel text
  filterPanelAddFilter: 'افزودن فیلتر',
  filterPanelRemoveAll: 'حذف همه',
  filterPanelDeleteIconLabel: 'حذف',
  filterPanelLogicOperator: 'عملگر منطقی',
  filterPanelOperator: 'عملگرها',
  filterPanelOperatorAnd: 'و',
  filterPanelOperatorOr: 'یا',
  filterPanelColumns: 'ستون‌ها',
  filterPanelInputLabel: 'مقدار',
  filterPanelInputPlaceholder: 'فیلتر مقدار',
  // Filter operators text
  filterOperatorContains: 'شامل',
  filterOperatorEquals: 'مساوی',
  filterOperatorStartsWith: 'شروع با',
  filterOperatorEndsWith: 'پایان با',
  filterOperatorIs: 'هست',
  filterOperatorNot: 'نیست',
  filterOperatorAfter: 'بعد از',
  filterOperatorOnOrAfter: 'معادل یا بعدش',
  filterOperatorBefore: 'قبلش',
  filterOperatorOnOrBefore: 'معادل یا قبلش',
  filterOperatorIsEmpty: 'خالی است',
  filterOperatorIsNotEmpty: 'خالی نیست',
  filterOperatorIsAnyOf: 'هر یک از',
  // Filter values text
  filterValueAny: 'هرچیزی',
  filterValueTrue: 'صحیح',
  filterValueFalse: 'غلط',
  // Column menu text
  columnMenuLabel: 'فهرست',
  columnMenuShowColumns: 'نمایش ستون‌ها',
  columnMenuManageColumns: 'مدیریت ستون‌ها',
  columnMenuFilter: 'فیلتر',
  columnMenuHideColumn: 'مخفی',
  columnMenuUnsort: 'نامرتب‌کردن',
  columnMenuSortAsc: 'مرتب‌کردن صعودی',
  columnMenuSortDesc: 'مرتب‌کردن نزولی',
  // Column header text
  columnHeaderFiltersTooltipActive: function columnHeaderFiltersTooltipActive(count) {
    return count !== 1 ? "".concat(count, " \u0641\u06CC\u0644\u062A\u0631\u200C\u0647\u0627\u06CC \u0641\u0639\u0627\u0644") : "".concat(count, " \u0641\u06CC\u0644\u062A\u0631 \u0641\u0639\u0627\u0644");
  },
  columnHeaderFiltersLabel: 'نمایش فیلترها',
  columnHeaderSortIconLabel: 'مرتب‌کردن',
  // Rows selected footer text
  footerRowSelected: function footerRowSelected(count) {
    return count !== 1 ? "".concat(count.toLocaleString(), " \u0633\u0637\u0631\u0647\u0627\u06CC \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u062F\u0647") : "".concat(count.toLocaleString(), " \u0633\u0637\u0631 \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u062F\u0647");
  },
  // Total row amount footer text
  footerTotalRows: 'مجموع سطرها:',
  // Total visible row amount footer text
  footerTotalVisibleRows: function footerTotalVisibleRows(visibleCount, totalCount) {
    return "".concat(visibleCount.toLocaleString(), " \u0627\u0632 ").concat(totalCount.toLocaleString());
  },
  // Checkbox selection text
  checkboxSelectionHeaderName: 'چک‌باکس انتخاب',
  checkboxSelectionSelectAllRows: 'انتخاب همه‌ی ردیف‌ها',
  checkboxSelectionUnselectAllRows: 'لغو انتخاب همه‌ی ردیف‌ها',
  checkboxSelectionSelectRow: 'انتخاب ردیف',
  checkboxSelectionUnselectRow: 'لغو انتخاب ردیف',
  // Boolean cell text
  booleanCellTrueLabel: 'صحیح',
  booleanCellFalseLabel: 'غلط',
  // Actions cell more text
  actionsCellMore: 'بیشتر',
  // Column pinning text
  pinToLeft: 'سنجاق کردن به چپ',
  pinToRight: 'سنجاق کردن به راست',
  unpin: 'برداشتن سنجاق',
  // Tree Data
  treeDataGroupingHeaderName: 'گروه‌بندی',
  treeDataExpand: 'نمایش فرزندان',
  treeDataCollapse: 'پنهان‌سازی فرزندان',
  // Grouping columns
  groupingColumnHeaderName: 'گروه‌بندی',
  groupColumn: function groupColumn(name) {
    return "\u06AF\u0631\u0648\u0647\u200C\u0628\u0646\u062F\u06CC \u0628\u0631\u0627\u0633\u0627\u0633 ".concat(name);
  },
  unGroupColumn: function unGroupColumn(name) {
    return "\u0644\u063A\u0648 \u06AF\u0631\u0648\u0647\u200C\u0628\u0646\u062F\u06CC \u0628\u0631\u0627\u0633\u0627\u0633 ".concat(name);
  },
  // Master/detail
  detailPanelToggle: 'پنل جزئیات',
  expandDetailPanel: 'بازکردن پنل جزئیات',
  collapseDetailPanel: 'بستن پنل جزئیات',
  // Row reordering text
  rowReorderingHeaderName: 'ترتیب مجدد سطر',
  // Aggregation
  aggregationMenuItemHeader: 'تجمیع',
  aggregationFunctionLabelSum: 'جمع',
  aggregationFunctionLabelAvg: 'میانگین',
  aggregationFunctionLabelMin: 'حداقل',
  aggregationFunctionLabelMax: 'حداکثر',
  aggregationFunctionLabelSize: 'اندازه'
};
export var faIR = getGridLocalization(faIRGrid, faIRCore);