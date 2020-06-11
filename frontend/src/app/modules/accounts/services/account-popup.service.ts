import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog/dialog-ref';

import { AccountsService } from './accounts.service';

import { AccountModel } from '../models/account.model';
import { AccountComponent } from '../components/account/account.component';

@Injectable({
    providedIn: 'root',
})
export class AccountPopupService {
    constructor(private dialog: MatDialog, private accountsService: AccountsService) {}

    openAccountPopup(data?: AccountModel): MatDialogRef<AccountComponent> {
        return this.dialog.open(AccountComponent, { data: { account: data }, maxWidth: 500, width: '90%' });
    }
}
