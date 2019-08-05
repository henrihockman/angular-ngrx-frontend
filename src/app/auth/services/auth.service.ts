import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from 'ngx-webstorage';
import { BehaviorSubject, Observable, Observer, of } from 'rxjs';

import { ConfigService } from '../../shared/services';
import { CredentialsInterface, ErrorInterface, UserProfileInterface } from '../../shared/interfaces';
import { PasswordVerifyInterface, TokenInterface } from '../interfaces';

@Injectable()
export class AuthService {
  private httpOptions: object;
  private readonly loggedInRoles$: BehaviorSubject<string[]|null>;

  public constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private jwtHelper: JwtHelperService,
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    this.loggedInRoles$ = new BehaviorSubject<string[]|null>(null);
  }

  public authenticate(credentials: CredentialsInterface): Observable<string[]|ErrorInterface> {
    const payload = credentials;
    const url = ConfigService.settings.apiUri + '/auth/getToken';

    return new Observable((observer: Observer<string[]|ErrorInterface>) => {
      this.http.post(url, payload, this.httpOptions).subscribe(
        (token: TokenInterface) => {
          this.localStorage.store('token', token.token);
          const decoded = this.jwtHelper.decodeToken(token.token);

          observer.next(decoded.roles);
        },
        (errorResponse: ErrorInterface) => {
          this.localStorage.clear('token');
          observer.error(errorResponse);
        },
        () => {
          observer.complete();
        }
      );
    });
  }

  public getProfile(): Observable<UserProfileInterface|ErrorInterface> {
    const url = ConfigService.settings.apiUri + '/profile';

    return new Observable((observer: Observer<UserProfileInterface|ErrorInterface>) => {
      this.http.get(url, this.httpOptions).subscribe(
        (userProfile: UserProfileInterface) => {
          observer.next(userProfile);
        },
        (errorResponse: ErrorInterface) => {
          observer.error(errorResponse);
        },
        () => {
          observer.complete();
        }
      );
    });
  }

  public register(newUser: UserProfileInterface): Observable<any|ErrorInterface> {
    const payload = newUser;
    const url = ConfigService.settings.apiUri + '/account/register';

    return new Observable((observer: Observer<any|ErrorInterface>) => {
      this.http.post(url, payload, this.httpOptions).subscribe(
        (data: any) => {
          observer.next(data);
        },
        (errorResponse: ErrorInterface) => {
          observer.error(errorResponse);
        },
        () => {
          observer.complete();
        }
      );
    });
  }

  public requestPasswordReset(payload): Observable<any|ErrorInterface> {
    const url = ConfigService.settings.apiUri + '/account/password_reset';

    return new Observable((observer: Observer<any|ErrorInterface>) => {
      this.http.post(url, payload, this.httpOptions).subscribe(
        (data: any) => {
          observer.next(data);
        },
        (errorResponse: ErrorInterface) => {
          observer.error(errorResponse);
        },
        () => {
          observer.complete();
        }
      );
    });
  }

  /**
   * Verify or change user's password
   *
   * @param passwordVerify  Form data with new given password, and validation
   * @param isActiveUser    Whether or not user has already registered and is changing their password
   */
  public setPassword(
    passwordVerify: PasswordVerifyInterface,
    isActiveUser: boolean,
  ): Observable<string[]|ErrorInterface> {
    const payload = passwordVerify;
    const url = isActiveUser ?
      ConfigService.settings.apiUri + '/account/password_reset/finish' :
      ConfigService.settings.apiUri + '/account/register/finish';

    return new Observable((observer: Observer<string[]|ErrorInterface>) => {
      this.http.post(url, payload, this.httpOptions).subscribe(
        (token: TokenInterface) => {
          this.localStorage.store('token', token.token);
          const decoded = this.jwtHelper.decodeToken(token.token);

          observer.next(decoded.roles);
          this.loggedInRoles$.next(decoded.roles);
        },
        (errorResponse: ErrorInterface) => {
          this.localStorage.clear('token');
          observer.error(errorResponse);
          this.loggedInRoles$.next(null);
        },
        () => {
          observer.complete();
        }
      );
    });
  }

  public isHashValid(hash: string, registration: boolean): Observable<boolean|ErrorInterface> {
    const url = registration ?
      ConfigService.settings.apiUri + '/account/register/verify/' + hash :
      ConfigService.settings.apiUri + '/account/password_reset/verify/' + hash;

    return new Observable((observer: Observer<boolean|ErrorInterface>) => {
      this.http.get(url, this.httpOptions).subscribe(
        (hashIsValid: boolean) => {
          observer.next(hashIsValid);
        },
        (errorResponse: ErrorInterface) => {
          observer.error(errorResponse);
        },
        () => {
          observer.complete();
        }
      );
    });
  }

  public authenticated(): Observable<boolean> {
    const isTokenExpired = this.jwtHelper.isTokenExpired(this.localStorage.retrieve('token'));

    return of(!isTokenExpired);
  }

  public logout(): Observable<boolean> {
    this.localStorage.clear('token');
    this.loggedInRoles$.next(null);

    return of(true);
  }

  /**
   * Get logged in user roles or null, if user is not logged in.
   *
   * @returns {BehaviorSubject<string[]|null>}
   */
  public getLoggedInRoles(): BehaviorSubject<string[]|null> {
    this.authenticated().subscribe((authenticated: boolean) => {
      const token = this.localStorage.retrieve('token');
      const decoded = this.jwtHelper.decodeToken(token);

      this.loggedInRoles$.next(authenticated ? decoded.roles : null); // update logged in roles
    });

    return this.loggedInRoles$;
  }
}
