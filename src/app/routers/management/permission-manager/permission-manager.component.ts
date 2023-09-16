import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PermissionManagerService } from './permission-manager.service';
import { LoadDataParams } from '../../../../types/global';
import { CreateDataParams, DeleteDataParams, DetailConfig, DetailDataParams, FormConfig, OperationsEnabled, TableColumns, UpdateDataParams } from '../../../../types/layout';
import { CreatePermission, UpdatePermission } from '../../../../types/management/permission-manager';
import { AuthService } from '../../../core/services/auth.service';
import { getUpdateParams } from '../../../shared/utils';

@Component({
  selector: 'app-permission-manager',
  templateUrl: './permission-manager.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionManagerComponent {
  showTitleDict = {
    status: {
      active: '启用',
      inactive: '禁用'
    },
    is_external: {
      true: '外部链接',
      false: '内部链接'
    }
  };
  permissionColumns: TableColumns[] = [
    {
      field: 'title',
      header: '权限名称',
      fieldType: 'text'
    },
    {
      field: 'url',
      header: 'url正则',
      fieldType: 'text'
    },
    {
      field: 'code',
      header: '权限代码',
      fieldType: 'text'
    },
    {
      field: 'method',
      header: '请求方法',
      fieldType: 'text'
    },
    {
      field: 'status',
      header: '状态',
      fieldType: 'tag'
    },
    {
      field: 'is_external',
      header: '外部链接',
      fieldType: 'tag'
    },
    {
      field: 'create_time',
      header: '创建时间',
      fieldType: 'date'
    }
  ];
  operationsEnabled: OperationsEnabled = {
    create: { enabled: this.authService.hasPermission('POST', 'system:create-one-permission') },
    update: { enabled: this.authService.hasPermission('PUT', 'system:update-one-permission') },
    delete: { enabled: this.authService.hasPermission('DELETE', 'system:delete-one-permission') },
    detail: { enabled: this.authService.hasPermission('GET', 'system:get-one-permission') }
  };

  createDefaultData = { title: '', url: '', method: 'GET', code: '' };
  createFormConfig: FormConfig = {
    items: [
      {
        label: '权限名称',
        prop: 'title',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true, message: '权限名称不能为空' }]
        }
      },
      {
        label: '权限代码',
        prop: 'code',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true, message: '权限代码不能为空' }]
        }
      },
      {
        label: 'url正则',
        prop: 'url',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true, message: 'url正则不能为空' }]
        }
      },
      {
        label: '请求方法',
        prop: 'method',
        type: 'select',
        options: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' },
          { label: 'PATCH', value: 'PATCH' }
        ]
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

  constructor(private authService: AuthService, private permissionManagerService: PermissionManagerService) {}

  loadData(params: LoadDataParams) {
    this.permissionManagerService.getPermissionList(params.params).subscribe({
      next: res => {
        params.callback(true, res);
      },
      error: () => {
        params.callback(false);
      }
    });
  }

  createPermission(params: CreateDataParams) {
    const body: CreatePermission = getUpdateParams(params.formData, ['title', 'url', 'method', 'code']);
    this.permissionManagerService.createPermission(body).subscribe({
      next: res => {
        params.callback(true, res);
      },
      error: () => {
        params.callback(false);
      }
    });
  }

  updatePermission(params: UpdateDataParams) {
    const body: UpdatePermission = getUpdateParams(params.formData, ['title', 'url', 'method', 'code', 'level', 'status']);

    this.permissionManagerService.updatePermission(params.id, body).subscribe({
      next: res => {
        params.callback(true, res);
      },
      error: () => {
        params.callback(false);
      }
    });
  }

  deletePermission(params: DeleteDataParams) {
    this.permissionManagerService.deletePermission(params.id).subscribe({
      next: res => {
        params.callback(true, res);
      },
      error: () => {
        params.callback(false);
      }
    });
  }

  getPermissionDetail(params: DetailDataParams) {
    this.permissionManagerService.getPermissionDetail(params.id).subscribe({
      next: res => {
        params.callback(true, res);
      },
      error: () => {
        params.callback(false);
      }
    });
  }
}
