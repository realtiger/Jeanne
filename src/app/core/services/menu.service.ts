import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, share } from 'rxjs';

import { MenuData } from '../../../types/global';

@Injectable({ providedIn: 'root' })
export class MenuService implements OnDestroy {
  private _change$: BehaviorSubject<MenuData[]> = new BehaviorSubject<MenuData[]>([]);

  private menuData: MenuData[] = [];

  get menus(): MenuData[] {
    return this.menuData;
  }

  get change(): Observable<MenuData[]> {
    return this._change$.pipe(share());
  }

  buildMenu(items: MenuData[], permissions: string[], level = 0): MenuData[] {
    const menuData: MenuData[] = [];
    for (const item of items) {
      const needPermission = item.needPermission || [];
      // 如果没有权限，就不显示菜单
      if (needPermission.every(p => permissions.includes(p))) {
        if (item.children) {
          const childMenuData = this.buildMenu(item.children, permissions, level + 1);
          if (childMenuData.length > 0) {
            item.children = childMenuData;
          } else {
            continue;
          }
        }
        menuData.push(item);
      }
    }

    // 如果是顶层菜单，就更新菜单数据
    if (level === 0) {
      this.menuData = menuData;
      this._change$.next(this.menuData);
    }

    return menuData;
  }

  ngOnDestroy(): void {
    this._change$.unsubscribe();
  }
}
