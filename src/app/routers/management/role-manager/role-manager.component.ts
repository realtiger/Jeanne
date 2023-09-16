import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RoleManagerService } from './role-manager.service';
import { LoadDataParams } from '../../../../types/global';
import { CreateDataParams, DeleteDataParams, DetailDataParams, OperationsEnabled, UpdateDataParams } from '../../../../types/layout';
import {
  CreateRole,
  Role,
  RoleColumns,
  RoleCreateDefaultData,
  RoleCreateFormConfig,
  RoleDetailConfig,
  RoleUpdateFormConfig,
  ShowTitleDict,
  UpdateRole
} from '../../../../types/management/role-manager';
import { AuthService } from '../../../core/services/auth.service';
import { BaseCrudComponentService } from '../../../shared/base-crud.service';
import { getUpdateParams } from '../../../shared/utils';

@Component({
  selector: 'app-role-manager',
  templateUrl: './role-manager.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleManagerComponent {
  showTitleDict = ShowTitleDict;
  roleColumns = RoleColumns;
  createDefaultData = RoleCreateDefaultData;
  createFormConfig = RoleCreateFormConfig;
  updateFormConfig = RoleUpdateFormConfig;
  detailConfig = RoleDetailConfig;
  operationsEnabled: OperationsEnabled = {
    create: { enabled: this.authService.hasPermission('POST', 'system:create-one-role') },
    update: { enabled: this.authService.hasPermission('PUT', 'system:update-one-role') },
    delete: { enabled: this.authService.hasPermission('DELETE', 'system:delete-one-role') },
    detail: { enabled: this.authService.hasPermission('GET', 'system:get-one-role') }
  };

  constructor(
    private authService: AuthService,
    private roleManagerService: RoleManagerService,
    private baseCrudComponentService: BaseCrudComponentService<Role, RoleManagerService>
  ) {}

  loadData = (params: LoadDataParams) => this.baseCrudComponentService.loadData(this.roleManagerService, params);

  createRole(params: CreateDataParams) {
    const body: CreateRole = {
      name: typeof params.formData['name'] === 'string' ? params.formData['name'].trim() : '',
      detail: typeof params.formData['detail'] === 'string' ? params.formData['detail'].trim() : ''
    };

    this.baseCrudComponentService.createRecord(this.roleManagerService, body, params.callback);
  }

  updateRole(params: UpdateDataParams) {
    const body: UpdateRole = getUpdateParams(params.formData, ['name', 'detail', 'level', 'status']);
    this.baseCrudComponentService.updateRecord(this.roleManagerService, params.id, body, params.callback);
  }

  deleteRole(params: DeleteDataParams) {
    this.baseCrudComponentService.deleteRecord(this.roleManagerService, params.id, params.callback);
  }

  getRoleDetail(params: DetailDataParams) {
    this.baseCrudComponentService.getRecordDetail(this.roleManagerService, params.id, params.callback);
  }
}
