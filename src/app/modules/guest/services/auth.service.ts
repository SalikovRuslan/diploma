import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

import { RestService } from '../../shared/services/rest.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private restService: RestService) {}

    public registration(email: string, password: string): Observable<number> {
        return this.restService.post('/api/auth/registration', { email, password });
    }
}
