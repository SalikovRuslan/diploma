import { Injectable } from '@angular/core';

import { RestService } from '../../shared/services/rest.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    constructor(private restService: RestService) {}

    public changePassword(oldPassword: string, newPassword: string): Observable<boolean> {
        return this.restService.post('/api/auth/change_password', { oldPassword, newPassword });
    }
}
