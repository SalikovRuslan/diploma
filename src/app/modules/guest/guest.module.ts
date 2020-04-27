import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { UiModule } from '../ui/ui.module';
import { MaterialModule } from '../../material.module';
import { GuestRoutingModule } from './guest-routing.module';

import { AuthComponent } from './components/auth/auth.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

@NgModule({
    declarations: [
        AuthComponent,
        WelcomeComponent, //
    ],
    imports: [
        CommonModule, //
        ReactiveFormsModule,
        MaterialModule,
        GuestRoutingModule,
        SharedModule,
        UiModule,
    ],
})
export class GuestModule {}
