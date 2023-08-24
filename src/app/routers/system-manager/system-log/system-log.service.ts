import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { EmptyListItems, ListItems, ListParams, UniversalResponse } from '../../../../types/global';
import { SystemLog } from '../../../../types/system-manager/system-log';
import { genHttpParams } from '../../../shared/utils';

@Injectable()
export class SystemLogService {
  constructor(private http: HttpClient) {}

  getSystemLogList(listParams: ListParams) {
    const url = '/api/admin/operation_record';
    const params = genHttpParams(listParams);

    return this.http.get<UniversalResponse<ListItems<SystemLog>>>(url, { params }).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          return EmptyListItems;
        }
      })
    );
  }
}
