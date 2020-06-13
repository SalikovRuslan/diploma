import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class RestService {
    constructor(private http: HttpClient, private userService: UserService) {}

    public post(url: string, data?: any, options?: any): Observable<any> {
        return this.http.post(url, data);
    }

    public get(url: string, options?: any): Observable<any> {
        return this.http.get(url);
    }
}
