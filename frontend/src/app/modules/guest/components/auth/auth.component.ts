import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, takeUntil } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';

@Component({
    selector: 'guest-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.less'],
})
export class AuthComponent implements OnInit, OnDestroy {
    formGroup: FormGroup;
    isInvalidCredentials: boolean;
    emailAlreadyExist: boolean;
    registrationError: boolean;

    unsubscribe$ = new Subject();

    constructor(
        private router: Router,
        private snackBarService: SnackBarService,
        private fb: FormBuilder,
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            email: ['11@1.1', Validators.required],
            password: ['111', Validators.required],
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    login() {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
        }

        const form = this.formGroup.value;

        this.authService
            .login(form.email, form.password)
            .pipe(
                catchError(err => {
                    console.log(err);
                    if (err.status === 400) {
                        this.isInvalidCredentials = true;
                    }

                    return throwError(err);
                }),
                takeUntil(this.unsubscribe$),
            )
            .subscribe(() => {
                this.router.navigate(['/accounts']);
            });
    }

    registration() {
        this.emailAlreadyExist = false;
        this.registrationError = false;

        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
        }

        const form = this.formGroup.value;

        this.authService
            .registration(form.email, form.password)
            .pipe(
                catchError(err => {
                    if (err.status === 409) {
                        this.emailAlreadyExist = true;
                    } else {
                        this.registrationError = true;
                    }

                    return throwError(err);
                }),
                takeUntil(this.unsubscribe$),
            )
            .subscribe(() => {
                this.snackBarService.show('Аккаунт створено успішно, будь ласка скористайтесь формою входу', 'ОК');
            });
    }
}
