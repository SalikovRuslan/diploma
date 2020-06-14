import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { Clipboard } from '@angular/cdk/clipboard';

import { AccountsService } from '../../services/accounts.service';

import { AccountModel } from '../../models/account.model';
import { AccountPopupService } from '../../services/account-popup.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';

@Component({
    selector: 'accounts-list',
    templateUrl: './accounts-list.component.html',
    styleUrls: ['./accounts-list.component.less'],
})
export class AccountsListComponent implements OnInit, OnDestroy {
    public accounts: AccountModel[] = [];

    isLoading: boolean;
    private unsubscribe$ = new Subject();

    constructor(
        private snackBarService: SnackBarService,
        private clipboard: Clipboard,
        private accountsService: AccountsService,
        private accountPopupService: AccountPopupService,
    ) {}

    ngOnInit(): void {
        this.loadAccounts();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private loadAccounts() {
        this.isLoading = true;
        this.accountsService
            .getAccounts()
            .pipe(delay(500), takeUntil(this.unsubscribe$))
            .subscribe(accounts => {
                this.isLoading = false;
                this.accounts = accounts;
            });
    }

    openAccountPopup(account?: AccountModel) {
        this.accountPopupService
            .openAccountPopup(account)
            .afterClosed()
            .pipe(takeUntil(this.unsubscribe$))
            // load accounts if any account was changed or created in popup
            .subscribe(success => {
                if (success) {
                    this.loadAccounts();
                    setTimeout(() => this.snackBarService.show('Успіх', 'OK'), 200);
                }
            });
    }

    removeAccount($event: Event, _id: string) {
        $event.stopPropagation();
        const confirmDelete = confirm('Підтвердіть видалення');
        if (confirmDelete) {
            this.accountsService.deleteAccount(_id).subscribe(() => {
                this.loadAccounts();
                this.snackBarService.show('Запис видалено', 'ОК');
            });
        }
    }

    copyPassword($event: Event, password: string) {
        $event.stopPropagation();

        this.clipboard.copy(password);
        this.snackBarService.show('Пароль скопійовано', 'ОК');
    }
}
