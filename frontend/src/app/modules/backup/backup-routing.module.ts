import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../auth.guard';

import { BackupComponent } from './component/backup/backup.component';

const routes: Routes = [
    {
        path: 'backup',
        canActivate: [AuthGuard],
        component: BackupComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BackupRoutingModule {}
