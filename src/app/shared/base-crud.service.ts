import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { genHttpParams } from './utils';
import { EmptyListItems, ListItems, ListParams, LoadDataParams, UniversalResponse } from '../../types/global';
import { Callback, ServiceWithBaseCrud } from '../../types/layout';
import { CommonToastService } from '../core/services/common-toast.service';

type TransformDict = Array<string | { source: string; dest: string }>;

// ####### Service 方法 ########
@Injectable({ providedIn: 'root' })
export class BaseCrudService {
  constructor(private http: HttpClient, private commonToastService: CommonToastService) {}

  getRecordList<T>(url: string, listParams: ListParams) {
    const params = genHttpParams(listParams);

    return this.http.get<UniversalResponse<ListItems<T>>>(url, { params }).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          return EmptyListItems;
        }
      })
    );
  }

  createRecord<T, CREATE>(url: string, record: CREATE) {
    return this.http.post<UniversalResponse<T>>(url, record).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          this.commonToastService.error('创建资源失败', `${res.code}: ${res.message}`);
          throw new Error(res.message);
        }
      })
    );
  }

  updateRecord<T, UPDATE>(url: string, record: UPDATE) {
    return this.http.put<UniversalResponse<T>>(url, record).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          this.commonToastService.error('更新资源失败', `${res.code}: ${res.message}`);
          throw new Error(res.message);
        }
      })
    );
  }

  deleteRecord<T>(url: string) {
    return this.http.delete<UniversalResponse<T>>(url).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          throw new Error(res.message);
        }
      })
    );
  }

  batchDeleteRecord<T>(url: string, ids: number[]) {
    const body = ids;

    return this.http.delete<UniversalResponse<T>>(url, { body }).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          throw new Error(res.message);
        }
      })
    );
  }

  getRecordDetail<T>(url: string) {
    return this.http.get<UniversalResponse<T>>(url).pipe(
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

// ####### Component 方法 ########
@Injectable({ providedIn: 'root' })
export class BaseCrudComponentService<T, S extends ServiceWithBaseCrud> {
  transformResponseData<T>(item: T, transformDict: TransformDict) {
    for (const i of transformDict) {
      if (typeof i !== 'string') {
        item[i.source as keyof T] = item[i.dest as keyof T];
      }
    }

    // 自动将后端返回的 create_time 和 update_time 转换为 createTime 和 updateTime
    item['createTime' as keyof T] = item['create_time' as keyof T];
    item['updateTime' as keyof T] = item['update_time' as keyof T];
  }

  loadData(service: S, params: LoadDataParams, transformDict?: TransformDict) {
    if (service.getRecordList) {
      service.getRecordList(params.params).subscribe({
        next: (res: ListItems<T>) => {
          // 如果有转换字典则先转换为前端常用格式
          if (transformDict) {
            for (const item of res.items) {
              this.transformResponseData(item, transformDict);
            }
          }
          params.callback(true, res);
        },
        error: () => {
          params.callback(false);
        }
      });
    }
  }

  createRecord<T>(service: S, body: T, callback: Callback, transformDict?: TransformDict) {
    if (service.createRecord) {
      service.createRecord(body).subscribe({
        next: res => {
          if (transformDict) {
            this.transformResponseData(res, transformDict);
          }
          callback(true, res);
        },
        error: () => {
          callback(false);
        }
      });
    }
  }

  updateRecord<T>(service: S, id: number, body: T, callback: Callback, transformDict?: TransformDict) {
    if (service.updateRecord) {
      service.updateRecord(id, body).subscribe({
        next: res => {
          if (transformDict) {
            this.transformResponseData(res, transformDict);
          }
          callback(true, res);
        },
        error: () => {
          callback(false);
        }
      });
    }
  }

  deleteRecord(service: S, id: number, callback: Callback, transformDict?: TransformDict) {
    if (service.deleteRecord) {
      service.deleteRecord(id).subscribe({
        next: res => {
          if (transformDict) {
            this.transformResponseData(res, transformDict);
          }
          callback(true, res);
        },
        error: () => {
          callback(false);
        }
      });
    }
  }

  batchDeleteRecord(service: S, ids: number[], callback: Callback, transformDict?: TransformDict) {
    if (service.batchDeleteRecord) {
      service.batchDeleteRecord(ids).subscribe({
        next: res => {
          if (transformDict) {
            this.transformResponseData(res, transformDict);
          }
          callback(true, res);
        },
        error: () => {
          callback(false);
        }
      });
    }
  }

  getRecordDetail(service: S, id: number, callback: Callback, transformDict?: TransformDict) {
    if (service.getRecordDetail) {
      service.getRecordDetail(id).subscribe({
        next: res => {
          if (transformDict) {
            this.transformResponseData(res, transformDict);
          }
          callback(true, res);
        },
        error: () => {
          callback(false);
        }
      });
    }
  }
}
