import { Component } from '@angular/core';
import * as crypto from 'crypto-js';

import { UserService } from './modules/shared/services/user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent {
    isAsideActive: boolean;

    constructor(private userService: UserService) {
        const crypt = crypto;
    }

    get isGuest(): boolean {
        return this.userService.isGuest;
    }

}
