import { HttpParams } from '@angular/common/http';

import { TransformDict } from './base-crud.service';
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

function getUpdateParams(formData: FormData, fields: string[], transformDict?: TransformDict) {
  const body: any = {};
  const allFields: TransformDict = [...fields];
  let source = '';
  let dest = '';

  transformDict?.forEach(value => {
    if (typeof value === 'object') {
      if (allFields.includes(value.source)) {
        const index = allFields.indexOf(value.source);
        allFields[index] = value;
      } else {
        allFields.push(value);
      }
    } else {
      if (!allFields.includes(value)) {
        allFields.push(value);
      }
    }
  });

  for (const field of allFields) {
    if (typeof field === 'object') {
      source = field.source;
      dest = field.dest;
    } else {
      source = field;
      dest = field;
    }
    const value = formData[source];
    if (typeof value === 'undefined') continue;

    if (source === 'level') {
      if (typeof value === 'string') {
        body[dest] = parseInt(value, 10);
      } else if (typeof value === 'number') {
        body[dest] = value;
      }
    } else if (source === 'status') {
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
        body[dest] = value.trim();
      } else if (typeof value === 'number') {
        body[dest] = value;
      } else if (typeof value === 'boolean') {
        body[dest] = value;
      }
    }
  }
  return body;
}

export { genHttpParams, getUpdateParams };
