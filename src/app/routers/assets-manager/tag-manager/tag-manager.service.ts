import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CreateTagBody, Tag, UpdateTagBody } from '../../../../types/assets-manager/tag-manager';
import { ListParams } from '../../../../types/global';
import { BaseCrudService } from '../../../shared/base-crud.service';

@Injectable()
export class TagManagerService {
  constructor(private http: HttpClient, private baseCrudService: BaseCrudService) {}

  getRecordList(listParams: ListParams) {
    const url = '/api/cmdb/server_tag';
    return this.baseCrudService.getRecordList<Tag>(url, listParams);
  }

  createRecord(tag: CreateTagBody) {
    const url = '/api/cmdb/server_tag';
    return this.baseCrudService.createRecord<Tag, CreateTagBody>(url, tag);
  }

  updateRecord(id: number, tag: UpdateTagBody) {
    const url = `/api/cmdb/server_tag/${id}`;
    return this.baseCrudService.updateRecord<Tag, UpdateTagBody>(url, tag);
  }

  deleteRecord(id: number) {
    const url = `/api/cmdb/server_tag/${id}`;
    return this.baseCrudService.deleteRecord<Tag>(url);
  }

  batchDeleteRecord(ids: number[]) {
    const url = '/api/cmdb/server_tag';
    return this.baseCrudService.batchDeleteRecord<Tag>(url, ids);
  }

  getRecordDetail(id: number) {
    const url = `/api/cmdb/server_tag/${id}`;
    return this.baseCrudService.getRecordDetail<Tag>(url);
  }
}
