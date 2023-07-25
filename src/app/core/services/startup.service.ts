import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { MenuService } from './menu.service';
import { AppDate, UniversalResponse } from '../../../types/global';
import { CONFIG } from '../config';

@Injectable()
export class StartupService {
  constructor(private http: HttpClient, private menuService: MenuService, private authService: AuthService) {}

  load(): Observable<void> {
    return this.http.get<UniversalResponse<AppDate>>(CONFIG.dataUrl, { params: { _allow_anonymous: true } }).pipe(
      map(appDate => {
        if (appDate.success) {
          this.menuService.buildMenu(appDate.data.menu);
        }
      })
    );
    // const getUserInfoUrl = '/api/user/info';
    // return zip(this.http.get<UniversalResponse<AppDate>>(CONFIG.dataUrl, { params: { _allow_anonymous: true } }), this.http.get<UniversalResponse<User>>(getUserInfoUrl)).pipe(
    //   map(([appDate, userInfo]) => {
    //     if (appDate.success) {
    //       this.menuService.buildMenu(appDate.data.menu);
    //     }
    //     if (userInfo.success) {
    //       this.authService.userInfo = userInfo.data;
    //     }
    //   })
    // );
  }
}
