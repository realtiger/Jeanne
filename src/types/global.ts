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
  // 版本信息
  version: string;
  // API配置
  api: ApiConfig;
  //是否启用 URL 片段（#）代替 history API
  useHash: boolean;
  // 网站标题以及副标题
  siteInfo: SiteInfo;
  // 菜单数据
  menu: MenuData[];
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
  menuIcon?: string;
  // 是否隐藏菜单
  hidden?: boolean;
  needPermission?: string[];
}

interface UserPermission {
  GET?: string[];
  POST?: string[];
  PUT?: string[];
  DELETE?: string[];
  PATCH?: string[];

  [key: string]: string[] | undefined;
}

interface AppInfo {
  domain?: {
    terminal?: string;
  };
}

interface AppDate {
  app: AppInfo;
  permissions: UserPermission;
  // 是否已经登录
  auth: boolean;
}

interface User {
  username: string;
  gender: string;
  email: string;
  phoneNumber: string;
}

enum ResponseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  FROZEN = 'frozen',
  OBSOLETE = 'obsolete'
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

const EmptyListItems: ListItems<never> = {
  items: [],
  pagination: {
    index: 1,
    limit: 10,
    offset: 0,
    total: 0
  }
};

interface ListParams {
  index: number;
  limit: number;
  filters?: string[];
  orders?: string[];
  ids?: number[];
}

interface LoadDataParams {
  params: ListParams;
  callback: (success: boolean, data?: ListItems<any>) => void;
}

interface UpdateAdditionalFields {
  level?: number;
  status?: ResponseStatus | string;
}

interface QueryAdditionalFields extends Required<UpdateAdditionalFields> {
  id: number;
  create_time: string;
  update_time: string;
}

export {
  LayoutConfig,
  Environment,
  UniversalResponse,
  ListItems,
  EmptyListItems,
  MenuData,
  UserPermission,
  AppInfo,
  AppDate,
  User,
  ResponseStatus,
  ListParams,
  LoadDataParams,
  UpdateAdditionalFields,
  QueryAdditionalFields
};
