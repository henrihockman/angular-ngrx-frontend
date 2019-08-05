import { Injectable, OnDestroy } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { MessageService } from '../../../shared/services';
import { ErrorInterface } from '../../../shared/interfaces';
import * as fromError from '../../reducers/error';
import * as errorActions from '../../actions/error/error.actions';

@Injectable()
export class ErrorEffects implements OnDestroy {
  @Effect({dispatch: false})
  public snackbarError$: Observable<void> = this.actions$.pipe(
    ofType(errorActions.ErrorActionTypes.ERROR_SNACKBAR),
    pluck('payload'),
    map((payload: ErrorInterface) => {
      this.messageService
        .serverError(payload)
        .finally();
    })
  );

  private errorState: fromError.ErrorState;
  private subscription: Subscription;

  /**
   * Constructor of the class.
   *
   * @param {Actions}                     actions$
   * @param {Store<fromError.ErrorState>} store
   * @param {MessageService}              messageService
   */
  public constructor(
    private actions$: Actions,
    private store: Store<fromError.ErrorState>,
    private messageService: MessageService
  ) {
    this.subscription = this.store
      .pipe(select(fromError.getErrorState))
      .subscribe((state: fromError.ErrorState) => this.errorState = state);
  }

  /**
   * A callback method that performs custom clean-up, invoked immediately
   * after a directive, pipe, or service instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

