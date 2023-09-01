import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CreateServerBody, Server, UpdateServerBody } from '../../../../types/assets-manager/server-manager';
import { ListParams } from '../../../../types/global';
import { ServiceWithBaseCrud } from '../../../../types/layout';
import { BaseCrudService } from '../../../shared/base-crud.service';

@Injectable()
export class ServerManagerService implements ServiceWithBaseCrud {
  constructor(private http: HttpClient, private baseCrudService: BaseCrudService) {}

  getRecordList(listParams: ListParams) {
    const url = '/api/cmdb/server';
    return this.baseCrudService.getRecordList<Server>(url, listParams);
  }

  createRecord(server: CreateServerBody) {
    const url = '/api/cmdb/server';
    return this.baseCrudService.createRecord<Server, CreateServerBody>(url, server);
  }

  updateRecord(id: number, server: UpdateServerBody) {
    const url = `/api/cmdb/server/${id}`;
    return this.baseCrudService.updateRecord<Server, UpdateServerBody>(url, server);
  }

  deleteRecord(id: number) {
    const url = `/api/cmdb/server/${id}`;
    return this.baseCrudService.deleteRecord<Server>(url);
  }

  getRecordDetail(id: number) {
    const url = `/api/cmdb/server/${id}`;
    return this.baseCrudService.getRecordDetail<Server>(url);
  }
}
