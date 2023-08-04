import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RoleManagerService } from './role-manager.service';
import { LoadDataParams, ResponseStatus } from '../../../../types/global';
import { CreateDataParams, DeleteDataParams, DetailConfig, FormConfig, TableColumns, UpdateDataParams } from '../../../../types/layout';
import { CreateRole, UpdateRole } from '../../../../types/management/role-manager';

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
      {
        label: '姓名',
        prop: 'name',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true, message: '姓名不能为空' }]
        }
      },
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
        ]
      },
      {
        label: '角色介绍',
        prop: 'detail',
        type: 'textarea'
      }
    ]
  };
  detailConfig: DetailConfig[] = [
    {
      label: '角色名称',
      prop: 'name',
      type: 'text'
    },
    {
      label: '角色介绍',
      prop: 'detail',
      type: 'text'
    },
    {
      label: '创建时间',
      prop: 'create_time',
      type: 'date',
      dataFmt: 'yyyy-MM-dd HH:mm:ss'
    },
    {
      label: '更新时间',
      prop: 'update_time',
      type: 'date',
      dataFmt: 'yyyy-MM-dd HH:mm:ss'
    },
    {
      label: '状态',
      prop: 'status',
      type: 'text'
    },
    {
      label: '等级',
      prop: 'level',
      type: 'text'
    }
  ];

  constructor(private roleManagerService: RoleManagerService) {}

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
    const body: UpdateRole = {
      name: typeof params.formData['name'] === 'string' ? params.formData['name'].trim() : '',
      detail: typeof params.formData['detail'] === 'string' ? params.formData['detail'].trim() : '',
      level: typeof params.formData['level'] === 'string' ? parseInt(params.formData['level'], 10) : 1,
      status: ResponseStatus.ACTIVE
    };

    switch (params.formData['status']) {
      case 'inactive':
        body.status = ResponseStatus.INACTIVE;
        break;
      case 'frozen':
        body.status = ResponseStatus.FROZEN;
        break;
      case 'obsolete':
        body.status = ResponseStatus.OBSOLETE;
        break;
      default:
        body.status = ResponseStatus.ACTIVE;
    }

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
}
