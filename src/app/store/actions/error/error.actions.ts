import { Action } from '@ngrx/store';

import { ErrorInterface } from '../../../shared/interfaces';

export enum ErrorActionTypes {
  ERROR_SNACKBAR = '[Error] Snackbar',
  ERROR_GLOBAL = '[Error] Global',
  ERROR_CLEAR_SNACKBAR = '[Error] Clear snackbar',
  ERROR_CLEAR_GLOBAL = '[Error] Clear global',
}

export class SnackbarError implements Action {
  readonly type = ErrorActionTypes.ERROR_SNACKBAR;

  public constructor(public payload: ErrorInterface) { }
}

export class GlobalError implements Action {
  readonly type = ErrorActionTypes.ERROR_GLOBAL;

  public constructor(public payload: ErrorInterface) { }
}

export class ClearSnackbarError implements Action {
  readonly type = ErrorActionTypes.ERROR_CLEAR_SNACKBAR;
}

export class ClearGlobalError implements Action {
  readonly type = ErrorActionTypes.ERROR_CLEAR_GLOBAL;
}

export type ErrorActions =
  | SnackbarError
  | GlobalError
  | ClearSnackbarError
  | ClearGlobalError;
