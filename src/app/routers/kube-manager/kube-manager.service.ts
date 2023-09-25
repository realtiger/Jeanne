import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

import { EmptyListItems, ListItems, UniversalResponse } from '../../../types/global';
import { Namespace } from '../../../types/kube-manager/kube-manager';
import { KubeSettings } from '../../../types/kube-manager/kube-settings-manager';
import { CommonToastService } from '../../core/services/common-toast.service';

@Injectable()
export class KubeManagerService implements OnDestroy {
  kubeSetting: KubeSettings | null = null;
  namespaces: Namespace[] = [];
  kubeSettingChange$ = new BehaviorSubject(this.kubeSetting);
  namespaceBehaviorSubject$ = new BehaviorSubject(this.namespaces);
  kubeSettingSubscription$;

  constructor(private http: HttpClient, private commonToastService: CommonToastService) {
    this.kubeSettingSubscription$ = this.kubeSettingChange$.subscribe(kubeSetting => {
      console.log('kubeSettingChange$', kubeSetting);
      this.kubeSetting = kubeSetting;

      this.namespaces = [];
      if (kubeSetting !== null) {
        this.getNamespaces()?.subscribe();
      }
    });
  }

  ngOnDestroy() {
    this.kubeSettingSubscription$.unsubscribe();
    this.kubeSettingChange$.unsubscribe();
    this.namespaceBehaviorSubject$.unsubscribe();
  }

  getNamespaces() {
    if (!this.kubeSetting) {
      this.commonToastService.warning('请先配置Kubernetes集群', '请先配置Kubernetes集群');
      return;
    }

    const url = `/api/kube/kube-operation/namespaces`;
    const params = { conf: this.kubeSetting.id };

    return this.http.get<UniversalResponse<ListItems<Namespace>>>(url, { params }).pipe(
      map(res => {
        if (res.success) {
          for (const ns of res.data.items) {
            this.namespaces.push({
              name: ns.name,
              current: false
            });
          }
          if (this.namespaces.length > 0) {
            this.namespaces[0].current = true;
            this.namespaceBehaviorSubject$.next(this.namespaces);
          }
          return res.data;
        } else {
          this.namespaces = [];
          return EmptyListItems;
        }
      })
    );
  }

  changeNamespace(namespace: string) {
    for (const ns of this.namespaces) {
      ns.current = ns.name === namespace;
    }
    this.namespaceBehaviorSubject$.next(this.namespaces);
  }
}
