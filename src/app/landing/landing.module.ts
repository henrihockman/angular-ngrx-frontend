import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { LandingComponent } from './landing.component';
import { LandingRoutingModule } from './landing-routing.module';

@NgModule({
  declarations: [
    LandingComponent,
  ],
  imports: [
    SharedModule,
    LandingRoutingModule,
  ],
  providers: []
})

export class LandingModule { }
