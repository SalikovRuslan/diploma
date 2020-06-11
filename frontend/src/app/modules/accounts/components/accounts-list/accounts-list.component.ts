import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { delay, takeUntil, tap } from 'rxjs/operators';

import { AccountsService } from '../../services/accounts.service';

import { AccountModel } from '../../models/account.model';
import { AccountPopupService } from '../../services/account-popup.service';

@Component({
    selector: 'accounts-list',
    templateUrl: './accounts-list.component.html',
    styleUrls: ['./accounts-list.component.less'],
})
export class AccountsListComponent implements OnInit, OnDestroy {
    public accounts: AccountModel[] = [];

    isLoading: boolean;
    private unsubscribe$ = new Subject();

    constructor(private accountsService: AccountsService, private accountPopupService: AccountPopupService) {}

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
            .pipe(
                delay(1000),
                tap(() => (this.isLoading = false)),
                takeUntil(this.unsubscribe$),
            )
            .subscribe(accounts => (this.accounts = accounts));
    }

    openAccountPopup(account?: AccountModel) {
        this.accountPopupService
            .openAccountPopup(account)
            .afterClosed()
            .pipe(takeUntil(this.unsubscribe$))
            // load accounts if any account was changed or created in popup
            .subscribe(success => success && this.loadAccounts());
    }

    removeAccount($event: Event, _id: string) {
        $event.stopPropagation();
        const confirmDelete = confirm('Підтвердіть видалення');
        if (confirmDelete) {
            this.accountsService.deleteAccount(_id).subscribe(() => this.loadAccounts());
        }
    }
}
