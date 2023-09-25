import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DrawerService } from 'ng-devui';

import { KubePodsService } from './kube-pods.service';
import { LoadDataParams } from '../../../../types/global';
import {
  KubePods,
  KubePodsColumns,
  KubePodsCreateDefaultData,
  KubePodsCreateFormConfig,
  KubePodsDetailConfig,
  KubePodsTableWidthConfig,
  KubePodsUpdateFormConfig,
  ShowTitleDict
} from '../../../../types/kube-manager/kube-pods';
import { OperationsEnabled } from '../../../../types/layout';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { BaseCrudComponentService, TransformDict } from '../../../shared/base-crud.service';
import { CommonToolsService } from '../../../shared/common-tools.service';

@Component({
  selector: 'app-kube-pods',
  templateUrl: './kube-pods.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KubePodsComponent {
  transformDict: TransformDict = [];
  showTitleDict = ShowTitleDict;
  columns = KubePodsColumns;
  kubePodsTableWidthConfig = KubePodsTableWidthConfig;
  createDefaultData = KubePodsCreateDefaultData;
  createFormConfig = KubePodsCreateFormConfig;
  updateFormConfig = KubePodsUpdateFormConfig;
  detailConfig = KubePodsDetailConfig;
  operationsEnabled: OperationsEnabled = {};

  constructor(
    private drawerService: DrawerService,
    private commonToolsService: CommonToolsService,
    private authService: AuthService,
    private tokenService: TokenService,
    private kubePodsService: KubePodsService,
    private baseCrudComponentService: BaseCrudComponentService<KubePods, KubePodsService>
  ) {}

  loadData = (params: LoadDataParams) => this.baseCrudComponentService.loadData(this.kubePodsService, params, this.transformDict);
}
