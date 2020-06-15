import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SettingsService } from '../../services/settings.service';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../guest/services/auth.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.less'],
})
export class SettingsComponent implements OnInit {
    currentEmail: string;

    changePasswordFormGroup: FormGroup;
    oldPasswordControl: AbstractControl;
    newPasswordControl: AbstractControl;

    deletePasswordFormGroup: FormGroup;
    deleteAccountPasswordControl: AbstractControl;

    oldPasswordIsNotCorrect: boolean;
    masterPasswordForDeleteIsNotCorrect: boolean;
    isPasswordVisible: boolean;
    isOldPasswordVisible: boolean;
    isNewPasswordVisible: boolean;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private userService: UserService,
        private authService: AuthService,
        private settingsService: SettingsService,
    ) {}

    ngOnInit(): void {
        this.currentEmail = this.userService.getUser().email;

        this.changePasswordFormGroup = this.fb.group({
            oldPassword: [null, [Validators.required]],
            newPassword: [null, [Validators.required]],
        });
        this.oldPasswordControl = this.changePasswordFormGroup.get('oldPassword');
        this.newPasswordControl = this.changePasswordFormGroup.get('newPassword');

        this.deletePasswordFormGroup = this.fb.group({
            masterPassword: [null, [Validators.required]],
        });
        this.deleteAccountPasswordControl = this.deletePasswordFormGroup.get('masterPassword');
    }

    changePassword() {
        if (!this.changePasswordFormGroup.valid) {
            this.changePasswordFormGroup.markAllAsTouched();
            return;
        }

        const form = this.changePasswordFormGroup.value;

        this.settingsService.changePassword(form.oldPassword, form.newPassword).subscribe(() => {
            this.userService.resetUser();
            this.router.navigate(['/auth']);
        });
    }

    deleteUser() {
        this.masterPasswordForDeleteIsNotCorrect = false;

        if (!this.deleteAccountPasswordControl.valid) {
            this.deleteAccountPasswordControl.markAsDirty();
            this.deleteAccountPasswordControl.markAsTouched();
            return;
        }

        this.authService
            .deleteUser(this.deletePasswordFormGroup.value.masterPassword)
            .pipe(
                catchError(err => {
                    if (err.status === 400) {
                        console.log(err);

                        this.masterPasswordForDeleteIsNotCorrect = true;
                    }

                    return throwError(err);
                }),
            )
            .subscribe(() => {
                this.userService.resetUser();
                this.router.navigate(['/auth']);
            });
    }
}
