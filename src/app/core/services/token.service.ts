import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthConfig, TokenModel } from '../../../types/config/auth-config';
import { CONFIG } from '../config';

interface AuthReferrer {
  url?: string | null | undefined;
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  referrer: AuthReferrer = {};
  private _options: AuthConfig = CONFIG.auth;

  get options(): AuthConfig {
    return this._options;
  }

  constructor(private router: Router) {}

  get token(): Partial<TokenModel> {
    return this.getStore(this.options.storeKey);
  }

  getStore(key: string): Partial<TokenModel> {
    return JSON.parse(localStorage.getItem(key) || '{}') || {};
  }

  setStore(key: string, value: TokenModel | null): boolean {
    localStorage.setItem(key, JSON.stringify(value || {}));
    return true;
  }

  removeStore(key: string): void {
    localStorage.removeItem(key);
  }

  setToken(token: string, refreshToken: string, expired = 0): boolean {
    const tokenData: TokenModel = { token, refreshToken, expired, enable: true };
    return this.setStore(this.options.storeKey, tokenData);
  }

  disableToken() {
    const token = this.token;
    const tokenData: TokenModel = {
      token: token.token || '',
      refreshToken: token.refreshToken || '',
      expired: token.expired || 0,
      enable: false
    };
    this.setStore(this.options.storeKey, tokenData);
  }

  clear() {
    // this.removeStore(this.options.storeKey);
    this.disableToken();
  }

  gotoLogin() {
    this.clear();
    this.router.navigateByUrl(this.options.loginRouter).then();
  }
}
