import { Component } from '@angular/core';

import { ConfigService } from '../shared/services';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: []
})

export class LandingComponent {
  public title = 'angular-ngrx 2';
  public apiUri = ConfigService.settings.apiUri;

  public constructor() { }
}
