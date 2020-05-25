import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AsideComponent } from './components/aside/aside.component';

@NgModule({
    declarations: [NotFoundComponent, AsideComponent],
    imports: [
        CommonModule, //
        HttpClientModule,
    ],
})
export class SharedModule {}
