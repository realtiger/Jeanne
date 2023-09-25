import { QueryAdditionalFields, UpdateAdditionalFields } from '../global';
import { DetailConfig, FormConfig, StatusShowTitleDict, TableColumns } from '../layout';

// ######## service data define ########
interface CreateKubeSettingsBody {
  name: string;
  conf: string;
  description: string;
}

interface KubeSettings extends QueryAdditionalFields, CreateKubeSettingsBody {
  current?: boolean;
}

interface UpdateKubeSettingsBody extends Partial<CreateKubeSettingsBody>, UpdateAdditionalFields {}

// ######## component data define ########
const ShowTitleDict = { ...StatusShowTitleDict };

const KubeSettingsColumns: TableColumns[] = [
  {
    field: 'name',
    header: '配置名称',
    fieldType: 'text'
  },
  {
    field: 'description',
    header: '描述',
    fieldType: 'text'
  },
  {
    field: 'status',
    header: '状态',
    fieldType: 'tag'
  },
  {
    field: 'current',
    header: '当前配置',
    fieldType: 'boolean'
  },
  {
    field: 'createTime',
    header: '创建时间',
    fieldType: 'date'
  }
];

const KubeSettingsCreateFormConfig: FormConfig = {
  items: [
    {
      label: '配置名称',
      prop: 'name',
      type: 'input',
      required: true,
      rule: {
        validators: [{ required: true, message: '配置名称不能为空' }]
      }
    },
    {
      label: '配置内容',
      prop: 'conf',
      type: 'textarea',
      required: true,
      rule: {
        validators: [{ required: true, message: '配置内容不能为空' }]
      }
    },
    {
      label: '描述',
      prop: 'description',
      type: 'textarea'
    }
  ]
};

const KubeSettingsCreateDefaultData = {
  name: '',
  conf: '',
  description: ''
};

const KubeSettingsUpdateFormConfig: FormConfig = {
  items: [
    ...KubeSettingsCreateFormConfig.items,
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

const KubeSettingsDetailConfig: DetailConfig[] = [
  ...KubeSettingsUpdateFormConfig.items,
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

export {
  KubeSettings,
  CreateKubeSettingsBody,
  UpdateKubeSettingsBody,
  KubeSettingsColumns,
  KubeSettingsCreateDefaultData,
  KubeSettingsCreateFormConfig,
  ShowTitleDict,
  KubeSettingsUpdateFormConfig,
  KubeSettingsDetailConfig
};
