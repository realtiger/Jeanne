import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { ListParams, UniversalResponse } from '../../../../types/global';
import { ServiceWithBaseCrud } from '../../../../types/layout';
import { CreateRole, Role, UpdateRole } from '../../../../types/management/role-manager';
import { CommonToastService } from '../../../core/services/common-toast.service';
import { BaseCrudService } from '../../../shared/base-crud.service';

@Injectable()
export class RoleManagerService implements ServiceWithBaseCrud {
  constructor(private http: HttpClient, private commonToastService: CommonToastService, private baseCrudService: BaseCrudService) {}

  getRecordList(listParams: ListParams) {
    const url = '/api/admin/role';
    return this.baseCrudService.getRecordList<Role>(url, listParams);
  }

  createRecord(role: CreateRole) {
    const url = '/api/admin/role';
    return this.baseCrudService.createRecord<Role, CreateRole>(url, role);
  }

  updateRecord(id: number, role: UpdateRole) {
    const url = `/api/admin/role/${id}`;
    return this.baseCrudService.updateRecord<Role, UpdateRole>(url, role);
  }

  deleteRecord(id: number) {
    const url = `/api/admin/role/${id}`;
    return this.baseCrudService.deleteRecord<Role>(url);
  }

  getRecordDetail(id: number) {
    const url = `/api/admin/role/${id}`;
    return this.baseCrudService.getRecordDetail<Role>(url);
  }

  updateRolePermissions(id: number, permissions: number[]) {
    const url = `/api/admin/role/${id}/permissions`;

    return this.http.put<UniversalResponse<Role>>(url, { permissions }).pipe(
      map(res => {
        if (res.success) {
          this.commonToastService.success('更新角色的权限成功', '更新角色的权限成功');
          return res.data;
        } else {
          this.commonToastService.error('更新角色的权限失败', `${res.code}: ${res.message}`);
          throw new Error(res.message);
        }
      })
    );
  }
}
