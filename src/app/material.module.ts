import { NgModule } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  exports: [
    MatCardModule, //
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class MaterialModule {}

