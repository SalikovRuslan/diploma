import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';

import { UiPageComponent } from './components/ui-page/ui-page.component';
import { UiButtonComponent } from './components/ui-button/ui-button.component';
import { UiLoaderComponent } from './components/ui-loader/ui-loader.component';

@NgModule({
    declarations: [
        UiPageComponent, //
        UiButtonComponent,
        UiLoaderComponent,
    ],
    imports: [
        CommonModule, //
        MaterialModule,
    ],
    exports: [
        UiPageComponent, //
        UiButtonComponent,
    ],
})
export class UiModule {}
