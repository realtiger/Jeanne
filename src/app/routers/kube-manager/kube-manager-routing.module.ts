import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { KubeDashboardComponent } from './kube-dashboard/kube-dashboard.component';
import { KubeDeploymentsComponent } from './kube-deployments/kube-deployments.component';
import { KubeManagerComponent } from './kube-manager.component';
import { KubePodsComponent } from './kube-pods/kube-pods.component';
import { KubeSettingsComponent } from './kube-settings/kube-settings.component';

const routes: Routes = [
  {
    path: '',
    component: KubeManagerComponent,
    children: [
      { path: 'dashboard', component: KubeDashboardComponent },
      { path: 'deployments', component: KubeDeploymentsComponent },
      { path: 'pods', component: KubePodsComponent },
      { path: 'kube-settings', component: KubeSettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KubeManagerRoutingModule {}
