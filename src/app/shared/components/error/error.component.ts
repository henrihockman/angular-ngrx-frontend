import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ErrorInterface } from '../../interfaces';
import { ErrorState, getGlobalError, isGlobalError } from '../../../store/reducers/error';
import { ClearGlobalError } from '../../../store/actions/error/error.actions';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(100%)', opacity: 0}),
        animate('250ms ease-in',
          style({transform: 'translateY(0%)', opacity: 1})),
      ]),
      transition(':leave', [
        animate('250ms ease-in',
          style({transform: 'translateY(0%)', opacity: 0})),
      ]),
    ]),
  ],
})

export class ErrorComponent implements OnInit {
  public isError$: Observable<boolean>;
  public error$: Observable<ErrorInterface>;

  /**
   * Constructor of the class.
   *
   * @param {Store<ErrorState>} errorStore
   */
  public constructor(private errorStore: Store<ErrorState>) { }

  /**
   * A lifecycle hook that is called after Angular has initialized
   * all data-bound properties of a directive.
   */
  public ngOnInit(): void {
    this.isError$ = this.errorStore.pipe(select(isGlobalError));
    this.error$ = this.errorStore.pipe(select(getGlobalError));
  }

  /**
   * Method to dismiss current error.
   */
  public dismiss(): void {
    this.errorStore.dispatch(new ClearGlobalError());
  }
}
