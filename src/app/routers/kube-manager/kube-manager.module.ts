import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbModule, ButtonModule, CheckBoxModule, DataTableModule, DropDownModule, LayoutModule, LoadingModule, PaginationModule, SelectModule, TagsModule } from 'ng-devui';

import { KubeDashboardComponent } from './kube-dashboard/kube-dashboard.component';
import { KubeDeploymentsComponent } from './kube-deployments/kube-deployments.component';
import { KubeDeploymentsService } from './kube-deployments/kube-deployments.service';
import { KubeHeaderComponent } from './kube-header/kube-header.component';
import { KubeManagerRoutingModule } from './kube-manager-routing.module';
import { KubeManagerComponent } from './kube-manager.component';
import { KubeManagerService } from './kube-manager.service';
import { KubePodsComponent } from './kube-pods/kube-pods.component';
import { KubePodsService } from './kube-pods/kube-pods.service';
import { KubeSettingsComponent } from './kube-settings/kube-settings.component';
import { KubeSettingsService } from './kube-settings/kube-settings.service';
import { LayoutsModule } from '../../layouts/layouts.module';

@NgModule({
  declarations: [KubeManagerComponent, KubeSettingsComponent, KubeDashboardComponent, KubePodsComponent, KubeHeaderComponent, KubeDeploymentsComponent],
  imports: [
    CommonModule,
    KubeManagerRoutingModule,
    LayoutsModule,
    ButtonModule,
    CheckBoxModule,
    DataTableModule,
    DropDownModule,
    LayoutModule,
    LoadingModule,
    PaginationModule,
    TagsModule,
    BreadcrumbModule,
    SelectModule,
    FormsModule
  ],
  providers: [KubeSettingsService, KubePodsService, KubeManagerService, KubeDeploymentsService]
})
export class KubeManagerModule {}
