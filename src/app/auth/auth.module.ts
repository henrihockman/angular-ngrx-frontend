import { NgModule } from '@angular/core';
import { JWT_OPTIONS, JwtModule, JwtModuleOptions } from '@auth0/angular-jwt';
import { LocalStorageService } from 'ngx-webstorage';

import { ConfigService } from '../shared/services';
import { Services } from './services';
import { Guards } from './guards';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginModule } from './login/login.module';

/**
 * Fetch jwt token from local storage and use configured api urls for adding or skipping auth headers
 *
 * @param {LocalStorageService} localStorage
 *
 * @returns {JwtModuleOptions.config}
 */
export function jwtOptionsFactory(localStorage: LocalStorageService): JwtModuleOptions['config'] {
  return {
    tokenGetter: () => localStorage.retrieve('token'),
    whitelistedDomains: [
      new URL(ConfigService.settings.apiUri).host,
    ],
    blacklistedRoutes: [
      ConfigService.loginUri,
    ],
  };
}

@NgModule({
  imports: [
    LoginModule,
    AuthRoutingModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [LocalStorageService],
      },
    }),
  ],
  providers: [
    ...Guards,
    ...Services,
  ]
})

export class AuthModule { }
