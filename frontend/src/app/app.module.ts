import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { GuestModule } from './modules/guest/guest.module';
import { AuthModule } from './modules/auth/auth.module';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';

import { ErrorInterceptor } from './error.interceptor';
import { JwtInterceptor } from './jwt.interceptor';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule,
        GuestModule,
        AuthModule,

        AppRoutingModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
