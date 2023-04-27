import * as React from 'react';
import { useGridApiMethod, useGridNativeEventListener } from '../../utils';
function writeToClipboardPolyfill(data) {
  const span = document.createElement('span');
  span.style.whiteSpace = 'pre';
  span.style.userSelect = 'all';
  span.style.opacity = '0px';
  span.textContent = data;
  document.body.appendChild(span);
  const range = document.createRange();
  range.selectNode(span);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(span);
  }
}
function hasNativeSelection(element) {
  // When getSelection is called on an <iframe> that is not displayed Firefox will return null.
  if (window.getSelection()?.toString()) {
    return true;
  }

  // window.getSelection() returns an empty string in Firefox for selections inside a form element.
  // See: https://bugzilla.mozilla.org/show_bug.cgi?id=85686.
  // Instead, we can use element.selectionStart that is only defined on form elements.
  if (element && (element.selectionEnd || 0) - (element.selectionStart || 0) > 0) {
    return true;
  }
  return false;
}

/**
 * @requires useGridCsvExport (method)
 * @requires useGridSelection (method)
 */
export const useGridClipboard = apiRef => {
  const copySelectedRowsToClipboard = React.useCallback(() => {
    if (apiRef.current.getSelectedRows().size === 0) {
      return;
    }
    const data = apiRef.current.getDataAsCsv({
      includeHeaders: false,
      delimiter: '\t'
    });
    if (navigator.clipboard) {
      navigator.clipboard.writeText(data).catch(() => {
        writeToClipboardPolyfill(data);
      });
    } else {
      writeToClipboardPolyfill(data);
    }
  }, [apiRef]);
  const handleKeydown = React.useCallback(event => {
    const isModifierKeyPressed = event.ctrlKey || event.metaKey;
    // event.code === 'KeyC' is not enough as event.code assume a QWERTY keyboard layout which would
    // be wrong with a Dvorak keyboard (as if pressing J).
    if (String.fromCharCode(event.keyCode) !== 'C' || !isModifierKeyPressed) {
      return;
    }

    // Do nothing if there's a native selection
    if (hasNativeSelection(event.target)) {
      return;
    }
    apiRef.current.unstable_copySelectedRowsToClipboard();
  }, [apiRef]);
  useGridNativeEventListener(apiRef, apiRef.current.rootElementRef, 'keydown', handleKeydown);
  const clipboardApi = {
    unstable_copySelectedRowsToClipboard: copySelectedRowsToClipboard
  };
  useGridApiMethod(apiRef, clipboardApi, 'public');
};