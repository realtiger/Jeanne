import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { DialogService, DrawerService, ModalComponent } from 'ng-devui';

import { ServerAdminManagerService } from './server-admin-manager.service';
import {
  CreateServerAdminInfoBody,
  ServerAdminColumns,
  ServerAdminCreateDefaultData,
  ServerAdminCreateFormConfig,
  ServerAdminDetailConfig,
  ServerAdminInfo,
  ServerAdminUpdateFormConfig,
  ShowTitleDict,
  UpdateServerAdminInfoBody
} from '../../../../types/assets-manager/server-admin-manager';
import { LoadDataParams } from '../../../../types/global';
import { BatchDeleteDataParams, CreateDataParams, DeleteDataParams, DetailDataParams, OperationsEnabled, UpdateDataParams } from '../../../../types/layout';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { BaseCrudComponentService } from '../../../shared/base-crud.service';
import { CommonToolsService } from '../../../shared/common-tools.service';
import { getUpdateParams } from '../../../shared/utils';

@Component({
  selector: 'app-server-admin-manager',
  templateUrl: './server-admin-manager.component.html',
  styles: [
    `
      .operation-dialog d-col {
        margin: 10px 0;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerAdminManagerComponent {
  @ViewChild('serverAdminOperationDialogTemplate', { static: true }) serverAdminOperationDialogTemplate: TemplateRef<any> | undefined;

  columns = ServerAdminColumns;
  showTitleDict = ShowTitleDict;
  createDefaultData = ServerAdminCreateDefaultData;
  createFormConfig = ServerAdminCreateFormConfig;
  updateFormConfig = ServerAdminUpdateFormConfig;
  detailConfig = ServerAdminDetailConfig;
  operationsEnabled: OperationsEnabled = {
    create: { enabled: this.authService.hasPermission('POST', 'cmdb:create-one-server-admin-info') },
    update: { enabled: this.authService.hasPermission('PUT', 'cmdb:update-one-server-admin-info') },
    delete: { enabled: this.authService.hasPermission('DELETE', 'cmdb:delete-one-server-admin-info') },
    batchDelete: { enabled: this.authService.hasPermission('DELETE', 'cmdb:delete-many-sserver-admin-info') },
    detail: { enabled: this.authService.hasPermission('GET', 'cmdb:get-one-server-admin-info') }
  };

  modelRef: { modalInstance: ModalComponent } | null = null;
  selectedServerAdminInfo: ServerAdminInfo | null = null;
  ipmiResultContent = '';

  constructor(
    private drawerService: DrawerService,
    private dialogService: DialogService,
    private commonToolsService: CommonToolsService,
    private authService: AuthService,
    private tokenService: TokenService,
    private baseCrudComponentService: BaseCrudComponentService<ServerAdminInfo, ServerAdminManagerService>,
    private serverAdminManagerService: ServerAdminManagerService
  ) {}

  loadData = (params: LoadDataParams) => this.baseCrudComponentService.loadData(this.serverAdminManagerService, params);

  createTag(params: CreateDataParams) {
    const fields = this.createFormConfig.items.map(item => item.prop);

    const body: CreateServerAdminInfoBody = getUpdateParams(params.formData, fields);
    this.baseCrudComponentService.createRecord(this.serverAdminManagerService, body, params.callback);
  }

  updateTag(params: UpdateDataParams) {
    const fields = this.updateFormConfig.items.map(item => item.prop);

    const body: UpdateServerAdminInfoBody = getUpdateParams(params.formData, fields);
    this.baseCrudComponentService.updateRecord(this.serverAdminManagerService, params.id, body, params.callback);
  }

  deleteTag(params: DeleteDataParams) {
    this.baseCrudComponentService.deleteRecord(this.serverAdminManagerService, params.id, params.callback);
  }

  batchDeleteTag(params: BatchDeleteDataParams) {
    this.baseCrudComponentService.batchDeleteRecord(this.serverAdminManagerService, params.ids, params.callback);
  }

  getTagDetail(params: DetailDataParams) {
    this.baseCrudComponentService.getRecordDetail(this.serverAdminManagerService, params.id, params.callback);
  }

  openOperationDialog(data: ServerAdminInfo) {
    this.serverAdminManagerService.runServerAdminCommand(data.id, 'status').subscribe({
      next: res => {
        this.ipmiResultContent = `服务器运行状态：${res.output}`;
        if (this.serverAdminOperationDialogTemplate) {
          this.modelRef = this.dialogService.open({
            id: 'server-admin-operation-dialog',
            width: '600px',
            maxHeight: '600px',
            title: '运行服务器管理命令',
            contentTemplate: this.serverAdminOperationDialogTemplate,
            backdropCloseable: false,
            onClose: () => {
              this.selectedServerAdminInfo = null;
            },
            buttons: []
          });
        }
      }
    });
  }
}
