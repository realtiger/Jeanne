import { Environment } from '../types/global';

export const environment: Environment = {
  production: true,
  useHash: true,
  api: {
    baseUrl: '/api',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh'
  },
  siteInfo: {
    title: 'Jeanne',
    subTitle: '贞德 - 通用后台管理系统',
    company: 'Jeanne Company',
    linkUrl: 'https://example.com',
    presentation: 'Jeanne 是一个通用后台管理系统，它基于 Angular 11 和 DevUI 11.0.0-rc.0 开发。'
  }
};
