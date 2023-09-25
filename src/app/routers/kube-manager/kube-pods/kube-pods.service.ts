import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';

import { EmptyListItems, ListItems, ListParams, UniversalResponse } from '../../../../types/global';
import { KubePods } from '../../../../types/kube-manager/kube-pods';
import { genHttpParams } from '../../../shared/utils';
import { KubeManagerService } from '../kube-manager.service';

@Injectable()
export class KubePodsService {
  private urlPrefix = '/api/kube/kube-operation';

  constructor(private http: HttpClient, private kubeManagerService: KubeManagerService) {}

  getAllPods(listParams: ListParams) {
    if (this.kubeManagerService.kubeSetting === null) {
      return of(EmptyListItems);
    }
    const url = `${this.urlPrefix}/pods`;
    let params = genHttpParams(listParams);
    params = params.append('conf', this.kubeManagerService.kubeSetting.id);
    return this.http.get<UniversalResponse<ListItems<KubePods>>>(url, { params }).pipe(
      map(res => {
        if (res.success) {
          for (const index in res.data.items) {
            res.data.items[index].id = index;
          }
          return res.data;
        } else {
          return EmptyListItems;
        }
      })
    );
  }

  getRecordList(listParams: ListParams) {
    return this.getAllPods(listParams);
  }

  //
  // createRecord(tag: CreateKubePodsBody) {
  //   const url = this.urlPrefix;
  //   return this.baseCrudService.createRecord<KubePods, CreateKubePodsBody>(url, tag);
  // }
  //
  // updateRecord(id: number, tag: UpdateKubePodsBody) {
  //   const url = `${this.urlPrefix}/${id}`;
  //   return this.baseCrudService.updateRecord<KubePods, UpdateKubePodsBody>(url, tag);
  // }
  //
  // deleteRecord(id: number) {
  //   const url = `${this.urlPrefix}/${id}`;
  //   return this.baseCrudService.deleteRecord<KubePods>(url);
  // }
  //
  // batchDeleteRecord(ids: number[]) {
  //   const url = this.urlPrefix;
  //   return this.baseCrudService.batchDeleteRecord<KubePods>(url, ids);
  // }
  //
  // getRecordDetail(id: number) {
  //   const url = `${this.urlPrefix}/${id}`;
  //   return this.baseCrudService.getRecordDetail<KubePods>(url);
  // }
}
