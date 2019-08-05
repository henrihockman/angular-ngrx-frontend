import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromError from './error.reducers';
import { ErrorState } from './error.reducers';

export const getErrorState = createFeatureSelector<ErrorState>('error');
export const getSnackbarError = createSelector(getErrorState, fromError.getSnackbarError);
export const getGlobalError = createSelector(getErrorState, fromError.getGlobalError);
export const isSnackbarError = createSelector(getErrorState, fromError.isSnackbarError);
export const isGlobalError = createSelector(getErrorState, fromError.isGlobalError);
