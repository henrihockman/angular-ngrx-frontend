import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducers';
import { AuthState } from './auth.reducers';

/**
 * The createFeatureSelector function selects a piece of state from the root of the state object.
 * This is used for selecting feature states that are loaded eagerly or lazily.
 */
export const getAuthState = createFeatureSelector<AuthState>('auth');

export const isLoggedIn = createSelector(
  getAuthState,
  fromAuth.isLoggedIn,
);

export const isLoading = createSelector(
  getAuthState,
  fromAuth.isLoading,
);

export const getError = createSelector(
  getAuthState,
  fromAuth.getError,
);

export const getLoggedInUser = createSelector(
  getAuthState,
  fromAuth.getLoggedInUser,
);

export const getUserRoles = createSelector(
  getAuthState,
  fromAuth.getUserRoles,
);
