import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { RestService } from '../../shared/services/rest.service';
import { UserService } from '../../shared/services/user.service';

import { UserModel } from '../../shared/models/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private authToken: string;

    constructor(private restService: RestService, private userService: UserService) {
        this.authToken = localStorage.getItem('authToken');
    }

    public registration(email: string, password: string): Observable<number> {
        return this.restService.post('/api/auth/registration', { email, password });
    }

    public login(email: string, password: string): Observable<void> {
        return this.restService.post('/api/auth/login', { email, password }).pipe(
            tap(res => {
                const user = new UserModel(res);
                this.userService.setUser(user);
                this.setAuthToken(user.accessToken);
            }),
        );
    }

    public loadUser(): Observable<void> {
        if (!this.getAuthToken()) {
            this.userService.setUser(new UserModel());
            return of();
        }

        return this.restService.get('/api/auth/load').pipe(
            tap(user => {
                this.userService.setUser(new UserModel(user));
            }),
            catchError(error => {
                if (error.status === 401) {
                    // if loading user data and token is expired, just remove them
                    this.removeAuthToken();
                    this.userService.setUser(new UserModel(null));
                    return of();
                } else {
                    return throwError(error);
                }
            }),
        );
    }

    public logout() {
        this.userService.setUser(null);
        // TODO: послать запрос для удаления токена
    }

    private removeAuthToken() {
        localStorage.removeItem('authToken');
        this.authToken = null;
    }

    private setAuthToken(token: string) {
        localStorage.setItem('authToken', token);
        this.authToken = token;
    }

    public getAuthToken() {
        return this.authToken;
    }
}
