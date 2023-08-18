import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RoleManagerService } from './role-manager.service';
import { LoadDataParams } from '../../../../types/global';
import { CreateDataParams, DeleteDataParams, DetailConfig, DetailDataParams, FormConfig, TableColumns, UpdateDataParams } from '../../../../types/layout';
import { CreateRole, UpdateRole } from '../../../../types/management/role-manager';
import { AuthService } from '../../../core/services/auth.service';
import { getUpdateParams } from '../../../shared/utils';

@Component({
  selector: 'app-role-manager',
  templateUrl: './role-manager.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleManagerComponent {
  showTitleDict = {
    status: {
      active: '启用',
      inactive: '禁用'
    }
  };
  roleColumns: TableColumns[] = [
    {
      field: 'name',
      header: '角色名称',
      fieldType: 'text'
    },
    {
      field: 'detail',
      header: '角色描述',
      fieldType: 'text'
    },
    {
      field: 'status',
      header: '状态',
      fieldType: 'tag'
    },
    {
      field: 'create_time',
      header: '创建时间',
      fieldType: 'date'
    }
  ];
  createDefaultData = { name: '', detail: '' };
  createFormConfig: FormConfig = {
    items: [
      {
        label: '角色名称',
        prop: 'name',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true, message: '角色名称不能为空' }]
        }
      },
      {
        label: '角色介绍',
        prop: 'detail',
        type: 'textarea'
      }
    ]
  };
  updateFormConfig: FormConfig = {
    items: [
      ...this.createFormConfig.items,
      {
        label: '等级',
        prop: 'level',
        type: 'number',
        rule: {
          validators: [
            { required: true, message: '等级不能为空' },
            { min: 1, message: '等级不能小于1' }
          ]
        }
      },
      {
        label: '状态',
        prop: 'status',
        type: 'select',
        options: [
          { label: '启用', value: 'active' },
          { label: '禁用', value: 'inactive' }
        ],
        helpTips: '超级管理员才可以进行修改'
      }
    ]
  };
  detailConfig: DetailConfig[] = [
    ...this.updateFormConfig.items,
    {
      label: '创建时间',
      prop: 'create_time',
      type: 'datePicker',
      dataFmt: 'yyyy-MM-dd HH:mm:ss'
    },
    {
      label: '更新时间',
      prop: 'update_time',
      type: 'datePicker',
      dataFmt: 'yyyy-MM-dd HH:mm:ss'
    }
  ];
  optionsEnabled = {
    create: this.authService.hasPermission('POST', 'system:create-one-role'),
    update: this.authService.hasPermission('PUT', 'system:update-one-role'),
    delete: this.authService.hasPermission('DELETE', 'system:delete-one-role'),
    detail: this.authService.hasPermission('GET', 'system:get-one-role')
  };

  constructor(private authService: AuthService, private roleManagerService: RoleManagerService) {}

  loadData(params: LoadDataParams) {
    this.roleManagerService.getRoleList(params.params).subscribe({
      next: res => {
        params.callback(true, res);
      },
      error: () => {
        params.callback(false);
      }
    });
  }

  createRole(params: CreateDataParams) {
    const body: CreateRole = {
      name: typeof params.formData['name'] === 'string' ? params.formData['name'].trim() : '',
      detail: typeof params.formData['detail'] === 'string' ? params.formData['detail'].trim() : ''
    };
    this.roleManagerService.createRole(body).subscribe({
      next: res => {
        params.callback(true, res);
      },
      error: () => {
        params.callback(false);
      }
    });
  }

  updateRole(params: UpdateDataParams) {
    const body: UpdateRole = getUpdateParams(params.formData, ['name', 'detail', 'level', 'status']);

    this.roleManagerService.updateRole(params.id, body).subscribe({
      next: res => {
        params.callback(true, res);
      },
      error: () => {
        params.callback(false);
      }
    });
  }

  deleteRole(params: DeleteDataParams) {
    this.roleManagerService.deleteRole(params.id).subscribe({
      next: res => {
        params.callback(true, res);
      },
      error: () => {
        params.callback(false);
      }
    });
  }

  getRoleDetail(params: DetailDataParams) {
    this.roleManagerService.getRoleDetail(params.id).subscribe({
      next: res => {
        params.callback(true, res);
      },
      error: () => {
        params.callback(false);
      }
    });
  }
}
