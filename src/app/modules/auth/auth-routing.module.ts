import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountsListComponent } from './components/accounts-list/accounts-list.component';
import { AuthGuard } from '../../auth.guard';

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
export class AuthRoutingModule {}
