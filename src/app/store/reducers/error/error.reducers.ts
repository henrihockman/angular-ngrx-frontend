import { ErrorInterface } from '../../../shared/interfaces';
import { ErrorActions, ErrorActionTypes } from '../../actions/error/error.actions';

export interface ErrorState {
  snackbarError?: ErrorInterface;
  globalError?: ErrorInterface;
}

export const initialState: ErrorState = {
  snackbarError: null,
  globalError: null,
};

export function errorReducer(state: ErrorState = initialState, action: ErrorActions): ErrorState {
  switch (action.type) {
    case ErrorActionTypes.ERROR_SNACKBAR:
      return {
        ...state,
        snackbarError: action.payload,
      };

    case ErrorActionTypes.ERROR_GLOBAL:
      return {
        ...state,
        globalError: action.payload,
      };

    case ErrorActionTypes.ERROR_CLEAR_SNACKBAR:
      return {
        ...state,
        snackbarError: null,
      };

    case ErrorActionTypes.ERROR_CLEAR_GLOBAL:
      return {
        ...state,
        globalError: null,
      };

    default:
      return state;
  }
}

export const isSnackbarError = (state: ErrorState) => state.snackbarError !== null;
export const isGlobalError = (state: ErrorState) => state.globalError !== null;
export const getSnackbarError = (state: ErrorState) => state.snackbarError;
export const getGlobalError = (state: ErrorState) => state.globalError;
