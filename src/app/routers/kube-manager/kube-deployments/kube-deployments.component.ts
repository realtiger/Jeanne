import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DrawerService } from 'ng-devui';
import { Subscription } from 'rxjs';

import { KubeDeploymentsService } from './kube-deployments.service';
import { ListItems, ListParams, LoadDataParams } from '../../../../types/global';
import {
  KubeDeploymentColumns,
  KubeDeploymentCreateDefaultData,
  KubeDeploymentCreateFormConfig,
  KubeDeploymentDetailConfig,
  KubeDeployments,
  KubeDeploymentTableWidthConfig,
  KubeDeploymentUpdateFormConfig,
  ShowTitleDict
} from '../../../../types/kube-manager/kube-deployments';
import { OperationsEnabled } from '../../../../types/layout';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { PageContentService } from '../../../layouts/page-content/page-content.service';
import { BaseCrudComponentService, TransformDict } from '../../../shared/base-crud.service';
import { CommonToolsService } from '../../../shared/common-tools.service';
import { KubeManagerService } from '../kube-manager.service';

@Component({
  selector: 'app-kube-deployments',
  templateUrl: './kube-deployments.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KubeDeploymentsComponent implements OnInit, OnDestroy {
  transformDict: TransformDict = [];
  showTitleDict = ShowTitleDict;
  columns = KubeDeploymentColumns;
  kubeDeploymentTableWidthConfig = KubeDeploymentTableWidthConfig;
  createDefaultData = KubeDeploymentCreateDefaultData;
  createFormConfig = KubeDeploymentCreateFormConfig;
  updateFormConfig = KubeDeploymentUpdateFormConfig;
  detailConfig = KubeDeploymentDetailConfig;
  operationsEnabled: OperationsEnabled = {
    // create: { enabled: this.authService.hasPermission('POST', 'cmdb:create-one-server-tag') },
    // update: { enabled: this.authService.hasPermission('PUT', 'cmdb:update-one-server-tag') },
    // delete: { enabled: this.authService.hasPermission('DELETE', 'cmdb:delete-one-server-tag') },
    // batchDelete: { enabled: this.authService.hasPermission('DELETE', 'cmdb:delete-many-server-tag') },
    // detail: { enabled: this.authService.hasPermission('GET', 'cmdb:get-one-server-tag') }
  };

  reload = true;
  page: ListParams = {
    index: 1,
    limit: 10
  };

  kubeNamespaceSubscription$?: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private drawerService: DrawerService,
    private commonToolsService: CommonToolsService,
    private authService: AuthService,
    private tokenService: TokenService,
    private baseCrudComponentService: BaseCrudComponentService<KubeDeployments, KubeDeploymentsService>,
    private pageContentService: PageContentService,
    private kubeDeploymentsService: KubeDeploymentsService,
    private kubeManagerService: KubeManagerService
  ) {}

  ngOnInit() {
    this.kubeNamespaceSubscription$ = this.kubeManagerService.namespaceBehaviorSubject$.subscribe(() => {
      this.pageContentService.reloadBehaviorSubject$.next(true);
    });
  }

  ngOnDestroy() {
    this.kubeNamespaceSubscription$?.unsubscribe();
  }

  loadDataCallback(success: boolean, res?: ListItems<KubeDeployments>) {
    if (success && res) {
      for (const item of res.items) {
        item.deploymentStatus = {
          status: '',
          value: `${item.status.ready}/${item.status.replicas}`
        };
        if (item.status.replicas === 0) {
          item.deploymentStatus.status = 'waiting';
        } else if (item.status.ready === item.status.replicas) {
          item.deploymentStatus.status = 'success';
        } else {
          item.deploymentStatus.status = 'warning';
        }
      }
    }
  }

  loadData(params: LoadDataParams) {
    this.baseCrudComponentService.loadData(this.kubeDeploymentsService, params, this.transformDict, this.loadDataCallback);
  }
}
