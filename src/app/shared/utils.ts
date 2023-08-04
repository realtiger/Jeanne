import { HttpParams } from '@angular/common/http';

import { ListParams } from '../../types/global';

function genHttpParams(listParams: ListParams) {
  let params = new HttpParams().set('index', listParams.index).set('limit', listParams.limit);
  if (listParams.filters) {
    for (const filter of listParams.filters) {
      params = params.append('filters', filter);
    }
  }
  if (listParams.orders) {
    for (const order of listParams.orders) {
      params = params.append('orders', order);
    }
  }

  return params;
}

export { genHttpParams };
