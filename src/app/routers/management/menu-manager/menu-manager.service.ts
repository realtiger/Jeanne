import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { EmptyListItems, ListItems, UniversalResponse } from '../../../../types/global';
import { CreateMenu, Menu, UpdateMenu } from '../../../../types/management/menu-manager';
import { CommonToastService } from '../../../core/services/common-toast.service';

@Injectable()
export class MenuManagerService {
  constructor(private http: HttpClient, private commonToastService: CommonToastService) {}

  getMenus() {
    const url = '/api/admin/menu';
    return this.http.get<UniversalResponse<ListItems<Menu>>>(url).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          return EmptyListItems;
        }
      })
    );
  }

  createMenu(menu: CreateMenu) {
    const url = '/api/admin/menu';
    return this.http.post<UniversalResponse<Menu>>(url, menu).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          this.commonToastService.error('创建菜单失败', res.message);
          throw new Error(res.message);
        }
      })
    );
  }

  updateMenu(menuId: number, menu: UpdateMenu) {
    const url = `/api/admin/menu/${menuId}`;
    return this.http.put<UniversalResponse<Menu>>(url, menu).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          this.commonToastService.error('编辑菜单失败', res.message);
          throw new Error(res.message);
        }
      })
    );
  }

  deleteMenu(menuId: number) {
    const url = `/api/admin/menu/${menuId}`;
    return this.http.delete<UniversalResponse<Menu>>(url).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          this.commonToastService.error('删除菜单失败', res.message);
          throw new Error(res.message);
        }
      })
    );
  }
}
