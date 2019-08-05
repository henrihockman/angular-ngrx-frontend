import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { ErrorInterface } from '../../shared/interfaces';
import { AuthState, ErrorState } from '../../store/reducers';
import { getError, isLoading } from '../../store/reducers/auth';
import { Login } from '../../store/actions/auth/auth.actions';
import { ClearGlobalError, GlobalError } from '../../store/actions/error/error.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public loading: boolean;
  public hide: boolean;

  private subscriptions: Subscription;

  /**
   * Constructor of the class.
   *
   * @param {FormBuilder}       formBuilder
   * @param {TranslateService}  translateService
   * @param {Store<AuthState>}  authStore
   * @param {Store<ErrorState>} errorStore
   */
  public constructor(
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private authStore: Store<AuthState>,
    private errorStore: Store<ErrorState>
  ) {
    this.subscriptions = new Subscription();
    this.loading = false;
    this.hide = true;
  }

  /**
   * A lifecycle hook that is called after Angular has initialized
   * all data-bound properties of a directive.
   */
  public ngOnInit(): void {
    this.createForm();

    this.subscriptions.add(this.authStore.pipe(select(isLoading))
      .subscribe((loading: boolean) => {
        this.loading = loading;
      })
    );

    this.subscriptions.add(this.authStore.pipe(select(getError))
      .subscribe((error?: ErrorInterface) => {
        if (error) {
          this.translateService.get('auth.login.error')
            .pipe(take(1))
            .subscribe((message: string) => {
              const loginError = { message } as ErrorInterface;

              this.errorStore.dispatch(new GlobalError(loginError));
            });
        }
      })
    );
  }

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed.
   * Use for any custom cleanup that needs to occur when the instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Method to dispatch login action.
   */
  public login(): void {
    if (this.loginForm.valid) {
      this.errorStore.dispatch(new ClearGlobalError());
      this.authStore.dispatch(new Login(this.loginForm.value));
    }
  }

  /**
   * Method to create new form.
   */
  private createForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
}
