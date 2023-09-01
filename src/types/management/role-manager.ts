import { QueryAdditionalFields, UpdateAdditionalFields } from '../global';
import { DetailConfig, FormConfig, StatusShowTitleDict, TableColumns } from '../layout';

interface Role extends QueryAdditionalFields {
  name: string;
  detail: string;
}

interface CreateRole {
  name: string;
  detail: string;
}

interface UpdateRole extends Partial<CreateRole>, UpdateAdditionalFields {}

const ShowTitleDict = StatusShowTitleDict;

const RoleColumns: TableColumns[] = [
  {
    field: 'name',
    header: '角色名称',
    fieldType: 'text'
  },
  {
    field: 'detail',
    header: '角色描述',
    fieldType: 'text'
  },
  {
    field: 'status',
    header: '状态',
    fieldType: 'tag'
  },
  {
    field: 'create_time',
    header: '创建时间',
    fieldType: 'date'
  }
];

const RoleCreateDefaultData = { name: '', detail: '' };

const RoleCreateFormConfig: FormConfig = {
  items: [
    {
      label: '角色名称',
      prop: 'name',
      type: 'input',
      required: true,
      rule: {
        validators: [{ required: true, message: '角色名称不能为空' }]
      }
    },
    {
      label: '角色介绍',
      prop: 'detail',
      type: 'textarea'
    }
  ]
};

const RoleUpdateFormConfig: FormConfig = {
  items: [
    ...RoleCreateFormConfig.items,
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
      ],
      helpTips: '超级管理员才可以进行修改'
    }
  ]
};

const RoleDetailConfig: DetailConfig[] = [
  ...RoleUpdateFormConfig.items,
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

export { Role, CreateRole, UpdateRole, RoleColumns, ShowTitleDict, RoleCreateDefaultData, RoleCreateFormConfig, RoleUpdateFormConfig, RoleDetailConfig };
