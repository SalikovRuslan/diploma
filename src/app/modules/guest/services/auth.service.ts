import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { RestService } from '../../shared/services/rest.service';
import { UserService } from '../../shared/services/user.service';

import { UserModel } from '../../shared/models/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private restService: RestService, private userService: UserService) {}

    public registration(email: string, password: string): Observable<number> {
        return this.restService.post('/api/auth/registration', { email, password });
    }

    public login(email: string, password: string): Observable<void> {
        return this.restService.post('/api/auth/login', { email, password }).pipe(
            tap((res) => {
                const user = new UserModel(res);
                this.userService.setUser(user);
                localStorage.setItem('currentUser', JSON.stringify(user));
            }),
        );
    }

    public logout() {
        // remove currentUser from localStorege
        localStorage.removeItem('currentUser');
        this.userService.setUser(null);
    }
}
