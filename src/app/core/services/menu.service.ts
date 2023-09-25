import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, share } from 'rxjs';

import { BreadcrumbItem, MenuData } from '../../../types/global';

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

  buildBreadcrumb(menuList: BreadcrumbItem[], currentUrl: string, menus: MenuData[] | null = null): boolean {
    if (menus === null) {
      menus = [...this.menus];
    }

    // 如果没有菜单数据，直接返回
    if (menus.length === 0) {
      return false;
    }

    for (const menu of menus) {
      // 如果有子菜单，递归查找，否则直接比较
      if (menu.children) {
        // 如果找到了，直接返回
        if (this.buildBreadcrumb(menuList, currentUrl, menu.children)) {
          menuList.unshift({ title: menu.title, icon: menu.menuIcon });
          return true;
        }
      } else {
        // 如果找到了，直接返回
        if (menu.link === currentUrl) {
          menuList.unshift({ title: menu.title, icon: menu.menuIcon });
          return true;
        }
      }
    }

    // 如果全部都没有找到，返回false
    return false;
  }
}
