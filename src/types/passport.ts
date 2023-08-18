enum LoginType {
  Account = 1,
  Email = 2,
  LDAP = 3
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  // 如果发生错误，会转化为通常的错误格式
  success?: boolean;
  message?: string;
  code?: number;
}

export { LoginType, LoginResponse };
