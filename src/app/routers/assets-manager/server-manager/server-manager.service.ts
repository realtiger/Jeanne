import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { CreateServerBody, Server, UpdateServerBody } from '../../../../types/assets-manager/server-manager';
import { ListParams, UniversalResponse } from '../../../../types/global';
import { ServiceWithBaseCrud } from '../../../../types/layout';
import { CommonToastService } from '../../../core/services/common-toast.service';
import { BaseCrudService } from '../../../shared/base-crud.service';

@Injectable()
export class ServerManagerService implements ServiceWithBaseCrud {
  prefixUrl = '/api/cmdb/server';

  constructor(private http: HttpClient, private baseCrudService: BaseCrudService, private commonToastService: CommonToastService) {}

  getRecordList(listParams: ListParams) {
    const url = this.prefixUrl;
    return this.baseCrudService.getRecordList<Server>(url, listParams);
  }

  createRecord(server: CreateServerBody) {
    const url = this.prefixUrl;
    return this.baseCrudService.createRecord<Server, CreateServerBody>(url, server);
  }

  updateRecord(id: number, server: UpdateServerBody) {
    const url = `${this.prefixUrl}/${id}`;
    return this.baseCrudService.updateRecord<Server, UpdateServerBody>(url, server);
  }

  deleteRecord(id: number) {
    const url = `${this.prefixUrl}/${id}`;
    return this.baseCrudService.deleteRecord<Server>(url);
  }

  getRecordDetail(id: number) {
    const url = `${this.prefixUrl}/${id}`;
    return this.baseCrudService.getRecordDetail<Server>(url);
  }

  updateServerToServerTag(serverId: number, tagIds: number[]) {
    const url = `${this.prefixUrl}/${serverId}/tags`;
    return this.http.put<UniversalResponse<Server>>(url, { tags: tagIds }).pipe(
      map(res => {
        if (res.success) {
          this.commonToastService.success('更新服务器标签成功', '更新服务器标签成功');
          res.data.serverTags = res.data.server_tags;
          return res.data;
        } else {
          this.commonToastService.error('更新服务器标签失败', `${res.code}: ${res.message}`);
          throw new Error(res.message);
        }
      })
    );
  }

  addServerAdmin(serverId: number, adminId: number) {
    const url = `${this.prefixUrl}/${serverId}/server-admin/${adminId}`;
    return this.http.put<UniversalResponse<Server>>(url, {}).pipe(
      map(res => {
        if (res.success) {
          this.commonToastService.success('添加服务器管理成功', '添加服务器管理成功');
          return res.data;
        } else {
          this.commonToastService.error('添加服务器管理失败', `${res.code}: ${res.message}`);
          throw new Error(res.message);
        }
      })
    );
  }
}
