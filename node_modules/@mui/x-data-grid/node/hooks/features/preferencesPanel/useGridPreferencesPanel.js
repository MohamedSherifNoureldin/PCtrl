"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridPreferencesPanel = exports.preferencePanelStateInitializer = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _useGridApiMethod = require("../../utils/useGridApiMethod");
var _useGridLogger = require("../../utils/useGridLogger");
var _pipeProcessing = require("../../core/pipeProcessing");
var _gridPreferencePanelSelector = require("./gridPreferencePanelSelector");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const preferencePanelStateInitializer = (state, props) => (0, _extends2.default)({}, state, {
  preferencePanel: props.initialState?.preferencePanel ?? {
    open: false
  }
});

/**
 * TODO: Add a single `setPreferencePanel` method to avoid multiple `setState`
 */
exports.preferencePanelStateInitializer = preferencePanelStateInitializer;
const useGridPreferencesPanel = (apiRef, props) => {
  const logger = (0, _useGridLogger.useGridLogger)(apiRef, 'useGridPreferencesPanel');
  const hideTimeout = React.useRef();
  const immediateTimeout = React.useRef();

  /**
   * API METHODS
   */
  const hidePreferences = React.useCallback(() => {
    logger.debug('Hiding Preferences Panel');
    const preferencePanelState = (0, _gridPreferencePanelSelector.gridPreferencePanelStateSelector)(apiRef.current.state);
    if (preferencePanelState.openedPanelValue) {
      apiRef.current.publishEvent('preferencePanelClose', {
        openedPanelValue: preferencePanelState.openedPanelValue
      });
    }
    apiRef.current.setState(state => (0, _extends2.default)({}, state, {
      preferencePanel: {
        open: false
      }
    }));
    apiRef.current.forceUpdate();
  }, [apiRef, logger]);

  // This is to prevent the preferences from closing when you open a select box or another panel,
  // The issue is in MUI core V4 => Fixed in V5
  const doNotHidePanel = React.useCallback(() => {
    immediateTimeout.current = setTimeout(() => clearTimeout(hideTimeout.current), 0);
  }, []);

  // This is a hack for the issue with Core V4, by delaying hiding the panel on the clickAwayListener,
  // we can cancel the action if the trigger element still need the panel...
  const hidePreferencesDelayed = React.useCallback(() => {
    hideTimeout.current = setTimeout(hidePreferences, 100);
  }, [hidePreferences]);
  const showPreferences = React.useCallback(newValue => {
    logger.debug('Opening Preferences Panel');
    doNotHidePanel();
    apiRef.current.setState(state => (0, _extends2.default)({}, state, {
      preferencePanel: (0, _extends2.default)({}, state.preferencePanel, {
        open: true,
        openedPanelValue: newValue
      })
    }));
    apiRef.current.publishEvent('preferencePanelOpen', {
      openedPanelValue: newValue
    });
    apiRef.current.forceUpdate();
  }, [logger, doNotHidePanel, apiRef]);
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, {
    showPreferences,
    hidePreferences: hidePreferencesDelayed
  }, 'public');

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback((prevState, context) => {
    const preferencePanelToExport = (0, _gridPreferencePanelSelector.gridPreferencePanelStateSelector)(apiRef.current.state);
    const shouldExportPreferencePanel =
    // Always export if the `exportOnlyDirtyModels` property is not activated
    !context.exportOnlyDirtyModels ||
    // Always export if the panel was initialized
    props.initialState?.preferencePanel != null ||
    // Always export if the panel is opened
    preferencePanelToExport.open;
    if (!shouldExportPreferencePanel) {
      return prevState;
    }
    return (0, _extends2.default)({}, prevState, {
      preferencePanel: preferencePanelToExport
    });
  }, [apiRef, props.initialState?.preferencePanel]);
  const stateRestorePreProcessing = React.useCallback((params, context) => {
    const preferencePanel = context.stateToRestore.preferencePanel;
    if (preferencePanel != null) {
      apiRef.current.setState(state => (0, _extends2.default)({}, state, {
        preferencePanel
      }));
    }
    return params;
  }, [apiRef]);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'restoreState', stateRestorePreProcessing);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    return () => {
      clearTimeout(hideTimeout.current);
      clearTimeout(immediateTimeout.current);
    };
  }, []);
};
exports.useGridPreferencesPanel = useGridPreferencesPanel;