import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

import { User } from '../../../../types/global';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header-operation',
  templateUrl: './header-operation.component.html',
  styleUrls: ['./header-operation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderOperationComponent {
  noticeCount = 0;
  user: User = this.authService.userInfo ? this.authService.userInfo : ({} as User);

  get haveLoggedIn(): boolean {
    return this.authService.isUserLoggedIn;
  }

  constructor(private cdr: ChangeDetectorRef, private authService: AuthService) {}

  // TODO 补齐search能力
  onSearch(event: string) {
    console.log(event);
  }

  handleUserOperation(operation: 'logout' | 'other') {
    switch (operation) {
      case 'logout': {
        this.authService.logout().subscribe({
          next: () => {
            console.log('退出登录成功');
            this.goToLogin();
          },
          error: err => {
            console.error(`退出登录失败：${err}`);
          }
        });
        break;
      }
      default:
        break;
    }
  }

  handleNoticeCount(event: number) {
    this.noticeCount = event;
    this.cdr.markForCheck();
  }

  goToLogin(): void {
    this.authService.gotoLogin();
  }
}
