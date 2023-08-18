import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { UniversalResponse, User } from '../types/global';

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(private http: HttpClient) {}

  getUserInfo() {
    const getUserInfoUrl = '/api/user/info';
    return this.http.get<UniversalResponse<User>>(getUserInfoUrl).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          throw new Error(res.message);
        }
      })
    );
  }
}
