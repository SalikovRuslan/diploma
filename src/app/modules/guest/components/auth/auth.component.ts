import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

    constructor(private fb: FormBuilder, private authService: AuthService) {}

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            email: [],
            password: [],
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    login() {}

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
