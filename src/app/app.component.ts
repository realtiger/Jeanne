import { Component } from '@angular/core';

import { AppService } from './app.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  constructor(private authService: AuthService, private appService: AppService) {
    this.appService.getUserInfo().subscribe({
      next: user => {
        this.authService.userInfo = user;
      },
      error: err => {
        console.error(`获取用户信息失败：${err}`);
      }
    });
  }
}
