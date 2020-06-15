import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { GuestModule } from './modules/guest/guest.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { UiModule } from './modules/ui/ui.module';
import { GeneratorModule } from './modules/generator/generator.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AppComponent } from './app.component';

import { AuthService } from './modules/guest/services/auth.service';
import { ErrorInterceptor } from './error.interceptor';
import { JwtInterceptor } from './jwt.interceptor';

import { BackupModule } from './modules/backup/backup.module';


@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule, //
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialModule,
        GuestModule,
        AccountsModule,
        UiModule,
        GeneratorModule,
        SettingsModule,
        BackupModule,
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
        {
            provide: APP_INITIALIZER,
            useFactory: (authService: AuthService) => () => authService.loadUser().toPromise(),
            deps: [AuthService],
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
