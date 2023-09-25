import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DrawerService } from 'ng-devui';

import { KubeSettingsService } from './kube-settings.service';
import { ListItems, LoadDataParams } from '../../../../types/global';
import {
  CreateKubeSettingsBody,
  KubeSettings,
  KubeSettingsColumns,
  KubeSettingsCreateDefaultData,
  KubeSettingsCreateFormConfig,
  KubeSettingsDetailConfig,
  KubeSettingsUpdateFormConfig,
  ShowTitleDict,
  UpdateKubeSettingsBody
} from '../../../../types/kube-manager/kube-settings-manager';
import { BatchDeleteDataParams, CreateDataParams, DeleteDataParams, DetailDataParams, OperationsEnabled, UpdateDataParams } from '../../../../types/layout';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { PageContentService } from '../../../layouts/page-content/page-content.service';
import { BaseCrudComponentService, TransformDict } from '../../../shared/base-crud.service';
import { CommonToolsService } from '../../../shared/common-tools.service';
import { getUpdateParams } from '../../../shared/utils';
import { KubeManagerService } from '../kube-manager.service';

interface KubeSettingEnabled extends OperationsEnabled {
  changeCurrentUse: { enabled: boolean };
}

@Component({
  selector: 'app-kube-settings',
  templateUrl: './kube-settings.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KubeSettingsComponent {
  transformDict: TransformDict = [{ source: 'CreateBy', dest: 'create_by' }];
  showTitleDict = ShowTitleDict;
  columns = KubeSettingsColumns;
  createDefaultData = KubeSettingsCreateDefaultData;
  createFormConfig = KubeSettingsCreateFormConfig;
  updateFormConfig = KubeSettingsUpdateFormConfig;
  detailConfig = KubeSettingsDetailConfig;
  operationsEnabled: KubeSettingEnabled = {
    create: { enabled: this.authService.hasPermission('POST', 'kube:create-one-kube-settings') },
    update: { enabled: this.authService.hasPermission('PUT', 'kube:update-one-kube-settings') },
    delete: { enabled: this.authService.hasPermission('DELETE', 'kube:delete-one-kube-settings') },
    batchDelete: { enabled: this.authService.hasPermission('DELETE', 'kube:delete-many-kube-settings') },
    detail: { enabled: this.authService.hasPermission('GET', 'kube:get-one-kube-settings') },
    changeCurrentUse: { enabled: this.authService.hasPermission('PUT', 'kube:get-all-kube-settings') }
  };

  constructor(
    private drawerService: DrawerService,
    private commonToolsService: CommonToolsService,
    private authService: AuthService,
    private tokenService: TokenService,
    private pageContentService: PageContentService,
    private kubeSettingsService: KubeSettingsService,
    private kubeManagerService: KubeManagerService,
    private baseCrudComponentService: BaseCrudComponentService<KubeSettings, KubeSettingsService>
  ) {}

  loadDataCallback(success: boolean, data: ListItems<KubeSettings>) {
    if (success) {
      if (this.kubeManagerService.kubeSetting === null) {
        return;
      }

      for (const item of data.items) {
        item.current = item.id === this.kubeManagerService.kubeSetting.id;
      }
    }
  }

  loadData = (params: LoadDataParams) => this.baseCrudComponentService.loadData(this.kubeSettingsService, params, this.transformDict, this.loadDataCallback.bind(this));

  createKubeSettings(params: CreateDataParams) {
    const fields = this.createFormConfig.items.map(item => item.prop);

    const body: CreateKubeSettingsBody = getUpdateParams(params.formData, fields);
    this.baseCrudComponentService.createRecord(this.kubeSettingsService, body, params.callback, this.transformDict);
  }

  updateKubeSettings(params: UpdateDataParams) {
    const fields = this.updateFormConfig.items.map(item => item.prop);

    const body: UpdateKubeSettingsBody = getUpdateParams(params.formData, fields);
    this.baseCrudComponentService.updateRecord(this.kubeSettingsService, params.id, body, params.callback, this.transformDict);
  }

  deleteKubeSettings(params: DeleteDataParams) {
    this.baseCrudComponentService.deleteRecord(this.kubeSettingsService, params.id, params.callback, this.transformDict);
  }

  batchDeleteKubeSettings(params: BatchDeleteDataParams) {
    this.baseCrudComponentService.batchDeleteRecord(this.kubeSettingsService, params.ids, params.callback, this.transformDict);
  }

  getKubeSettingsDetail(params: DetailDataParams) {
    this.baseCrudComponentService.getRecordDetail(this.kubeSettingsService, params.id, params.callback, this.transformDict);
  }

  changeCurrentUse(item: KubeSettings) {
    this.kubeManagerService.kubeSettingChange$.next(item);
    this.pageContentService.reloadBehaviorSubject$.next(true);
  }
}
