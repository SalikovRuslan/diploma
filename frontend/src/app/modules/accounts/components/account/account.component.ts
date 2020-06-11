import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { AccountModel } from '../../models/account.model';
import { AccountsService } from '../../services/accounts.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.less'],
})
export class AccountComponent implements OnInit, OnDestroy {
    accountForm: FormGroup;
    private inputPopupData: { account: AccountModel };

    isCreateMode: boolean;
    isPasswordVisible = false;
    isCreateLoading: boolean;
    isUpdateLoading: boolean;
    isDeleteLoading: boolean;

    unsubscribe$ = new Subject();

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AccountComponent>,
        @Inject(MAT_DIALOG_DATA) public matDialogData: { account: AccountModel },
        private accountsService: AccountsService,
    ) {}

    ngOnInit(): void {
        this.inputPopupData = this.matDialogData;
        this.isCreateMode = !this.inputPopupData.account;
        this.createForm(this.inputPopupData.account);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    createForm(account?: AccountModel) {
        this.accountForm = this.fb.group({
            name: [account?.name ?? null, [Validators.required]],
            username: [account?.username ?? null, [Validators.required]],
            password: [account?.password ?? null, [Validators.required]],
            url: [account?.url ?? null],
            notes: [account?.notes ?? null],
        });
    }

    goToAccountUrl() {}

    createAccount() {
        console.log('click');
        if (this.isCreateLoading || !this.accountForm.valid) {
            return;
        }

        this.isCreateLoading = true;
        const account = this.accountForm.value;
        this.accountsService
            .createAccount(account)
            .pipe(
                finalize(() => (this.isCreateLoading = false)),
                takeUntil(this.unsubscribe$),
            )
            .subscribe(() => this.closePopup(true));
    }

    updateAccount() {
        if (this.isUpdateLoading || !this.accountForm.valid) {
            return;
        }

        this.isUpdateLoading = true;
        const account = this.accountForm.value;
        this.accountsService
            .updateAccount({ ...account, _id: this.inputPopupData.account._id })
            .pipe(
                finalize(() => (this.isUpdateLoading = false)),
                takeUntil(this.unsubscribe$),
            )
            .subscribe(() => this.closePopup(true));
    }

    private closePopup(success: boolean) {
        this.dialogRef.close(success);
    }

    deleteAccount() {
        const confirmDelete = confirm('Підтвердіть видалення');
        if (confirmDelete) {
            this.accountsService.deleteAccount(this.inputPopupData.account._id).subscribe(() => this.dialogRef.close(true));
        }
    }
}
