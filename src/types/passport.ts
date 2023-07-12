enum LoginType {
  Account = 1,
  Email = 2,
  LDAP = 3
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
}

export { LoginType, LoginResponse };
