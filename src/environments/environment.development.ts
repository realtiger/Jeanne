import { Environment } from '../types/global';

export const environment: Environment = {
  production: true,
  version: '0.0.1',
  useHash: true,
  api: {
    // 总入口，需要固定，其他入口通过 load_data 接口获取
    baseUrl: 'http://10.209.0.23:5000',
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
  // 要想显示这些菜单必须在三个地方定义
  // 1. 这里定义
  // 2. routeing.module.ts 中定义路由
  // 3. 后端 permission 中定义权限
  menu: [
    {
      title: '仪表盘',
      menuIcon: 'icon-dashboard',
      link: '/dashboard',
      children: [
        { title: '分析页', link: '/dashboard/analysis' },
        { title: '监控页', link: '/dashboard/monitor' },
        { title: '工作台', link: '/dashboard/workplace' }
      ]
    },
    {
      title: '权限管理',
      menuIcon: 'icon-set-permission',
      children: [
        { title: '角色管理', link: '/system/role', needPermission: ['system:get-all-role'], menuIcon: 'icon-set-role' },
        { title: '用户管理', link: '/system/user', needPermission: ['system:get-all-user'], menuIcon: 'icon-op-member' },
        { title: '权限管理', link: '/system/permission', needPermission: ['system:get-all-permission'] }
      ]
    },
    {
      title: '系统管理',
      menuIcon: 'icon-setting',
      children: [{ title: '系统日志', link: '/system-manager/system-log', needPermission: ['system:get-one-operation_record'] }]
    }
  ]
};
