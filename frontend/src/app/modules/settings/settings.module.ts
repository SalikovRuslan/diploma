import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './components/settings/settings.component';
import { MaterialModule } from '../../material.module';
import { SharedModule } from '../shared/shared.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [SettingsComponent],
    imports: [CommonModule, MaterialModule, SharedModule, SettingsRoutingModule, ReactiveFormsModule, FormsModule],
})
export class SettingsModule {}
