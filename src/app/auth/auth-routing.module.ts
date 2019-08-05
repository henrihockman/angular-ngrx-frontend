import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginRoutes } from './login/login.routing';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'auth',
        children: [
          ...LoginRoutes,
          {
            path: '**',
            redirectTo: 'login',
          },
        ],
      },
    ]),
  ],
  exports: [
    RouterModule,
  ],
})

export class AuthRoutingModule { }
