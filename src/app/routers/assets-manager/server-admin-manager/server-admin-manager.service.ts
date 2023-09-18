import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { CreateServerAdminInfoBody, ServerAdminInfo, ServerAdminOperation, UpdateServerAdminInfoBody } from '../../../../types/assets-manager/server-admin-manager';
import { ListParams, UniversalResponse } from '../../../../types/global';
import { BaseCrudService } from '../../../shared/base-crud.service';

@Injectable()
export class ServerAdminManagerService {
  constructor(private http: HttpClient, private baseCrudService: BaseCrudService) {}

  getRecordList(listParams: ListParams) {
    const url = '/api/cmdb/server-admin-info';
    return this.baseCrudService.getRecordList<ServerAdminInfo>(url, listParams);
  }

  createRecord(tag: CreateServerAdminInfoBody) {
    const url = '/api/cmdb/server-admin-info';
    return this.baseCrudService.createRecord<ServerAdminInfo, CreateServerAdminInfoBody>(url, tag);
  }

  updateRecord(id: number, tag: UpdateServerAdminInfoBody) {
    const url = `/api/cmdb/server-admin-info/${id}`;
    return this.baseCrudService.updateRecord<ServerAdminInfo, UpdateServerAdminInfoBody>(url, tag);
  }

  deleteRecord(id: number) {
    const url = `/api/cmdb/server-admin-info/${id}`;
    return this.baseCrudService.deleteRecord<ServerAdminInfo>(url);
  }

  batchDeleteRecord(ids: number[]) {
    const url = '/api/cmdb/server-admin-info';
    return this.baseCrudService.batchDeleteRecord<ServerAdminInfo>(url, ids);
  }

  getRecordDetail(id: number) {
    const url = `/api/cmdb/server-admin-info/${id}`;
    return this.baseCrudService.getRecordDetail<ServerAdminInfo>(url);
  }

  runServerAdminCommand(id: number, operation: 'status') {
    const url = `/api/cmdb/server-admin-info/exec/${id}`;
    return this.http.post<UniversalResponse<ServerAdminOperation>>(url, { operation }).pipe(
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
