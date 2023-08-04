import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MenuData } from '../../../../types/global';
import { MenuService } from '../../../core/services/menu.service';

interface BreadcrumbItem {
  title: string;
  link?: string;
  icon?: string;
}

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeaderComponent implements OnInit {
  @Input() title = '';
  @Input() titleIcon = '';
  @Input() description = '';
  breadcrumbList: BreadcrumbItem[] = [];

  constructor(private router: Router, private menuService: MenuService) {}

  ngOnInit(): void {
    this.buildBreadcrumb(this.menuService.menus, this.router.url);
    this.breadcrumbList.unshift({ title: '', link: '/', icon: 'icon-homepage' });
    if (this.titleIcon.length === 0) {
      this.titleIcon = this.breadcrumbList[this.breadcrumbList.length - 1].icon || '';
    }
  }

  buildBreadcrumb(menus: MenuData[], currentUrl: string): boolean {
    // 如果没有菜单数据，直接返回
    if (menus.length === 0) {
      return false;
    }

    for (const menu of menus) {
      // 如果有子菜单，递归查找，否则直接比较
      if (menu.children) {
        // 如果找到了，直接返回
        if (this.buildBreadcrumb(menu.children, currentUrl)) {
          this.breadcrumbList.unshift({ title: menu.title, icon: menu.menuIcon });
          return true;
        }
      } else {
        // 如果找到了，直接返回
        if (menu.link === currentUrl) {
          // 如果没有主动传入标题，使用菜单标题
          if (this.title.length === 0) {
            this.title = menu.title;
          }

          this.breadcrumbList.unshift({ title: menu.title, icon: menu.menuIcon });
          return true;
        }
      }
    }

    // 如果全部都没有找到，返回false
    return false;
  }
}
