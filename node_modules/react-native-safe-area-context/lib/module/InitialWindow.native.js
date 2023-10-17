var _NativeSafeAreaContex, _NativeSafeAreaContex2;
import NativeSafeAreaContext from './specs/NativeSafeAreaContext';
export const initialWindowMetrics = (NativeSafeAreaContext === null || NativeSafeAreaContext === void 0 ? void 0 : (_NativeSafeAreaContex = NativeSafeAreaContext.getConstants) === null || _NativeSafeAreaContex === void 0 ? void 0 : (_NativeSafeAreaContex2 = _NativeSafeAreaContex.call(NativeSafeAreaContext)) === null || _NativeSafeAreaContex2 === void 0 ? void 0 : _NativeSafeAreaContex2.initialWindowMetrics) ?? null;

/**
 * @deprecated
 */
export const initialWindowSafeAreaInsets = initialWindowMetrics === null || initialWindowMetrics === void 0 ? void 0 : initialWindowMetrics.insets;
//# sourceMappingURL=InitialWindow.native.js.map