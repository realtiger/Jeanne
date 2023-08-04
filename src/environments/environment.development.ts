import { Environment } from '../types/global';

export const environment: Environment = {
  production: true,
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
    },
    {
      title: '系统管理',
      menuIcon: 'icon-setting',
      children: [
        {
          title: '用户管理',
          link: '/system/user',
          needPermission: ['system:get-all-user'],
          menuIcon: 'icon-op-member'
        },
        {
          title: '角色管理',
          link: '/system/role',
          needPermission: ['system:get-all-role'],
          menuIcon: 'icon-set-role'
        },
        {
          title: '权限管理',
          link: '/system/menu',
          needPermission: ['system:get-all-permission']
        }
      ]
    }
  ]
};