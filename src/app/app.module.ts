import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DateAdapter, NativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { ResourceModule } from '@ngx-resource/handler-ngx-http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';
import { CustomRouterStateSerializer } from './shared/utils/router.utils';
import { metaReducers, reducers } from './store/reducers/app.reducers';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { LandingModule } from './landing/landing.module';
import { Effects } from './store/effects';

/**
 * Dependencies not included in production builds
 *
 * @type { ModuleWithProviders[] }
 */
let devDependencies = [
  StoreDevtoolsModule.instrument(),
];

if (environment.production === true) {
  devDependencies = [];
}

// Required for AOT compilation:
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AuthModule,
    LandingModule,
    RouterModule,
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
    }),
    ResourceModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers, runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true } }),
    EffectsModule.forRoot([...Effects]),
    NgxWebstorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    AppRoutingModule,
    ...devDependencies,
  ],
  providers: [
    /**
     * The `RouterStateSnapshot` provided by the `Router` is a large complex structure.
     * A custom RouterStateSerializer is used to parse the `RouterStateSnapshot` provided
     * by `@ngrx/router-store` to include only the desired pieces of the snapshot.
     */
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },

    /**
     * Force Finnish locale
     */
    { provide: MAT_DATE_LOCALE, useValue: 'fi-FI' },
    { provide: DateAdapter, useClass: NativeDateAdapter },
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
