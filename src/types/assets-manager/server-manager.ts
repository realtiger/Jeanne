import { ServerAdminInfo } from './server-admin-manager';
import { WebsocketHandler } from '../../app/core/net/websocket-handler';
import { QueryAdditionalFields, UpdateAdditionalFields } from '../global';
import { DetailConfig, FormConfig, StatusShowTitleDict, TableColumns } from '../layout';

interface Server extends QueryAdditionalFields {
  name: string;
  serverType: number;
  createdBy: number;
  managerIp: string;
  privateIp: string;
  publicIp: string;
  port: number;
  idc: string;
  adminUser: string;
  region: string;
  detail: string;
  serverTags: number[];
  server_tags: number[];
  serverAdminInfo: ServerAdminInfo;
  server_admin_info: ServerAdminInfo;
}

interface CreateServerBody {
  name: string;
  server_type: string;
  created_by: string;
  manager_ip: string;
  private_ip: string;
  public_ip: string;
  port: number;
  idc: string;
  admin_user: string;
  region: string;
  detail: string;
}

interface UpdateServerBody extends Partial<CreateServerBody>, UpdateAdditionalFields {}

const ShowTitleDict = {
  ...StatusShowTitleDict,
  privateIp: { '': '--' },
  publicIp: { '': '--' },
  serverType: {
    Rack: '机架式',
    Blade: '刀片式',
    Tower: '塔式',
    PC: 'PC',
    Mini: '迷你'
  }
};

const ServerColumns: TableColumns[] = [
  {
    field: 'name',
    header: '名称',
    fieldType: 'text'
  },
  {
    field: 'hostname',
    header: '主机名称',
    fieldType: 'text'
  },
  {
    field: 'privateIp',
    header: '内网IP',
    fieldType: 'text'
  },
  {
    field: 'publicIp',
    header: '公网IP',
    fieldType: 'text'
  },
  {
    field: 'idc',
    header: 'IDC',
    fieldType: 'text'
  },
  {
    field: 'region',
    header: '区域',
    fieldType: 'text'
  },
  {
    field: 'serverAdminInfo.name',
    header: '管理bmc',
    fieldType: 'text'
  },
  {
    field: 'status',
    header: '状态',
    fieldType: 'tag'
  },
  {
    field: 'createTime',
    header: '创建时间',
    fieldType: 'date'
  }
];

const ServerCreateFormConfig: FormConfig = {
  items: [
    {
      label: '显示名称',
      prop: 'name',
      type: 'input',
      required: true,
      rule: {
        validators: [{ required: true, message: '主机显示名称不能为空' }]
      }
    },
    {
      label: '主机名称',
      prop: 'hostname',
      type: 'input',
      required: true,
      rule: {
        validators: [{ required: true, message: '主机名称不能为空' }]
      }
    },
    {
      label: '服务器类型',
      prop: 'serverType',
      type: 'select',
      required: true,
      options: [
        { label: '机架式', value: 'Rack' },
        { label: '刀片式', value: 'Blade' },
        { label: '塔式', value: 'Tower' },
        { label: 'PC', value: 'PC' },
        { label: '迷你', value: 'Mini' }
      ]
    },
    {
      label: '管理IP',
      prop: 'managerIp',
      type: 'input'
    },
    {
      label: '内网IP',
      prop: 'privateIp',
      type: 'input'
    },
    {
      label: '公网IP',
      prop: 'publicIp',
      type: 'input'
    },
    {
      label: '端口',
      prop: 'port',
      type: 'input'
    },
    {
      label: 'IDC',
      prop: 'idc',
      type: 'input'
    },
    {
      label: '区域',
      prop: 'region',
      type: 'input'
    },
    {
      label: '备注',
      prop: 'detail',
      type: 'textarea'
    }
  ]
};

const ServerCreateDefaultData = {
  name: '',
  hostname: '',
  serverType: 'Rack',
  managerIp: '',
  privateIp: '',
  publicIp: '',
  port: 22,
  idc: '',
  region: '',
  detail: ''
};

const ServerUpdateFormConfig: FormConfig = {
  items: [
    ...ServerCreateFormConfig.items,
    {
      label: '等级',
      prop: 'level',
      type: 'number',
      rule: {
        validators: [
          { required: true, message: '等级不能为空' },
          { min: 1, message: '等级不能小于1' }
        ]
      }
    },
    {
      label: '状态',
      prop: 'status',
      type: 'select',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    }
  ]
};

const ServerDetailConfig: DetailConfig[] = [
  ...ServerUpdateFormConfig.items,
  {
    label: '创建时间',
    prop: 'create_time',
    type: 'datePicker',
    dataFmt: 'yyyy-MM-dd HH:mm:ss'
  },
  {
    label: '更新时间',
    prop: 'update_time',
    type: 'datePicker',
    dataFmt: 'yyyy-MM-dd HH:mm:ss'
  }
];

interface TerminalTabItem {
  id: number;
  title: string;
  content: string;
  ws?: WebsocketHandler;
}

export {
  Server,
  CreateServerBody,
  UpdateServerBody,
  ServerColumns,
  ServerCreateDefaultData,
  ServerCreateFormConfig,
  ShowTitleDict,
  ServerUpdateFormConfig,
  ServerDetailConfig,
  TerminalTabItem
};
