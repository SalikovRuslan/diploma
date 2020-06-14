import { Component } from '@angular/core';
import * as crypto from 'crypto-js';
import { finalize } from 'rxjs/operators';

import { UserService } from './modules/shared/services/user.service';
import { AuthService } from './modules/guest/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent {
    isAsideActive: boolean;
    isLogoutLoading: boolean;

    constructor(private router: Router, private userService: UserService, private authService: AuthService) {
        const crypt = crypto;
        console.log(crypt);
    }

    get isGuest(): boolean {
        return this.userService.isGuest;
    }

    logout() {
        this.isLogoutLoading = true;
        this.authService
            .logout()
            .pipe(finalize(() => (this.isLogoutLoading = false)))
            .subscribe(() => this.router.navigate(['/auth']));
    }
}
