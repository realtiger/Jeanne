import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { EmptyListItems, ListItems, ListParams, UniversalResponse } from '../../../../types/global';
import { CreatePermission, Permission, UpdatePermission } from '../../../../types/management/permission-manager';
import { genHttpParams } from '../../../shared/utils';

@Injectable()
export class PermissionManagerService {
  constructor(private http: HttpClient) {}

  getPermissionList(listParams: ListParams) {
    const url = '/api/admin/permission';
    const params = genHttpParams(listParams);

    return this.http.get<UniversalResponse<ListItems<Permission>>>(url, { params }).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          return EmptyListItems;
        }
      })
    );
  }

  createPermission(permission: CreatePermission) {
    const url = '/api/admin/permission';
    return this.http.post<UniversalResponse<Permission>>(url, permission).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          throw new Error(res.message);
        }
      })
    );
  }

  updatePermission(id: number, permission: UpdatePermission) {
    const url = `/api/admin/permission/${id}`;
    return this.http.put<UniversalResponse<Permission>>(url, permission).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          throw new Error(res.message);
        }
      })
    );
  }

  deletePermission(id: number) {
    const url = `/api/admin/permission/${id}`;
    return this.http.delete<UniversalResponse<Permission>>(url).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          throw new Error(res.message);
        }
      })
    );
  }

  getPermissionDetail(id: number) {
    const url = `/api/admin/permission/${id}`;
    return this.http.get<UniversalResponse<Permission>>(url).pipe(
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
