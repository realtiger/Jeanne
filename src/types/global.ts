import { AccordionMenuItem } from 'ng-devui/accordion/accordion.type';

interface LayoutConfig {
  id: string;
  mode: 'sidebarTop' | 'headerTop';
  header: {
    // 是否固定头部
    fixed: boolean;
    // 头部是否隐藏
    hidden: boolean;
    zIndex: number | null;
    firstHeader: {
      height: number;
      hidden: boolean;
      zIndex: number | null;
    };
    secondHeader: {
      height: number;
      hidden: boolean;
      zIndex: number | null;
    };
  };
  sidebar: {
    // 是否固定侧边栏
    fixed: boolean;
    // 侧边栏是否隐藏
    hidden: boolean;
    // 侧边栏是否收缩
    shrink: boolean;
    zIndex: number | null;
    // 第一个侧边栏
    firstSidebar: {
      width: number;
      hidden: boolean;
      zIndex: number | null;
    };
    // 第二个侧边栏
    secondSidebar: {
      width: number;
      hidden: boolean;
      zIndex: number | null;
    };
  };
  footer: {
    height: number;
    // 底部是否隐藏
    hidden: boolean;
  };
  hideLogo: boolean;
}

interface ApiConfig {
  // 指定API前缀
  baseUrl: string;
  // 是否启用自动刷新Token
  refreshTokenEnabled: boolean;
  // 刷新Token方式，`re-request` 当检测过期时间到期时先发起刷新Token请求，再重新发起原请求
  refreshTokenType: 're-request' | 'auth-refresh';
}

interface SiteInfo {
  // 网站标题
  title: string;
  // 网站副标题
  subTitle: string;
  // 网站公司
  company: string;
  // 网站链接地址
  linkUrl: string;
  // 网站简单描述
  presentation: string;
}

interface Environment {
  // 是否生产环境
  production: boolean;
  // API配置
  api: ApiConfig;
  //是否启用 URL 片段（#）代替 history API
  useHash: boolean;
  // 网站标题以及副标题
  siteInfo: SiteInfo;
}

interface MenuData extends AccordionMenuItem {
  // title: string;
  // disabled?: boolean;
  // active?: boolean;
  // open?: boolean;
  // loading?: boolean;
  // children?: MenuData[];
  // link?: string;
  // target?: string;
  // linkType?: 'routerLink' | 'hrefLink' | string;
  children?: MenuData[];
  id: number;
  menuIcon: string;
  parentId?: number | null;
  level?: number;
}

interface MenuDataInResponse {
  id: number;
  title: string;
  link: string;
  icon: string;
  parent: number | null;
  level: number;
  children?: MenuDataInResponse[];
}

interface AppDate {
  app: string;
  menu: MenuDataInResponse[];
}

interface User {
  username: string;
  gender: string;
  email: string;
  phoneNumber: string;
}

interface UniversalResponse<T> {
  code: string;
  success: boolean;
  message: string;
  data: T;
}

interface Pagination {
  index: number;
  limit: number;
  offset: number;
  total: number;
}

interface ListItems<T> {
  items: T[];
  pagination: Pagination;
}

export { LayoutConfig, Environment, UniversalResponse, ListItems, MenuData, MenuDataInResponse, AppDate, User };
