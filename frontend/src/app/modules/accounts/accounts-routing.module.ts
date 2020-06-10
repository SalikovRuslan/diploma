import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../auth.guard';

import { AccountsListComponent } from './components/accounts-list/accounts-list.component';

const routes: Routes = [
    {
        path: 'accounts',
        canActivate: [AuthGuard],
        component: AccountsListComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccountsRoutingModule {}
