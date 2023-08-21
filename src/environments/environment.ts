import { Environment } from '../types/global';

export const environment: Environment = {
  production: true,
  version: '0.0.1',
  useHash: true,
  api: {
    baseUrl: '/api',
    refreshTokenEnabled: true,
    refreshTokenType: 're-request'
  },
  siteInfo: {
    title: 'Jeanne',
    subTitle: '贞德 - 通用后台管理系统',
    company: 'Jeanne Company',
    linkUrl: 'https://example.com',
    presentation: 'Jeanne 是一个通用后台管理系统，它基于 Angular 11 和 DevUI 11.0.0-rc.0 开发。'
  },
  menu: [
    {
      title: '仪表盘',
      menuIcon: 'icon-dashboard',
      link: '/dashboard',
      children: [
        {
          title: '分析页',
          link: '/dashboard/analysis'
        },
        {
          title: '监控页',
          link: '/dashboard/monitor'
        },
        {
          title: '工作台',
          link: '/dashboard/workplace'
        }
      ]
    }
  ]
};
