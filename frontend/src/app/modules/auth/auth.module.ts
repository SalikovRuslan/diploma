import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';

import { AccountsListComponent } from './components/accounts-list/accounts-list.component';

@NgModule({
    declarations: [AccountsListComponent],
    imports: [CommonModule, AuthRoutingModule],
})
export class AuthModule {}
