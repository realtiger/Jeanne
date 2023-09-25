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
    children: [
      { path: 'system-manager', loadChildren: () => import('./system-manager/system-manager.module').then(m => m.SystemManagerModule) },
      { path: 'system', loadChildren: () => import('./management/management.module').then(m => m.ManagementModule) },
      { path: 'assets-manager', loadChildren: () => import('./assets-manager/assets-manager.module').then(m => m.AssetsManagerModule) },
      { path: 'kube', loadChildren: () => import('./kube-manager/kube-manager.module').then(m => m.KubeManagerModule) }
    ]
  },
  { path: '**', redirectTo: 'abnormal/abnormal404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class RoutersRoutingModule {}
