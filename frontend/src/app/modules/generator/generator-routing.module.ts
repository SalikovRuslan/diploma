import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../auth.guard';

import { GeneratorComponent } from './components/generator/generator.component';

const routes: Routes = [
    {
        path: 'generation',
        canActivate: [AuthGuard],
        component: GeneratorComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GeneratorRoutingModule {}
