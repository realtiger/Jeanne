import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ListParams } from '../../../../types/global';
import { ServiceWithBaseCrud } from '../../../../types/layout';
import { CreateRole, Role, UpdateRole } from '../../../../types/management/role-manager';
import { BaseCrudService } from '../../../shared/base-crud.service';

@Injectable()
export class RoleManagerService implements ServiceWithBaseCrud {
  constructor(private http: HttpClient, private baseCrudService: BaseCrudService) {}

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
}
