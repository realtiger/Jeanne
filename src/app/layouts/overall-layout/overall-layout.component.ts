import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DrawerService } from 'ng-devui';
import { Subscription } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MenuData } from '../../../types/global';
import { MenuService } from '../../core/services/menu.service';
import { SIDEBAR_FOLD_WIDTH, SIDEBAR_OPEN_WIDTH } from '../layouts.config';
import { LayoutsService } from '../layouts.service';
import { SideMenuComponent } from '../side-menu/side-menu.component';

@Component({
  selector: 'app-overall-layout',
  templateUrl: './overall-layout.component.html',
  styleUrls: ['./overall-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverallLayoutComponent implements OnInit, OnDestroy {
  layoutConfig = this.layoutsService.getLayoutConfig();
  isSidebarShrink = false;
  isSidebarFold = false;

  menu: MenuData[] = this.menuService.menus;
  menuSubject$?: Subscription;
  layoutConfigSubject$?: Subscription;

  get siteInfo() {
    return environment.siteInfo;
  }

  // TODO: 浏览器窗口大小变化时，侧边栏收缩状态的变化
  constructor(private cdr: ChangeDetectorRef, private drawerService: DrawerService, private layoutsService: LayoutsService, private menuService: MenuService) {}

  ngOnInit() {
    this.menuSubject$ = this.menuService.change.subscribe(menu => {
      this.menu = menu;
      this.cdr.detectChanges();
    });
    this.layoutConfigSubject$ = this.layoutsService.layoutSubject$.subscribe(config => {
      this.layoutConfig = config;
      this.isSidebarShrink = config.sidebar.shrink;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.layoutConfigSubject$?.unsubscribe();
    this.menuSubject$?.unsubscribe();
  }

  // 监听浏览器窗口大小变化后，侧边栏收缩状态的变化
  sidebarFold(isFold: boolean) {
    this.isSidebarFold = isFold;
    this.layoutConfig.sidebar.firstSidebar.hidden = isFold;
    this.layoutsService.updateLayoutConfig(this.layoutConfig);
  }

  openSideMenuDrawer() {
    this.drawerService.open({
      drawerContentComponent: SideMenuComponent,
      width: `${SIDEBAR_OPEN_WIDTH}px`,
      position: 'left' /* TODO: if destroyOnHide is false, there has some problem, waiting ng-devui bug fix*/,
      // destroyOnHide: false,
      data: {
        data: this.menu
      }
    });
  }

  sidebarShrink(isShrink: boolean) {
    this.layoutConfig.sidebar.shrink = this.isSidebarShrink = isShrink;
    this.layoutConfig.sidebar.firstSidebar.width = this.isSidebarShrink ? SIDEBAR_FOLD_WIDTH : SIDEBAR_OPEN_WIDTH;
    this.layoutsService.updateLayoutConfig(this.layoutConfig);
  }
}
