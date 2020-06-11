import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestService } from '../../shared/services/rest.service';
import { AccountModel } from '../models/account.model';

@Injectable({
    providedIn: 'root',
})
export class AccountsService {
    constructor(private restService: RestService) {}

    getAccounts(): Observable<AccountModel[]> {
        return this.restService.get('/api/accounts/getAll');
    }

    createAccount(account: Partial<AccountModel>): Observable<AccountModel> {
        return this.restService.post('/api/accounts/create', { ...account });
    }

    updateAccount(account: AccountModel): Observable<AccountModel> {
        return this.restService.post('/api/accounts/update', { ...account });
    }

    deleteAccount(accountId: string): Observable<void> {
        return this.restService.post('/api/accounts/delete', { _id: accountId });
    }
}
