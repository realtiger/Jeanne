import { ResponseStatus } from '../global';

interface Role {
  id: number;
  name: string;
  detail: string;
  status: string;
  create_time: string;
  update_time: string;
  level: number;
}

interface CreateRole {
  name: string;
  detail: string;
}

interface UpdateRole {
  name?: string;
  detail?: string;
  status?: ResponseStatus;
  level?: number;
}

export { Role, CreateRole, UpdateRole };
