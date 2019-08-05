import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { select, Store } from '@ngrx/store';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';

import { AuthService } from './auth/services';
import { Languages } from './shared/constants';
import { AuthState, isLoggedIn } from './store/reducers/auth';
import { LoginSuccess, Logout } from './store/actions/auth/auth.actions';
import { MessageService } from './shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit, OnDestroy  {
  @HostBinding('class.active') public userLoggedIn: boolean;

  private subscription: Subscription;
  private tokenInterval;

  /**
   * Constructor of the class.
   *
   * @param {Router}                         router
   * @param {LocalStorageService}            localStorage
   * @param {AuthService}                    authService
   * @param {Store<AuthState>}               authStore
   * @param {TranslateService}               translateService
   * @param {MessageService}                 messageService
   * @param {DateAdapter<NativeDateAdapter>} dateAdapter
   */
  public constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private authService: AuthService,
    private authStore: Store<AuthState>,
    private translateService: TranslateService,
    private messageService: MessageService,
    private dateAdapter: DateAdapter<NativeDateAdapter>
  ) {
    this.userLoggedIn = false;
    this.subscription = new Subscription();

    // Set default translation language
    this.translateService.setDefaultLang(Languages.ENGLISH);

    // Check storage for stored language setting
    let userLanguage = this.localStorage.retrieve('language');

    // Use storage language if exists, else check user's browser language
    if (userLanguage === null) {
      userLanguage = navigator.language.split('-')[0];
    }

    userLanguage = Object.values(Languages).includes(userLanguage) ? userLanguage : Languages.ENGLISH;

    this.translateService.use(userLanguage);
  }

  /**
   * A lifecycle hook that is called after Angular has initialized
   * all data-bound properties of a directive.
   */
  public ngOnInit(): void {
    this.tokenInterval = setInterval(( ) => { this.checkToken(); }, 15000);

    this.subscription.add(this.translateService.onLangChange
      .subscribe((language: LangChangeEvent) => {
        this.localStorage.store('language', language.lang);
        this.dateAdapter.setLocale(language.lang);
      })
    );

    this.subscription.add(this.localStorage
      .observe('token')
      .subscribe((value) => {
        if (value !== undefined) {
          clearInterval(this.tokenInterval);

          this.tokenInterval = setInterval(( ) => { this.checkToken(); }, 15000);
        }
      })
    );

    this.subscription.add(this.authService
      .getLoggedInRoles()
      .subscribe((loggedInRoles: string[]) => {
        // If user is logged in store but token is expired or not found, reset auth state
        if (loggedInRoles === null && this.userLoggedIn) {
          this.logout();
        }

        // If user is logged in, set store to logged in also
        if (loggedInRoles && !this.userLoggedIn) {
          this.authStore.dispatch(new LoginSuccess(loggedInRoles));
        }
      })
    );

    this.subscription.add(this.authStore
      .pipe(select(isLoggedIn))
      .subscribe((loggedIn: boolean) => {
        this.userLoggedIn = loggedIn;
      })
    );
  }

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed.
   * Use for any custom cleanup that needs to occur when the instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Method to dispatch logout action.
   */
  public logout(): void {
    clearInterval(this.tokenInterval);

    this.authStore.dispatch(new Logout());
  }

  /**
   * Method to check if current token has expired or not;
   */
  private checkToken(): void {
    this.authService.authenticated()
      .pipe(take(1))
      .subscribe((authenticated: boolean) => {
        if (this.userLoggedIn && !authenticated) {
          this.logout();
          this.messageService.simple('error.session_timed_out').finally();
        }
      });
  }
}
