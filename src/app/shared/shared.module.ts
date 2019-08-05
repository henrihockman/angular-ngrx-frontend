import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from './material/material.module';
import { Components, EntryComponents } from './components';
import { Services } from './services';
import { Directives } from './directives';
import { HttpInterceptors } from './interceptors';
import { Resources } from './resources';

@NgModule({
  declarations: [
    ...Components,
    ...Directives,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    TranslateModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    TranslateModule,
    ...Components,
    ...Directives,
  ],
  providers: [
    ...Services,
    ...HttpInterceptors,
    ...Resources,
  ],
  entryComponents: [
    ...EntryComponents,
  ],
})

export class SharedModule { }
