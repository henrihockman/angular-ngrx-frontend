import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LandingComponent } from './landing.component';
import { AuthenticationGuard } from '../auth/guards';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'landing',
        component: LandingComponent,
        canActivate: [
          AuthenticationGuard,
        ],
      },
    ]),
  ],
  exports: [
    RouterModule,
  ],
})

export class LandingRoutingModule { }
