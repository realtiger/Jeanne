import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from '../core/services/auth.guard';
import { OverallLayoutComponent } from '../layouts/overall-layout/overall-layout.component';

const routes: Routes = [
  { path: 'abnormal', loadChildren: () => import('./abnormal/abnormal.module').then(m => m.AbnormalModule) },
  { path: 'passport', loadChildren: () => import('./passport/passport.module').then(m => m.PassportModule) },
  {
    path: '',
    component: OverallLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    component: OverallLayoutComponent,
    canActivate: [authGuard],
    children: [{ path: 'system', loadChildren: () => import('./management/management.module').then(m => m.ManagementModule) }]
  },
  { path: '**', redirectTo: 'abnormal/abnormal404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class RoutersRoutingModule {}
