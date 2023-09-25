import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    this.menuService.buildBreadcrumb(this.breadcrumbList, this.router.url);
    this.breadcrumbList.unshift({ title: '', link: '/', icon: 'icon-homepage' });
    if (this.titleIcon.length === 0) {
      this.titleIcon = this.breadcrumbList[this.breadcrumbList.length - 1].icon || '';
    }
    if (this.breadcrumbList.length > 1) {
      if (this.titleIcon.length === 0) {
        this.titleIcon = this.breadcrumbList[this.breadcrumbList.length - 1].icon || '';
      }
      if (this.title.length === 0) {
        this.title = this.breadcrumbList[this.breadcrumbList.length - 1].title || '';
      }
    }
  }
}
