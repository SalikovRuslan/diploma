import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GuestGuard } from '../../guest.guard';

import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
    {
        path: 'auth',
        canActivate: [GuestGuard],
        component: WelcomeComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GuestRoutingModule {}
