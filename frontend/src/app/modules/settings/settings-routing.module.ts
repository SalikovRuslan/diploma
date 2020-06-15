import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../auth.guard';

import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
    {
        path: 'settings',
        canActivate: [AuthGuard],
        component: SettingsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsRoutingModule {}
