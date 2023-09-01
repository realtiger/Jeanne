import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ServerManagerService } from './server-manager.service';
import {
  CreateServerBody,
  Server,
  ServerColumns,
  ServerCreateDefaultData,
  ServerCreateFormConfig,
  ServerDetailConfig,
  ServerUpdateFormConfig,
  ShowTitleDict,
  UpdateServerBody
} from '../../../../types/assets-manager/server-manager';
import { LoadDataParams } from '../../../../types/global';
import { CreateDataParams, DeleteDataParams, DetailDataParams, UpdateDataParams } from '../../../../types/layout';
import { AuthService } from '../../../core/services/auth.service';
import { BaseCrudComponentService } from '../../../shared/base-crud.service';
import { getUpdateParams } from '../../../shared/utils';

@Component({
  selector: 'app-server-manager',
  templateUrl: './server-manager.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerManagerComponent {
  transformDict: Array<string | { source: string; dest: string }> = [];
  showTitleDict = ShowTitleDict;
  columns = ServerColumns;
  createDefaultData = ServerCreateDefaultData;
  createFormConfig = ServerCreateFormConfig;
  updateFormConfig = ServerUpdateFormConfig;
  detailConfig = ServerDetailConfig;
  optionsEnabled = {
    create: this.authService.hasPermission('POST', 'system:create-one-role'),
    update: this.authService.hasPermission('PUT', 'system:update-one-role'),
    delete: this.authService.hasPermission('DELETE', 'system:delete-one-role'),
    detail: this.authService.hasPermission('GET', 'system:get-one-role')
  };

  constructor(
    private authService: AuthService,
    private serverManagerService: ServerManagerService,
    private baseCrudComponentService: BaseCrudComponentService<Server, ServerManagerService>
  ) {
    // 将 updateFormConfig.items 和 createFormConfig.items 进行合并，以 prop 字段作为唯一标识
    const allFormConfig = [...this.updateFormConfig.items, ...this.createFormConfig.items];
    for (const i of allFormConfig) {
      switch (i.prop) {
        case 'serverType':
          this.transformDict.push({ source: 'serverType', dest: 'server_type' });
          break;
        case 'CreateBy':
          this.transformDict.push({ source: 'CreateBy', dest: 'create_by' });
          break;
        case 'managerIp':
          this.transformDict.push({ source: 'managerIp', dest: 'manager_ip' });
          break;
        case 'privateIp':
          this.transformDict.push({ source: 'privateIp', dest: 'private_ip' });
          break;
        case 'publicIp':
          this.transformDict.push({ source: 'publicIp', dest: 'public_ip' });
          break;
        case 'adminUser':
          this.transformDict.push({ source: 'adminUser', dest: 'admin_user' });
          break;
        default:
          this.transformDict.push(i.prop);
      }
    }
  }

  loadData = (params: LoadDataParams) => this.baseCrudComponentService.loadData(this.serverManagerService, params, this.transformDict);

  createServer(params: CreateDataParams) {
    const body: CreateServerBody = getUpdateParams(params.formData, this.transformDict);
    body.created_by = 'Manual';
    this.baseCrudComponentService.createRecord(this.serverManagerService, body, params.callback, this.transformDict);
  }

  updateServer(params: UpdateDataParams) {
    const body: UpdateServerBody = getUpdateParams(params.formData, this.transformDict);
    this.baseCrudComponentService.updateRecord(this.serverManagerService, params.id, body, params.callback, this.transformDict);
  }

  deleteServer(params: DeleteDataParams) {
    this.baseCrudComponentService.deleteRecord(this.serverManagerService, params.id, params.callback, this.transformDict);
  }

  getServerDetail(params: DetailDataParams) {
    this.baseCrudComponentService.getRecordDetail(this.serverManagerService, params.id, params.callback, this.transformDict);
  }
}
