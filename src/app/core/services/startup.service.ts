import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, zip } from 'rxjs';

import { AuthService } from './auth.service';
import { MenuService } from './menu.service';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';
import { AppDate, UniversalResponse, User } from '../../../types/global';
import { CONFIG } from '../config';

@Injectable()
export class StartupService {
  constructor(private http: HttpClient, private router: Router, private menuService: MenuService, private authService: AuthService, private tokenService: TokenService) {}

  load(): Observable<void> {
    const getUserInfoUrl = '/api/user/info';
    const refreshToken = this.tokenService.token.refreshToken || '';
    return zip(
      this.http.get<UniversalResponse<AppDate>>(CONFIG.dataUrl, { params: { _allow_anonymous: true }, headers: { 'Authorization-Refresh': refreshToken } }),
      this.http.get<UniversalResponse<User>>(getUserInfoUrl, { params: { _allow_anonymous: true } })
    ).pipe(
      catchError(res => {
        console.warn(`StartupService.load: Network request failed`, res);
        this.router.navigateByUrl('/abnormal/abnormal500').then();
        return [];
      }),
      map(([appDate, userInfo]) => {
        if (appDate.success && userInfo.success) {
          // 如果认证没有通过，清除token
          if (!appDate.data.auth) {
            this.authService.cleanToken();
          }

          // 平铺permissions
          let permissions: string[] = [];
          Object.keys(appDate.data.permissions).forEach(key => {
            const permission = appDate.data.permissions[key] || [];
            permissions = permissions.concat(permission);
          });

          this.menuService.buildMenu(environment.menu, permissions);
          this.authService.userInfo = userInfo.data;
          this.authService.userPermissions = appDate.data.permissions;
        } else {
          let errorMessage = '';
          if (!appDate.success) {
            errorMessage = `app data error: ${appDate.message}`;
          } else if (!userInfo.success) {
            errorMessage = `user info error: ${userInfo.message}`;
          }
          console.warn(`StartupService.load: ${errorMessage}`);
          this.router.navigateByUrl('/abnormal/abnormal500').then();
        }
      })
    );
  }
}
