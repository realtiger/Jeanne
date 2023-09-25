import { ChangeDetectionStrategy, Component } from '@angular/core';

import { User } from '../../../../../types/global';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUserComponent {
  user: User = this.authService.userInfo ? this.authService.userInfo : ({} as User);

  get haveLoggedIn(): boolean {
    return this.authService.isUserLoggedIn;
  }

  constructor(private authService: AuthService) {}

  handleUserOperation(operation: 'logout' | 'other') {
    switch (operation) {
      case 'logout': {
        this.authService.logout().subscribe({
          next: () => {
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

  goToLogin(): void {
    this.authService.gotoLogin();
  }
}
