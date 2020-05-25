import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'guest-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.less'],
})
export class AuthComponent implements OnInit, OnDestroy {
    formGroup: FormGroup;

    unsubscribe$ = new Subject();

    constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {}

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            email: ['1@1.1'],
            password: ['1@1.1'],
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    login() {
        const form = this.formGroup.value;

        this.authService
            .login(form.email, form.password)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
                this.router.navigate(['/accounts']);
            });
    }

    registration() {
        const form = this.formGroup.value;

        this.authService
            .registration(form.email, form.password)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                console.log('success');
                console.log(data);
            });
    }
}
