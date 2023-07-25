import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { DrawerService } from 'ng-devui';

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
export class OverallLayoutComponent implements OnDestroy {
  layoutConfig = this.layoutsService.getLayoutConfig();
  isSidebarShrink = false;
  isSidebarFold = false;

  menu: MenuData[] = this.menuService.menus;
  menuSubject$ = this.menuService.change.subscribe(menu => (this.menu = menu));
  layoutConfigSubject$ = this.layoutsService.layoutSubject$.subscribe(config => {
    this.layoutConfig = config;
    this.isSidebarShrink = config.sidebar.shrink;
  });

  get siteInfo() {
    return environment.siteInfo;
  }

  // TODO: 浏览器窗口大小变化时，侧边栏收缩状态的变化
  constructor(private drawerService: DrawerService, private layoutsService: LayoutsService, private menuService: MenuService) {}

  ngOnDestroy(): void {
    this.layoutConfigSubject$.unsubscribe();
    this.menuSubject$.unsubscribe();
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
