import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';
import { LoginResponse, LoginType } from '../../../types/passport';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  isUserLoggedIn() {
    return !!this.tokenService.token;
  }

  login(username: string, password: string, remember: boolean, loginType: string | number = LoginType.Account): Observable<LoginResponse> {
    const loginUrl = `${environment.api.baseUrl}/api/login?_allow_anonymous=true`;
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('remember', remember ? 'true' : 'false');
    formData.append('method', loginType.toString());

    return this.http.post<LoginResponse>(loginUrl, formData);
  }
}
