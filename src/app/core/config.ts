import { DefaultAuthConfig } from '../../types/config/auth-config';
import { Config } from '../../types/config/config';

const CONFIG: Config = {
  dataUrl: '/api/load_data',
  auth: {
    ...DefaultAuthConfig,
    ...{
      loginRouter: '/passport/login',
      loginUrl: '/api/login',
      refreshUrl: '/api/refresh',
      logoutUrl: '/api/logout',
      tokenSendTemplate: 'Bearer ${token}',
      tokenSendKey: 'Authorization'
    }
  }
};

export { CONFIG };
