import { HttpParams } from '@angular/common/http';

import { ListParams, ResponseStatus } from '../../types/global';
import { FormData } from '../../types/layout';

function genHttpParams(listParams: ListParams) {
  let params = new HttpParams().set('index', listParams.index).set('limit', listParams.limit);
  // 格式化过滤器
  if (listParams.filters) {
    for (const filter of listParams.filters) {
      params = params.append('filters', filter);
    }
  }
  // 格式化排序器
  if (listParams.orders) {
    for (const order of listParams.orders) {
      params = params.append('orders', order);
    }
  }
  // 格式化搜索器
  if (listParams.ids) {
    for (const id of listParams.ids) {
      params = params.append('ids', id);
    }
  }

  return params;
}

function getUpdateParams(formData: FormData, fields: string[]) {
  const body: any = {};
  for (const field of fields) {
    const value = formData[field];
    if (typeof value === 'undefined') continue;

    if (field === 'level') {
      if (typeof value === 'string') {
        body[field] = parseInt(value, 10);
      } else if (typeof value === 'number') {
        body[field] = value;
      }
    } else if (field === 'status') {
      switch (value) {
        case 'active':
          body.status = ResponseStatus.ACTIVE;
          break;
        case 'inactive':
          body.status = ResponseStatus.INACTIVE;
          break;
        case 'frozen':
          body.status = ResponseStatus.FROZEN;
          break;
        case 'obsolete':
          body.status = ResponseStatus.OBSOLETE;
          break;
        // default:
        //   body.status = ResponseStatus.ACTIVE;
      }
    } else {
      if (typeof value === 'string') {
        body[field] = value.trim();
      } else if (typeof value === 'number') {
        body[field] = value;
      } else if (typeof value === 'boolean') {
        body[field] = value;
      }
    }
  }
  return body;
}

export { genHttpParams, getUpdateParams };
