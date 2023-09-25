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
      linkType: 'routerLink'
    },
    {
      title: '资产管理',
      menuIcon: 'icon-build-with-tool',
      children: [
        { title: '标签管理', link: '/assets-manager/tag-manager', linkType: 'routerLink', needPermission: ['cmdb:get-all-server-tag'] },
        { title: '带外信息管理', link: '/assets-manager/server-admin-manager', linkType: 'routerLink', needPermission: ['cmdb:get-all-server-admin-info'] },
        { title: '主机管理', link: '/assets-manager/server-manager', linkType: 'routerLink', needPermission: ['cmdb:get-all-server'] }
      ]
    },
    {
      title: '权限管理',
      menuIcon: 'icon-set-permission',
      children: [
        { title: '角色管理', link: '/system/role', linkType: 'routerLink', needPermission: ['system:get-all-role'] },
        { title: '用户管理', link: '/system/user', linkType: 'routerLink', needPermission: ['system:get-all-user'] },
        { title: '权限管理', link: '/system/permission', linkType: 'routerLink', needPermission: ['system:get-all-permission'] }
      ]
    },
    {
      title: '系统管理',
      menuIcon: 'icon-setting',
      children: [{ title: '系统日志', link: '/system-manager/system-log', linkType: 'routerLink', needPermission: ['system:get-one-operation-record'] }]
    }
  ],
  kubeMenu: [
    {
      title: 'k8s集群仪表盘',
      menuIcon: 'icon-dashboard',
      link: '/kube/dashboard',
      linkType: 'routerLink'
    },
    {
      title: '集群负载',
      menuIcon: 'icon-build-with-tool',
      children: [
        { title: 'Deployment', link: '/kube/deployments', linkType: 'routerLink', needPermission: ['kube:get-all-namespaced-deployment'] },
        { title: 'StatefulSet', link: '/kube/stateful-sets', linkType: 'routerLink', needPermission: ['kube:get-all-namespaced-stateful-set'] },
        { title: 'DaemonSet', link: '/kube/daemon-sets', linkType: 'routerLink', needPermission: ['kube:get-all-namespaced-daemon-set'] },
        { title: 'Job', link: '/kube/jobs', linkType: 'routerLink', needPermission: ['kube:get-all-namespaced-job'] },
        { title: 'CronJob', link: '/kube/cron-jobs', linkType: 'routerLink', needPermission: ['kube:get-all-namespaced-cron-job'] },
        { title: 'Pod', link: '/kube/pods', linkType: 'routerLink', needPermission: ['kube:get-all-namespaced-pod'] }
      ]
    },
    {
      title: '全局管理',
      menuIcon: 'icon-setting',
      children: [{ title: 'k8s配置', link: '/kube/kube-settings', linkType: 'routerLink', needPermission: ['kube:get-all-kube-settings'] }]
    }
  ]
};
