import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from '../core/services/auth.guard';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'abnormal', loadChildren: () => import('./abnormal/abnormal.module').then(m => m.AbnormalModule) },
  {
    path: '',
    canActivate: [authGuard],
    children: [{ path: 'manage', loadChildren: () => import('./management/management.module').then(m => m.ManagementModule) }]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'passport', loadChildren: () => import('./passport/passport.module').then(m => m.PassportModule) },
  { path: '**', redirectTo: 'abnormal/abnormal404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class RoutersRoutingModule {}
