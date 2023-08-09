import { HttpParams } from '@angular/common/http';

import { ListParams } from '../../types/global';

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

export { genHttpParams };
