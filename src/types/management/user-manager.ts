import { QueryAdditionalFields, UpdateAdditionalFields } from '../global';

interface BaseUser {
  username: string;
  name: string;
  email: string;
  avatar: string;
  detail: string;
}

interface UserPassword {
  password: string;
  rePassword: string;
}

interface CreateUserData extends BaseUser, UserPassword {}

interface UpdateUserData extends Partial<BaseUser>, UpdateAdditionalFields {
  superuser?: boolean | string;
}

interface User extends BaseUser, QueryAdditionalFields {
  superuser: boolean | string;
  last_login_ip: string;
  last_login_time: string;
  roles: number[];
}

export { User, CreateUserData, UpdateUserData };
