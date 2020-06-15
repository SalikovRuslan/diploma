import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackupRoutingModule } from './backup-routing.module';

import { BackupComponent } from './component/backup/backup.component';
import { AccountsModule } from '../accounts/accounts.module';
import { MaterialModule } from '../../material.module';

@NgModule({
    declarations: [BackupComponent],
    imports: [CommonModule, MaterialModule, AccountsModule, BackupRoutingModule],
})
export class BackupModule {}
