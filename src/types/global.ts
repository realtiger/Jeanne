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

export { Environment, UniversalResponse, ListItems };
