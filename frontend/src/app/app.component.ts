import { Component } from '@angular/core';

import { UserService } from './modules/shared/services/user.service';
import { AccountPopupService } from './modules/accounts/services/account-popup.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent {
    isAsideActive: boolean;

    constructor(private userService: UserService) {}

    get isGuest(): boolean {
        return this.userService.isGuest;
    }
}
