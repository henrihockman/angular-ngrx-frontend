import { Action } from '@ngrx/store';

import { CredentialsInterface, ErrorInterface, UserProfileInterface } from '../../../shared/interfaces';

/**
 * List action types, with the message that'll show up in console when action is triggered,
 * when not in production mode.
 */
export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login success',
  LOGIN_FAILED = '[Auth] Login failed',
  LOGOUT = '[Auth] Logout',
  LOGOUT_SUCCESS = '[Auth] Logout success',
  LOGOUT_FAILED = '[Auth] Logout failed',
  GET_USER_PROFILE = '[Auth] Get user profile',
  GET_USER_PROFILE_SUCCESS = '[Auth] Get user profile success',
  GET_USER_PROFILE_FAILED = '[Auth] Get user profile failed',
}

export class Login implements Action {
  readonly type = AuthActionTypes.LOGIN;

  public constructor(public payload: CredentialsInterface) { }
}

export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;

  public constructor(public payload: Array<string>) { }
}

export class LoginFailed implements Action {
  readonly type = AuthActionTypes.LOGIN_FAILED;

  public constructor(public payload: ErrorInterface) { }
}

export class Logout implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}

export class LogoutSuccess implements Action {
  readonly type = AuthActionTypes.LOGOUT_SUCCESS;
}

export class LogoutFailed implements Action {
  readonly type = AuthActionTypes.LOGOUT_FAILED;

  public constructor(public payload: ErrorInterface) { }
}

export class GetUserProfile implements Action {
  readonly type = AuthActionTypes.GET_USER_PROFILE;

  public constructor(public payload: string) { }
}

export class GetUserProfileSuccess implements Action {
  readonly type = AuthActionTypes.GET_USER_PROFILE_SUCCESS;

  public constructor(public payload: UserProfileInterface) { }
}

export class GetUserProfileFailed implements Action {
  readonly type = AuthActionTypes.GET_USER_PROFILE_FAILED;

  public constructor(public payload: ErrorInterface) { }
}

export type AuthActions =
  | Login
  | LoginSuccess
  | LoginFailed
  | Logout
  | LogoutSuccess
  | LogoutFailed
  | GetUserProfile
  | GetUserProfileSuccess
  | GetUserProfileFailed;
