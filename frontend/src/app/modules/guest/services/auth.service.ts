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
    private cryptToken: string;

    constructor(private restService: RestService, private userService: UserService) {
        this.authToken = localStorage.getItem('authToken');
        this.cryptToken = localStorage.getItem('cryptToken');
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
                this.setCryptToken(user.cryptToken);
            }),
        );
    }

    public loadUser(): Observable<void> {
        if (!this.getAuthToken() || !this.getCryptToken()) {
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

    public logout(): Observable<void> {
        return this.restService.post('/api/auth/logout').pipe(
            tap(() => {
                this.removeAuthToken();
                this.removeCryptToken();
                this.userService.setUser(null);
            }),
        );
    }

    deleteUser(masterPassword) {
        return this.restService.post('/api/auth/delete_user', { masterPassword });
    }

    private setAuthToken(token: string) {
        localStorage.setItem('authToken', token);
        this.authToken = token;
    }

    private removeAuthToken() {
        localStorage.removeItem('authToken');
        this.authToken = null;
    }

    public getAuthToken() {
        return this.authToken;
    }

    private setCryptToken(token: string) {
        localStorage.setItem('cryptToken', token);
        this.cryptToken = token;
    }

    private removeCryptToken() {
        localStorage.removeItem('cryptToken');
        this.authToken = null;
    }

    public getCryptToken() {
        return this.cryptToken;
    }
}
