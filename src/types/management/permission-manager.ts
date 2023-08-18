import { QueryAdditionalFields, UpdateAdditionalFields } from '../global';

interface CreatePermission {
  title: string;
  url: string;
  method: string;
  code: string;
  is_external: boolean;
}

interface Permission extends CreatePermission, QueryAdditionalFields {}

interface UpdatePermission extends Partial<CreatePermission>, UpdateAdditionalFields {}

export { Permission, CreatePermission, UpdatePermission };
