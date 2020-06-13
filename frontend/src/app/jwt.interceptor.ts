import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserService } from './modules/shared/services/user.service';
import { AuthService } from './modules/guest/services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private userService: UserService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const accessToken = this.authService.getAuthToken();
        const cryptToken = this.authService.getCryptToken();
        if (accessToken) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${accessToken}`, Crypt: `${cryptToken}` },
            });
        }

        return next.handle(request);
    }
}
