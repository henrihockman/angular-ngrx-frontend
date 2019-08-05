import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from '../services';

/**
 * This class implements a guard for routes that require that user is not authenticated.
 */
@Injectable()
export class AnonymousGuard implements CanActivate {
  /**
   * Constructor of the class.
   *
   * @param {Router}      router
   * @param {AuthService} authService
   */
  public constructor(private router: Router, private authService: AuthService) { }

  /**
   * Purpose of this guard is check that current user has not been authenticated to application. If user is
   * authenticated he/she is redirected to application root.
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot}    state
   *
   * @returns {Observable<boolean>}
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return new Observable((observer: Observer<boolean>) => {
      this.authService.authenticated()
        .pipe(take(1))
        .subscribe((authenticated) => {
          observer.next(!authenticated);

          if (authenticated) {
            this.router
              .navigate(['/'])
              .then(() => { });
          }

          observer.complete();
        });
    });
  }
}
