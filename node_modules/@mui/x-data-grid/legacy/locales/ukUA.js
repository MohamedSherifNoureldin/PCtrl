import { ukUA as ukUACore } from '@mui/material/locale';
import { getGridLocalization } from '../utils/getGridLocalization';
var getPluralForm = function getPluralForm(count, options) {
  var pluralForm = options.many;
  var lastDigit = count % 10;
  if (lastDigit > 1 && lastDigit < 5) {
    pluralForm = options.few;
  } else if (lastDigit === 1) {
    pluralForm = options.one;
  }
  return "".concat(count, " ").concat(pluralForm);
};
var ukUAGrid = {
  // Root
  noRowsLabel: 'Немає рядків',
  noResultsOverlayLabel: 'Дані не знайдено.',
  // Density selector toolbar button text
  toolbarDensity: 'Висота рядка',
  toolbarDensityLabel: 'Висота рядка',
  toolbarDensityCompact: 'Компактний',
  toolbarDensityStandard: 'Стандартний',
  toolbarDensityComfortable: 'Комфортний',
  // Columns selector toolbar button text
  toolbarColumns: 'Стовпці',
  toolbarColumnsLabel: 'Виділіть стовпці',
  // Filters toolbar button text
  toolbarFilters: 'Фільтри',
  toolbarFiltersLabel: 'Показати фільтри',
  toolbarFiltersTooltipHide: 'Приховати фільтри',
  toolbarFiltersTooltipShow: 'Показати фільтри',
  toolbarFiltersTooltipActive: function toolbarFiltersTooltipActive(count) {
    return getPluralForm(count, {
      one: 'активний фільтр',
      few: 'активні фільтри',
      many: 'активних фільтрів'
    });
  },
  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Пошук…',
  toolbarQuickFilterLabel: 'Пошук',
  toolbarQuickFilterDeleteIconLabel: 'Очистити',
  // Export selector toolbar button text
  toolbarExport: 'Експорт',
  toolbarExportLabel: 'Експорт',
  toolbarExportCSV: 'Завантажити у форматі CSV',
  toolbarExportPrint: 'Друк',
  toolbarExportExcel: 'Завантажити у форматі Excel',
  // Columns panel text
  columnsPanelTextFieldLabel: 'Знайти стовпець',
  columnsPanelTextFieldPlaceholder: 'Заголовок стовпця',
  columnsPanelDragIconLabel: 'Змінити порядок стовпця',
  columnsPanelShowAllButton: 'Показати всі',
  columnsPanelHideAllButton: 'Приховати всі',
  // Filter panel text
  filterPanelAddFilter: 'Додати фільтр',
  // filterPanelRemoveAll: 'Remove all',
  filterPanelDeleteIconLabel: 'Видалити',
  filterPanelLogicOperator: 'Логічна функція',
  filterPanelOperator: 'Оператори',
  filterPanelOperatorAnd: 'І',
  filterPanelOperatorOr: 'Або',
  filterPanelColumns: 'Стовпці',
  filterPanelInputLabel: 'Значення',
  filterPanelInputPlaceholder: 'Значення фільтра',
  // Filter operators text
  filterOperatorContains: 'містить',
  filterOperatorEquals: 'дорівнює',
  filterOperatorStartsWith: 'починається з',
  filterOperatorEndsWith: 'закінчується на',
  filterOperatorIs: 'дорівнює',
  filterOperatorNot: 'не дорівнює',
  filterOperatorAfter: 'більше ніж',
  filterOperatorOnOrAfter: 'більше або дорівнює',
  filterOperatorBefore: 'менше ніж',
  filterOperatorOnOrBefore: 'менше або дорівнює',
  filterOperatorIsEmpty: 'порожній',
  filterOperatorIsNotEmpty: 'не порожній',
  filterOperatorIsAnyOf: 'будь-що із',
  // Filter values text
  filterValueAny: 'будь-який',
  filterValueTrue: 'так',
  filterValueFalse: 'ні',
  // Column menu text
  columnMenuLabel: 'Меню',
  columnMenuShowColumns: 'Показати стовпці',
  // columnMenuManageColumns: 'Manage columns',
  columnMenuFilter: 'Фільтр',
  columnMenuHideColumn: 'Приховати',
  columnMenuUnsort: 'Скасувати сортування',
  columnMenuSortAsc: 'Сортувати за зростанням',
  columnMenuSortDesc: 'Сортувати за спаданням',
  // Column header text
  columnHeaderFiltersTooltipActive: function columnHeaderFiltersTooltipActive(count) {
    return getPluralForm(count, {
      one: 'активний фільтр',
      few: 'активні фільтри',
      many: 'активних фільтрів'
    });
  },
  columnHeaderFiltersLabel: 'Показати фільтри',
  columnHeaderSortIconLabel: 'Сортувати',
  // Rows selected footer text
  footerRowSelected: function footerRowSelected(count) {
    return getPluralForm(count, {
      one: 'вибраний рядок',
      few: 'вибрані рядки',
      many: 'вибраних рядків'
    });
  },
  // Total row amount footer text
  footerTotalRows: 'Усього рядків:',
  // Total visible row amount footer text
  footerTotalVisibleRows: function footerTotalVisibleRows(visibleCount, totalCount) {
    return "".concat(visibleCount.toLocaleString(), " \u0437 ").concat(totalCount.toLocaleString());
  },
  // Checkbox selection text
  checkboxSelectionHeaderName: 'Вибір прапорця',
  checkboxSelectionSelectAllRows: 'Вибрати всі рядки',
  checkboxSelectionUnselectAllRows: 'Скасувати вибір всіх рядків',
  checkboxSelectionSelectRow: 'Вибрати рядок',
  checkboxSelectionUnselectRow: 'Скасувати вибір рядка',
  // Boolean cell text
  booleanCellTrueLabel: 'так',
  booleanCellFalseLabel: 'ні',
  // Actions cell more text
  actionsCellMore: 'більше',
  // Column pinning text
  pinToLeft: 'Закріпити ліворуч',
  pinToRight: 'Закріпити праворуч',
  unpin: 'Відкріпити',
  // Tree Data
  treeDataGroupingHeaderName: 'Група',
  treeDataExpand: 'показати дочірні елементи',
  treeDataCollapse: 'приховати дочірні елементи',
  // Grouping columns
  groupingColumnHeaderName: 'Група',
  groupColumn: function groupColumn(name) {
    return "\u0413\u0440\u0443\u043F\u0443\u0432\u0430\u0442\u0438 \u0437\u0430 ".concat(name);
  },
  unGroupColumn: function unGroupColumn(name) {
    return "\u0412\u0456\u0434\u043C\u0456\u043D\u0438\u0442\u0438 \u0433\u0440\u0443\u043F\u0443\u0432\u0430\u043D\u043D\u044F \u0437\u0430 ".concat(name);
  },
  // Master/detail
  detailPanelToggle: 'Перемикач панелі деталей',
  expandDetailPanel: 'Показати',
  collapseDetailPanel: 'Приховати',
  // Row reordering text
  rowReorderingHeaderName: 'Порядок рядків',
  // Aggregation
  aggregationMenuItemHeader: 'Агрегація'
  // aggregationFunctionLabelSum: 'sum',
  // aggregationFunctionLabelAvg: 'avg',
  // aggregationFunctionLabelMin: 'min',
  // aggregationFunctionLabelMax: 'max',
  // aggregationFunctionLabelSize: 'size',
};

export var ukUA = getGridLocalization(ukUAGrid, ukUACore);