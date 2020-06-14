import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { NotFoundComponent } from './components/not-found/not-found.component';
import { AsideComponent } from './components/aside/aside.component';

@NgModule({
    declarations: [NotFoundComponent, AsideComponent],
    imports: [
        CommonModule, //
        MatSnackBarModule,
    ],
})
export class SharedModule {}
