import { ResponseStatus } from '../global';

interface CreateUserData {
  username: string;
  password: string;
  rePassword: string;
  name: string;
  email: string;
  avatar: string;
  detail: string;
}

interface UpdateUserData {
  username: string;
  name: string;
  email: string;
  avatar: string;
  detail: string;
  status: ResponseStatus;
  level: number;
  superuser: boolean | string;
}

interface User {
  username: string;
  name: string;
  email: string;
  avatar: string;
  detail: string;
  id: number;
  level: number;
  status: ResponseStatus;
  superuser: boolean | string;
  create_time: string;
  update_time: string;
  last_login_ip: string;
  last_login_time: string;
  roles: number[];
}

export { User, CreateUserData, UpdateUserData };
