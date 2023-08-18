import { QueryAdditionalFields, UpdateAdditionalFields } from '../global';

interface Role extends QueryAdditionalFields {
  name: string;
  detail: string;
}

interface CreateRole {
  name: string;
  detail: string;
}

interface UpdateRole extends Partial<CreateRole>, UpdateAdditionalFields {}

export { Role, CreateRole, UpdateRole };
