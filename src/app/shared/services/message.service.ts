import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { ErrorInterface } from '../interfaces';
import * as fromError from '../../store/reducers/error';
import * as errorActions from '../../store/actions/error/error.actions';

@Injectable()
export class MessageService {
  private closeButtonTag = 'common.snackbar.close-button';

  /**
   * Constructor of the class
   *
   * @param {MatSnackBar}                 snackBar
   * @param {TranslateService}            translateService
   * @param {Store<fromError.ErrorState>} errorStateStore
   */
  public constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private errorStateStore: Store<fromError.ErrorState>
  ) { }

  /**
   * Method to push simple snackbar message to communicate to user.
   *
   * @param {string} tag      Translation tag of which translated value we want to show
   * @param {number} duration Time that snackbar is visible once triggered
   *
   * @returns Promise
   */
  public simple(tag: string, duration = 5000): Promise<MatSnackBarRef<SimpleSnackBar>> {
    return new Promise<MatSnackBarRef<SimpleSnackBar>>(resolve => {
      const config = {
        duration,
        panelClass: ['snackbar'],
      } as MatSnackBarConfig;

      // TODO: Needs translation tag once implemented!
      const closeButtonTag = 'sulje';

      /**
       * TODO: Here we need to get the translations that match the given tag,
       * and also the `closeButtonTag` translation. The following are just to mock up the real params.
       */
      const buttonText = closeButtonTag.toUpperCase();
      const message = tag.toString();
      const ref = this.snackBar.open(message, buttonText, config);

      resolve(ref);
    });
  }

  /**
   * Method to display server error in snackbar. This is default behaviour of all HTTP requests.
   *
   * @param {ErrorInterface} serverError
   *
   * @returns Promise
   */
  public serverError(serverError: ErrorInterface): Promise<MatSnackBarRef<SimpleSnackBar>> {
    return new Promise<MatSnackBarRef<SimpleSnackBar>>(resolve => {
      const config = {
        panelClass: ['snackbar', 'snackbar--error'],
        horizontalPosition: 'left',
        verticalPosition: 'top',
      } as MatSnackBarConfig;

      this.translateService
        .get(this.closeButtonTag)
        .pipe(take(1))
        .subscribe((buttonText: string) => {
          const ref = this.snackBar.open(serverError.message, buttonText.toUpperCase(), config);

          ref.afterDismissed().subscribe(() => {
            this.errorStateStore.dispatch(new errorActions.ClearSnackbarError());
          });

          resolve(ref);
      });
    });
  }
}
