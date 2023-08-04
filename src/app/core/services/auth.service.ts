import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { TokenService } from './token.service';
import { UniversalResponse, User, UserPermission } from '../../../types/global';
import { LoginResponse, LoginType } from '../../../types/passport';
import { CONFIG } from '../config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user: User | null = null;
  private permissions: UserPermission = {};

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  get userInfo(): User | null {
    return this.user;
  }

  set userInfo(user: User | null) {
    this.user = user;
  }

  get userPermissions(): UserPermission {
    return this.permissions;
  }

  set userPermissions(permissions: UserPermission) {
    this.permissions = permissions;
  }

  get isUserLoggedIn() {
    return !!this.tokenService.token.token;
  }

  login(username: string, password: string, remember: boolean, loginType: string | number = LoginType.Account): Observable<LoginResponse> {
    const loginUrl = `${CONFIG.auth.loginUrl}?_allow_anonymous=true`;
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('remember', remember ? 'true' : 'false');
    formData.append('method', loginType.toString());

    return this.http.post<LoginResponse>(loginUrl, formData).pipe(
      map(res => {
        // 通常格式返回的数据是错误信息
        if (typeof res.success === 'boolean' && !res.success) {
          throw new Error(res.message);
        }
        return res;
      })
    );
  }

  logout() {
    return this.http.post<UniversalResponse<object>>(CONFIG.auth.logoutUrl, {}).pipe(
      map(res => {
        if (res.success) {
          this.cleanToken();
        } else {
          throw new Error(res.message);
        }
      })
    );
  }

  gotoLogin() {
    this.tokenService.gotoLogin();
  }

  cleanToken() {
    this.tokenService.clear();
  }
}
