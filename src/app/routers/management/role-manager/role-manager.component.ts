import { ChangeDetectionStrategy, ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { DialogService, ModalComponent } from 'ng-devui';

import { RoleManagerService } from './role-manager.service';
import { LoadDataParams } from '../../../../types/global';
import { CreateDataParams, DeleteDataParams, DetailDataParams, OperationsEnabled, UpdateDataParams } from '../../../../types/layout';
import { Permission } from '../../../../types/management/permission-manager';
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
import { PermissionManagerService } from '../permission-manager/permission-manager.service';

interface RolePermissions extends Permission {
  $checked?: boolean;
}

@Component({
  selector: 'app-role-manager',
  templateUrl: './role-manager.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleManagerComponent {
  @ViewChild('setPermissionTemplate', { static: true }) setPermissionTemplate: TemplateRef<any> | undefined;

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

  modelRef: { modalInstance: ModalComponent } | null = null;
  permissions: RolePermissions[] = [];
  rolePermissions: RolePermissions[] = [];
  selectRole: Role | null = null;
  rolePermissionsAllChecked = false;
  permissionsLoading = false;
  permissionsPage = {
    index: 1,
    limit: 10,
    total: 0
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private authService: AuthService,
    private roleManagerService: RoleManagerService,
    private baseCrudComponentService: BaseCrudComponentService<Role, RoleManagerService>,
    private permissionManagerService: PermissionManagerService
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

  // ###### begin 角色权限管理 #######
  openSetRoleForm(row: Role) {
    // 初始化操作
    this.permissionsPage = {
      index: 1,
      limit: 10,
      total: 0
    };
    this.rolePermissions = [];
    this.permissions = [];

    this.selectRole = row;
    this.permissionsLoading = true;
    if (this.selectRole.permissions.length > 0) {
      this.permissionManagerService
        .getPermissionList({
          index: this.permissionsPage.index,
          limit: this.selectRole.permissions.length,
          ids: this.selectRole.permissions
        })
        .subscribe({
          next: value => {
            this.rolePermissions = value.items;
            this.loadPermissions();
          }
        });
    } else {
      this.loadPermissions();
    }

    if (this.setPermissionTemplate) {
      this.modelRef = this.dialogService.open({
        id: 'set-permission-dialog',
        width: '600px',
        maxHeight: '600px',
        title: '设置角色的权限',
        contentTemplate: this.setPermissionTemplate,
        backdropCloseable: true,
        onClose: () => {
          this.selectRole = null;
        },
        buttons: []
      });
    }
  }

  closeSetRoleForm() {
    this.modelRef?.modalInstance.hide();
  }

  loadPermissions(index = 1, limit = 10) {
    this.permissionsLoading = true;
    this.permissionManagerService.getPermissionList({ index, limit }).subscribe({
      next: value => {
        this.permissionsLoading = false;
        this.permissions = [];
        for (const permission of value.items) {
          if (this.rolePermissions.findIndex(item => item.id === permission.id) === -1) {
            this.permissions.push({ ...permission, $checked: false });
          } else {
            this.permissions.push({ ...permission, $checked: true });
          }
        }
        this.rolePermissionsAllChecked = true;
        for (const permission of this.permissions) {
          if (!permission.$checked) {
            this.rolePermissionsAllChecked = false;
            break;
          }
        }
        this.permissionsPage = value.pagination;
        this.cdr.detectChanges();
      }
    });
  }

  checkStatusChange(item: RolePermissions) {
    if (item.$checked) {
      this.rolePermissions = [...this.rolePermissions, item].sort((a, b) => a.id - b.id);
      this.rolePermissionsAllChecked = true;
      for (const permission of this.permissions) {
        if (!permission.$checked) {
          this.rolePermissionsAllChecked = false;
          break;
        }
      }
    } else {
      this.rolePermissionsAllChecked = false;
      const index = this.rolePermissions.findIndex(permission => permission.id === item.id);
      if (index !== -1) {
        this.rolePermissions.splice(index, 1);
      }
    }
  }

  checkAllRolePermissions() {
    for (const permission of this.permissions) {
      permission.$checked = this.rolePermissionsAllChecked;
    }

    if (this.rolePermissionsAllChecked) {
      for (const permission of this.permissions) {
        if (this.rolePermissions.findIndex(item => item.id === permission.id) === -1) {
          this.rolePermissions = [...this.rolePermissions, permission];
        }
        this.rolePermissions = this.rolePermissions.sort((a, b) => a.id - b.id);
      }
    } else {
      for (const permission of this.permissions) {
        const index = this.rolePermissions.findIndex(item => item.id === permission.id);
        if (index !== -1) {
          this.rolePermissions.splice(index, 1);
        }
      }
    }
  }

  rolePermissionsPageSizeChange(pageSize: number) {
    this.loadPermissions(this.permissionsPage.index, pageSize);
  }

  rolePermissionsPageIndexChange(pageIndex: number) {
    this.loadPermissions(pageIndex, this.permissionsPage.limit);
  }

  updateRolePermissions() {
    this.permissionsLoading = true;
    const userId = this.selectRole?.id || 0;
    const roleIds = this.rolePermissions.map(item => item.id);

    if (userId === 0) {
      this.permissionsLoading = false;
      return;
    }
    if (this.selectRole?.permissions.length === roleIds.length) {
      let isSame = true;
      for (const roleId of roleIds) {
        if (this.selectRole.permissions.findIndex(item => item === roleId) === -1) {
          isSame = false;
          break;
        }
      }
      if (isSame) {
        this.permissionsLoading = false;
        return;
      }
    }

    this.roleManagerService.updateRolePermissions(userId, roleIds).subscribe({
      next: value => {
        this.permissionsLoading = false;
        if (this.selectRole) {
          this.selectRole.permissions = value.permissions;
        }
      },
      error: () => {
        this.permissionsLoading = false;
      }
    });
  }

  // ###### end 角色权限管理 #######
}
