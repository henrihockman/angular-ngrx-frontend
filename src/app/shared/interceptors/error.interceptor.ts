import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { noop, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ErrorInterface } from '../interfaces';
import { ConfigService } from '../services';
import { GlobalError, SnackbarError } from '../../store/actions/error/error.actions';
import { Logout } from '../../store/actions/auth/auth.actions';
import { AuthState } from '../../store/reducers/auth/';
import { ErrorState } from '../../store/reducers/error';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  /**
   * Constructor of the class.
   *
   * @param {Store<AuthState>}  authStore
   * @param {Store<ErrorState>} errorStore
   */
  public constructor(private authStore: Store<AuthState>, private errorStore: Store<ErrorState>) { }

  /**
   * Generic HTTP request error interceptor that is used to catch possible HTTP request errors and dispatch those
   * to application `ErrorStore` where those can easily be used.
   *
   * By default all possible HTTP request errors are shown in `snackbar` component. Another way to use this to bypass
   * snackbar processing and use `global` error - which is consumed within applications `app-error` component.
   *
   * Custom headers that can be used to change default behaviour:
   *  - `appBypassErrorStore` = Bypass error store totally
   *  - `appBypassErrorStoreSnackbar` = Bypass snackbar behaviour, but store error as `global` error in store
   *
   * Note we need to abuse `http headers` to make this possible - this part needs to be refactored after above pull
   * request is merged to Angular core and new release is made.
   *  - https://github.com/angular/angular/issues/18155
   *
   * @param {HttpRequest<any>} httpRequest
   * @param {HttpHandler}      delegate
   *
   * @returns Observable<HttpEvent<any>>
   */
  public intercept(httpRequest: HttpRequest<any>, delegate: HttpHandler): Observable<HttpEvent<any>> {
    const appBypassErrorStore = httpRequest.headers.has('appBypassErrorStore');
    const appBypassErrorStoreSnackbar = httpRequest.headers.has('appBypassErrorStoreSnackbar');

    const modified = httpRequest.clone({
      headers: httpRequest.headers.delete('appBypassErrorStore').delete('appBypassErrorStoreSnackbar')
    });

    return delegate
        .handle(modified)
        .pipe(tap(
          noop,
          (error) => {
            this.processError(modified, error, appBypassErrorStore, appBypassErrorStoreSnackbar);
          }
        ));
  }

  /**
   * Method to process possible HTTP request error.
   *
   * @param {HttpRequest<any>}  request
   * @param {HttpErrorResponse} error
   * @param {boolean}           appBypassErrorStore
   * @param {boolean}           appBypassErrorStoreSnackbar
   */
  private processError(
    request: HttpRequest<any>,
    error: HttpErrorResponse,
    appBypassErrorStore: boolean,
    appBypassErrorStoreSnackbar: boolean
  ): void {
    if (appBypassErrorStore === false) {
      this.processErrorStore(error, appBypassErrorStoreSnackbar);
    }

    // Used made request to backend route that needs logged in user
    if (request.url !== ConfigService.loginUri
      && new URL(request.url).host === new URL(ConfigService.settings.apiUri).host
      && error.status === 401
    ) {
      // Dispatch logout action to auth store
      this.authStore.dispatch(new Logout());
    }
  }

  /**
   * Method to dispatch current error to error store.
   *
   * @param {HttpErrorResponse|*} error
   * @param {boolean}             appBypassErrorStoreSnackbar
   */
  private processErrorStore(error: HttpErrorResponse|any, appBypassErrorStoreSnackbar: boolean): void {
    let payload;

    // Normal use case - when there is actual server which responded as expected
    if (error.hasOwnProperty('error') && error.error.hasOwnProperty('message')) {
      payload = error.error as ErrorInterface;
    } else if (error.hasOwnProperty('message')) { // Fail over for generic error message
      payload = error as ErrorInterface;
    } else { // And final end case
      payload = {
        message: error.toString(),
      } as ErrorInterface;
    }

    this.errorStore.dispatch(appBypassErrorStoreSnackbar ? new GlobalError(payload) : new SnackbarError(payload));
  }
}
