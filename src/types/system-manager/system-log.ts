import { QueryAdditionalFields } from '../global';

interface SystemLog extends QueryAdditionalFields {
  user_id: number;
  username: string;
  name: string;
  login_ip: string;
  method: string;
  uri: string;
  data: string;
}

export { SystemLog };
