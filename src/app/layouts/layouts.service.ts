import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { DEFAULT_LAYOUT_CONFIG } from './layouts.config';
import { LayoutConfig } from '../../types/global';

@Injectable()
export class LayoutsService {
  layoutConfigStoreKey = 'layout';
  layoutSubject$ = new ReplaySubject<LayoutConfig>(1);
  private readonly _config: LayoutConfig;

  constructor() {
    this._config = this.getLayoutConfig();
    this.layoutSubject$.next(this._config);
  }

  getLayoutConfig(): LayoutConfig {
    const config = JSON.parse(localStorage.getItem(this.layoutConfigStoreKey) || '{}');
    if (Object.keys(config).length > 0) {
      return config;
    } else {
      this.setLayoutConfig(DEFAULT_LAYOUT_CONFIG);
      return DEFAULT_LAYOUT_CONFIG;
    }
  }

  setLayoutConfig(config: LayoutConfig) {
    localStorage.setItem(this.layoutConfigStoreKey, JSON.stringify(config));
  }

  // 页面更新布局处理
  updateLayoutConfig(config: LayoutConfig) {
    this.setLayoutConfig(config);
    this.layoutSubject$.next(config);
  }
}
