import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private userUpdatedSubject = new Subject<UserModel>();
    private user: UserModel;

    constructor() {}

    getUser(): UserModel {
        return this.user;
    }

    setUser(user: UserModel) {
        this.user = user;
        this.userUpdatedSubject.next(user);
    }

    get userUpdated$(): Observable<UserModel> {
        return this.userUpdatedSubject.asObservable();
    }

    get isGuest(): boolean {
        return this.getUser()?.email === undefined;
    }
}
