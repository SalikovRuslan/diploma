import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { MaterialModule } from '../../material.module';
import { SharedModule } from '../shared/shared.module';
import { GeneratorRoutingModule } from './generator-routing.module';

import { GeneratorComponent } from './components/generator/generator.component';

@NgModule({
    declarations: [GeneratorComponent],
    imports: [CommonModule, MaterialModule, ReactiveFormsModule, GeneratorRoutingModule, ClipboardModule, SharedModule],
})
export class GeneratorModule {}
