import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { EmptyListItems, ListItems, ListParams, UniversalResponse } from '../../../../types/global';
import { CreateRole, Role, UpdateRole } from '../../../../types/management/role-manager';
import { genHttpParams } from '../../../shared/utils';

@Injectable()
export class RoleManagerService {
  constructor(private http: HttpClient) {}

  getRoleList(listParams: ListParams) {
    const url = '/api/admin/role';
    const params = genHttpParams(listParams);

    return this.http.get<UniversalResponse<ListItems<Role>>>(url, { params }).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          return EmptyListItems;
        }
      })
    );
  }

  createRole(role: CreateRole) {
    const url = '/api/admin/role';
    return this.http.post<UniversalResponse<Role>>(url, role).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          throw new Error(res.message);
        }
      })
    );
  }

  updateRole(id: number, role: UpdateRole) {
    const url = `/api/admin/role/${id}`;
    return this.http.put<UniversalResponse<Role>>(url, role).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          throw new Error(res.message);
        }
      })
    );
  }

  deleteRole(id: number) {
    const url = `/api/admin/role/${id}`;
    return this.http.delete<UniversalResponse<Role>>(url).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          throw new Error(res.message);
        }
      })
    );
  }

  getRoleDetail(id: number) {
    const url = `/api/admin/role/${id}`;
    return this.http.get<UniversalResponse<Role>>(url).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          throw new Error(res.message);
        }
      })
    );
  }
}
