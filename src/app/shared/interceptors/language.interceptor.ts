import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';

import { ConfigService } from '../services';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  /**
   * Constructor of the class.
   *
   * @param {LocalStorageService} localStorage
   */
  public constructor(private localStorage: LocalStorageService) { }

  /**
   * Http request interceptor which is attaching `X-App-Language` header to each request that are made against
   * defined backend.
   *
   * @param {HttpRequest<any>} httpRequest
   * @param {HttpHandler}      next
   *
   * @returns Observable<HttpEvent<any>>
   */
  public intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    try {
      if (new URL(httpRequest.url).host === new URL(ConfigService.settings.apiUri).host) {
        const modified = httpRequest.clone({ setHeaders: { 'X-App-Language': this.localStorage.retrieve('language') } });

        return next.handle(modified);
      }
    } catch (e) { /** Note that we really want to silently skip possible errors here */ }

    return next.handle(httpRequest);
  }
}
