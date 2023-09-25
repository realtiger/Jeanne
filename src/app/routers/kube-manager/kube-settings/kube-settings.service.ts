import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ListParams } from '../../../../types/global';
import { CreateKubeSettingsBody, KubeSettings, UpdateKubeSettingsBody } from '../../../../types/kube-manager/kube-settings-manager';
import { BaseCrudService } from '../../../shared/base-crud.service';

@Injectable()
export class KubeSettingsService {
  private urlPrefix = '/api/kube/kube-settings';

  constructor(private http: HttpClient, private baseCrudService: BaseCrudService) {}

  getRecordList(listParams: ListParams) {
    const url = this.urlPrefix;
    return this.baseCrudService.getRecordList<KubeSettings>(url, listParams);
  }

  createRecord(tag: CreateKubeSettingsBody) {
    const url = this.urlPrefix;
    return this.baseCrudService.createRecord<KubeSettings, CreateKubeSettingsBody>(url, tag);
  }

  updateRecord(id: number, tag: UpdateKubeSettingsBody) {
    const url = `${this.urlPrefix}/${id}`;
    return this.baseCrudService.updateRecord<KubeSettings, UpdateKubeSettingsBody>(url, tag);
  }

  deleteRecord(id: number) {
    const url = `${this.urlPrefix}/${id}`;
    return this.baseCrudService.deleteRecord<KubeSettings>(url);
  }

  batchDeleteRecord(ids: number[]) {
    const url = this.urlPrefix;
    return this.baseCrudService.batchDeleteRecord<KubeSettings>(url, ids);
  }

  getRecordDetail(id: number) {
    const url = `${this.urlPrefix}/${id}`;
    return this.baseCrudService.getRecordDetail<KubeSettings>(url);
  }
}
