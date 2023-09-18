import { QueryAdditionalFields, UpdateAdditionalFields } from '../global';
import { DetailConfig, FormConfig, StatusShowTitleDict, TableColumns } from '../layout';

// ######## service data define ########
interface CreateServerAdminInfoBody {
  name: string;
  detail: string;
}

interface ServerAdminInfo extends QueryAdditionalFields, CreateServerAdminInfoBody {}

interface UpdateServerAdminInfoBody extends Partial<CreateServerAdminInfoBody>, UpdateAdditionalFields {}

// ######## component data define ########
const ShowTitleDict = { ...StatusShowTitleDict };

const ServerAdminColumns: TableColumns[] = [
  {
    field: 'name',
    header: '名称',
    fieldType: 'text'
  },
  {
    field: 'ip',
    header: 'IP',
    fieldType: 'text'
  },
  {
    field: 'username',
    header: '用户名',
    fieldType: 'text'
  },
  {
    field: 'status',
    header: '状态',
    fieldType: 'tag'
  },
  {
    field: 'detail',
    header: '备注',
    fieldType: 'text'
  },
  {
    field: 'createTime',
    header: '创建时间',
    fieldType: 'date'
  }
];

const ServerAdminCreateFormConfig: FormConfig = {
  items: [
    {
      label: '名称',
      prop: 'name',
      type: 'input',
      required: true,
      rule: {
        validators: [{ required: true, message: '名称不能为空' }]
      }
    },
    {
      label: 'IP',
      prop: 'ip',
      type: 'input',
      required: true,
      rule: {
        validators: [{ required: true, message: 'IP不能为空' }]
      }
    },
    {
      label: '用户名',
      prop: 'username',
      type: 'input',
      required: true,
      rule: {
        validators: [{ required: true, message: '用户名不能为空' }]
      }
    },
    {
      label: '密码',
      prop: 'password',
      type: 'input',
      required: true,
      rule: {
        validators: [{ required: true, message: '密码不能为空' }]
      }
    },
    {
      label: '备注',
      prop: 'detail',
      type: 'textarea'
    }
  ]
};

const ServerAdminCreateDefaultData = {
  name: '',
  ip: '',
  username: '',
  password: '',
  detail: ''
};

const ServerAdminUpdateFormConfig: FormConfig = {
  items: [
    ...ServerAdminCreateFormConfig.items,
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

const ServerAdminDetailConfig: DetailConfig[] = [
  ...ServerAdminUpdateFormConfig.items,
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

interface ServerAdminOperation {
  operation: string;
  output: string;
  code: number;
}

export {
  ServerAdminColumns,
  ShowTitleDict,
  ServerAdminCreateDefaultData,
  ServerAdminCreateFormConfig,
  ServerAdminUpdateFormConfig,
  ServerAdminDetailConfig,
  CreateServerAdminInfoBody,
  ServerAdminInfo,
  UpdateServerAdminInfoBody,
  ServerAdminOperation
};
