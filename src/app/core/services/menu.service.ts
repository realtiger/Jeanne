import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, share } from 'rxjs';

import { MenuData, MenuDataInResponse } from '../../../types/global';

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

  buildMenu(items: MenuDataInResponse[]): void {
    this.menuData = [];
    // const menuNodes: Map<number, MenuData> = new Map<number, MenuData>();
    // items.forEach(item => {
    //   menuNodes.set(item.id, this.fixMenu(item));
    // });
    // menuNodes.forEach((menuData, _) => {
    //   if (menuData.parentId) {
    //     const parent = menuNodes.get(menuData.parentId);
    //     if (parent) {
    //       if (parent.children) {
    //         parent.children.push(menuData);
    //       } else {
    //         parent.children = [menuData];
    //       }
    //     }
    //   } else {
    //     this.menuData.push(menuData);
    //   }
    // });
    items.forEach(item => {
      this.menuData.push(this.fixMenu(item));
    });

    console.log(this.menuData);
    this._change$.next(this.menuData);
  }

  fixMenu(item: MenuDataInResponse): MenuData {
    const menu: MenuData = {
      id: item.id,
      title: item.title,
      link: item.link,
      parentId: item.parent,
      menuIcon: item.icon,
      linkType: item.link.startsWith('http') ? 'hrefLink' : 'routerLink'
    };
    if (item.children) {
      const children: MenuData[] = [];
      item.children.forEach(child => {
        children.push(this.fixMenu(child));
      });
      menu['children'] = children;
    }

    return menu;
  }

  ngOnDestroy(): void {
    this._change$.unsubscribe();
  }
}
