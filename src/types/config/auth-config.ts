interface TokenModel {
  enable: boolean;
  token: string | null | undefined;
  refreshToken: string | null | undefined;
  // 过期时间，单位：ms
  expired?: number;
}

interface AuthConfig {
  // 存储KEY值，默认：`_token`
  storeKey: string;
  // 发送token参数名，默认：·
  tokenSendKey: string;
  // 发送token模板（默认为：`'${token}'`），使用 `${token}` 表示token点位符（**注意：**请务必使用 \`\` 包裹），例如：
  //
  // - `Bearer ${token}`
  tokenSendTemplate: string;
  // 发送token参数位置，默认：`header`
  tokenSendPlace: 'header' | 'body' | 'url';
  // 登录页路由地址，默认：`/login`
  loginRouter: string;
  // 登录页路由地址，默认：`/login`
  loginUrl: string;
  // token刷新地址，默认：`/refresh`
  refreshUrl: string;
  // 退出登录地址，默认：`/logout`
  logoutUrl: string;
  // 忽略TOKEN的URL地址列表，默认值为：`[/\/login/, /assets\//, /passport\//]`
  ignores?: RegExp[];
  // 允许匿名登录KEY，若请求参数中带有该KEY表示忽略TOKEN，默认：`_allow_anonymous`
  allowAnonymousKey: string;
  // 刷新间隔时长（单位：ms），默认：`3000`
  refreshTime?: number;
  // 过期计算偏移值（单位：ms），默认：`6000`
  // - **建议**根据 `refreshTime` 倍数来设置
  refreshOffset?: number;
}

const DefaultAuthConfig: Required<AuthConfig> = {
  storeKey: '_token',
  tokenSendKey: 'token',
  tokenSendTemplate: '${token}',
  tokenSendPlace: 'header',
  loginRouter: '/login',
  loginUrl: '/login',
  refreshUrl: '/refresh',
  logoutUrl: '/logout',
  ignores: [/assets\//],
  allowAnonymousKey: '_allow_anonymous',
  refreshTime: 3000,
  refreshOffset: 6000
};

export { TokenModel, AuthConfig, DefaultAuthConfig };
