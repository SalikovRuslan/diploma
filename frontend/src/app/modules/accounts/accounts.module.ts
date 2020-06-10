import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { UiModule } from '../ui/ui.module';
import { AccountsRoutingModule } from './accounts-routing.module';

import { AccountsListComponent } from './components/accounts-list/accounts-list.component';
import { AccountComponent } from './components/account/account.component';


@NgModule({
    declarations: [
        AccountsListComponent,
        AccountComponent, //
    ],
    imports: [
        CommonModule, //
        ReactiveFormsModule,
        MaterialModule,
        AccountsRoutingModule,
        UiModule,
        InputTextModule,
        PasswordModule,
        InputTextareaModule,
    ],
})
export class AccountsModule {}
