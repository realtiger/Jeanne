import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'abnormal', loadChildren: () => import('./abnormal/abnormal.module').then(m => m.AbnormalModule) },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: 'abnormal/abnormal404' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'top' })],
    exports: [RouterModule]
})
export class RoutersRoutingModule {}
