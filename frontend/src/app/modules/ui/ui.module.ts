import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';

import { UiPageComponent } from './components/ui-page/ui-page.component';
import { UiButtonComponent } from './components/ui-button/ui-button.component';
import { UiFormRowComponent } from './components/ui-form-row/ui-form-row.component';
import { UiLoaderComponent } from './components/ui-loader/ui-loader.component';

@NgModule({
  declarations: [
    UiPageComponent, //
    UiButtonComponent,
    UiFormRowComponent,
    UiLoaderComponent,
  ],
  imports: [
    CommonModule, //
    MaterialModule,
  ],
  exports: [
    UiPageComponent, //
    UiButtonComponent,
    UiFormRowComponent,
  ],
})
export class UiModule {}
