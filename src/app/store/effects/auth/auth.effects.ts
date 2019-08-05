import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { from, Observable, of, Subscription } from 'rxjs';
import { catchError, map, pluck, switchMap } from 'rxjs/operators';

import { AuthService } from '../../../auth/services';
import { CredentialsInterface, ErrorInterface } from '../../../shared/interfaces';
import { AuthState, getAuthState } from '../../reducers/auth';
import {
  AuthActionTypes,
  LoginFailed,
  LoginSuccess,
  LogoutFailed,
  LogoutSuccess
} from '../../actions/auth/auth.actions';

@Injectable()
export class AuthEffects implements OnDestroy {
  @Effect()
  login$: Observable<Action> = this.actions$.pipe(
    ofType(AuthActionTypes.LOGIN),
    pluck('payload'),
    switchMap((payload: CredentialsInterface) => {
      return from(this.authService.authenticate(payload))
        .pipe(
          map((roles: Array<string>) => {
            this.router
              .navigate(['/'])
              .then(() => { });
            return new LoginSuccess(roles);
          }),
          catchError((error: ErrorInterface) => {
            return of(new LoginFailed(error));
          })
        );
    })
  );

  @Effect()
  logout$: Observable<Action> = this.actions$.pipe(
    ofType(AuthActionTypes.LOGOUT),
    switchMap(() => {
      return from(this.authService.logout())
        .pipe(
          map(() => {
            this.router
              .navigate(['/auth/login'])
              .then(() => { });

            return new LogoutSuccess();
          }),
          catchError((error) => {
            return of(new LogoutFailed(error));
          })
        );
    }),
  );

  private authState: AuthState;
  private subscription: Subscription;

  /**
   * Constructor of the class.
   *
   * @param {Actions}            actions$
   * @param {Store<AuthState>}   authStore
   * @param {AuthService}        authService
   * @param {Router}             router
   */
  public constructor(
    private actions$: Actions,
    private authStore: Store<AuthState>,
    private authService: AuthService,
    private router: Router,
  ) {
    this.subscription = this.authStore
      .pipe(select(getAuthState))
      .subscribe((state: AuthState) => this.authState = state);
  }

  /**
   * A callback method that performs custom clean-up, invoked immediately
   * after a directive, pipe, or service instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
