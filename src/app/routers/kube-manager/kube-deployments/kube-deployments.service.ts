import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';

import { EmptyListItems, ListItems, ListParams, UniversalResponse } from '../../../../types/global';
import { KubePods } from '../../../../types/kube-manager/kube-pods';
import { genHttpParams } from '../../../shared/utils';
import { KubeManagerService } from '../kube-manager.service';

@Injectable()
export class KubeDeploymentsService {
  private urlPrefix = '/api/kube/kube-operation';

  constructor(private http: HttpClient, private kubeManagerService: KubeManagerService) {}

  getAllNamespacedDeployments(listParams: ListParams) {
    if (!this.kubeManagerService.kubeSetting) {
      return of(EmptyListItems);
    }

    const kubeSettingId = this.kubeManagerService.kubeSetting.id;
    const namespace = this.kubeManagerService.namespaces.find(ns => ns.current)?.name;
    const url = `${this.urlPrefix}/namespaces/${namespace}/deployment`;
    let params = genHttpParams(listParams);
    params = params.append('conf', kubeSettingId);
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
    return this.getAllNamespacedDeployments(listParams);
  }
}
