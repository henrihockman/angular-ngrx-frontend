import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { Languages } from '../../constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  @Input() loggedIn: boolean;

  @Output() logoutEvent: EventEmitter<any>;

  public languages: string[];
  public userLanguage: string;

  /**
   * Class constructor
   *
   * @param {Router}            router
   * @param {TranslateService}  translateService
   */
  public constructor(
    private router: Router,
    private translateService: TranslateService,
  ) {
    this.logoutEvent = new EventEmitter<any>();
    this.languages = Object.values(Languages);
  }

  /**
   * A lifecycle hook that is called after Angular has initialized
   * all data-bound properties of a directive.
   */
  public ngOnInit(): void {
    this.userLanguage = this.translateService.currentLang;
  }

  public logout(): void {
    this.logoutEvent.emit();
  }

  public navigateToMain(): void {
    this.router
      .navigate(['/'])
      .then(() => { });
  }
}
