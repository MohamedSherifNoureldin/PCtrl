export var isEscapeKey = function isEscapeKey(key) {
  return key === 'Escape';
}; // TODO remove
export var isEnterKey = function isEnterKey(key) {
  return key === 'Enter';
}; // TODO remove
export var isTabKey = function isTabKey(key) {
  return key === 'Tab';
}; // TODO remove

export var isSpaceKey = function isSpaceKey(key) {
  return key === ' ';
};
export var isArrowKeys = function isArrowKeys(key) {
  return key.indexOf('Arrow') === 0;
};
export var isHomeOrEndKeys = function isHomeOrEndKeys(key) {
  return key === 'Home' || key === 'End';
};
export var isPageKeys = function isPageKeys(key) {
  return key.indexOf('Page') === 0;
};
export var isDeleteKeys = function isDeleteKeys(key) {
  return key === 'Delete' || key === 'Backspace';
};

// Non printable keys have a name, e.g. "ArrowRight", see the whole list:
// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
// We need to ignore shortcuts, for example: select all:
// - Windows: Ctrl+A, event.ctrlKey is true
// - macOS: ⌘ Command+A, event.metaKey is true
export function isPrintableKey(event) {
  return event.key.length === 1 && event.ctrlKey === false && event.metaKey === false;
}
export var GRID_MULTIPLE_SELECTION_KEYS = ['Meta', 'Control', 'Shift'];
export var GRID_CELL_EXIT_EDIT_MODE_KEYS = ['Enter', 'Escape', 'Tab'];
export var GRID_CELL_EDIT_COMMIT_KEYS = ['Enter', 'Tab'];
export var isMultipleKey = function isMultipleKey(key) {
  return GRID_MULTIPLE_SELECTION_KEYS.indexOf(key) > -1;
};
export var isCellEnterEditModeKeys = function isCellEnterEditModeKeys(event) {
  return isEnterKey(event.key) || isDeleteKeys(event.key) || isPrintableKey(event);
};
export var isCellExitEditModeKeys = function isCellExitEditModeKeys(key) {
  return GRID_CELL_EXIT_EDIT_MODE_KEYS.indexOf(key) > -1;
};
export var isCellEditCommitKeys = function isCellEditCommitKeys(key) {
  return GRID_CELL_EDIT_COMMIT_KEYS.indexOf(key) > -1;
};
export var isNavigationKey = function isNavigationKey(key) {
  return isHomeOrEndKeys(key) || isArrowKeys(key) || isPageKeys(key) || isSpaceKey(key);
};
export var isKeyboardEvent = function isKeyboardEvent(event) {
  return !!event.key;
};
export var isHideMenuKey = function isHideMenuKey(key) {
  return isTabKey(key) || isEscapeKey(key);
};