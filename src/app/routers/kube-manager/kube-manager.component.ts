import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

import { KubeManagerService } from './kube-manager.service';
import { KubeSettingsService } from './kube-settings/kube-settings.service';
import { environment } from '../../../environments/environment';
import { MenuData } from '../../../types/global';
import { AuthService } from '../../core/services/auth.service';
import { CommonToastService } from '../../core/services/common-toast.service';
import { MenuService } from '../../core/services/menu.service';

@Component({
  selector: 'app-kube-manager',
  templateUrl: './kube-manager.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KubeManagerComponent implements OnDestroy {
  permissions = this.authService.userPermissions;
  permissionList: string[] = [];

  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private commonToastService: CommonToastService,
    private kubeManagerService: KubeManagerService,
    private kubeSettingsService: KubeSettingsService
  ) {
    Object.keys(this.permissions).forEach(key => {
      const permission = this.permissions[key] || [];
      this.permissionList = this.permissionList.concat(permission);
    });

    this.initNavbar();
  }

  initNavbar() {
    this.kubeSettingsService.getRecordList({ index: 1, limit: 1 }).subscribe(value => {
      let kubeMenu: MenuData[] = environment.kubeMenu || [];
      if (value.items.length === 0) {
        this.commonToastService.warning('请先配置Kubernetes集群', '请先配置Kubernetes集群');
        if (kubeMenu.length > 0) {
          // 没有配置Kubernetes集群，隐藏Kubernetes菜单，只保留菜单最后一项的全局配置菜单
          kubeMenu = [kubeMenu[-1]];
        }
      } else {
        this.kubeManagerService.kubeSettingChange$.next(value.items[0]);
        this.kubeManagerService.getNamespaces()?.subscribe();
      }

      this.menuService.buildMenu(kubeMenu, this.permissionList);
    });
  }

  ngOnDestroy(): void {
    const kubeMenu = environment.menu || [];
    this.menuService.buildMenu(kubeMenu, this.permissionList);
  }
}
