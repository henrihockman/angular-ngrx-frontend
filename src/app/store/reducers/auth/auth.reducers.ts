import {AuthActions, AuthActionTypes} from '../../actions/auth/auth.actions';
import {ErrorInterface, UserProfileInterface} from '../../../shared/interfaces';

export interface AuthState {
  error?: ErrorInterface;
  loading: boolean;
  loggedIn: boolean;
  loggedInUser?: UserProfileInterface;
  userRoles?: Array<string>;
}

export const initialState: AuthState = {
  error: null,
  loading: false,
  loggedIn: false,
  loggedInUser: null,
  userRoles: null,
};

export function authReducer(state: AuthState = initialState, action: AuthActions): AuthState {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return {
        ...state,
        error: null,
        loading: true,
        loggedIn: false,
        loggedInUser: null,
      };

    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        loggedIn: true,
        userRoles: action.payload,
      };

    case AuthActionTypes.LOGIN_FAILED:
      return {
        ...state,
        error: action.payload,
        loading: false,
        loggedIn: false,
      };

    case AuthActionTypes.LOGOUT:
      return {
        ...state,
        error: null,
        loading: true,
      };

    case AuthActionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        loggedIn: false,
        loggedInUser: null,
        userRoles: null,
      };

    case AuthActionTypes.GET_USER_PROFILE:
      return {
        ...state,
        loading: true,
      };

    case AuthActionTypes.GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        loggedInUser: action.payload,
      };

    case AuthActionTypes.GET_USER_PROFILE_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}

export const isLoading = (state: AuthState) => state.loading;
export const isLoggedIn = (state: AuthState) => state.loggedIn;
export const getError = (state: AuthState) => state.error;
export const getLoggedInUser = (state: AuthState) => state.loggedInUser;
export const getUserRoles = (state: AuthState) => state.userRoles;

