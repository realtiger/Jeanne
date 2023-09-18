import { QueryAdditionalFields, UpdateAdditionalFields } from '../global';
import { DetailConfig, FormConfig, StatusShowTitleDict, TableColumns } from '../layout';

// ######## service data define ########
interface CreateTagBody {
  name: string;
  detail: string;
}

interface Tag extends QueryAdditionalFields, CreateTagBody {}

interface UpdateTagBody extends Partial<CreateTagBody>, UpdateAdditionalFields {}

// ######## component data define ########
const ShowTitleDict = { ...StatusShowTitleDict };

const TagColumns: TableColumns[] = [
  {
    field: 'name',
    header: '标签名称',
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

const TagCreateFormConfig: FormConfig = {
  items: [
    {
      label: '标签名称',
      prop: 'name',
      type: 'input',
      required: true,
      rule: {
        validators: [{ required: true, message: '标签名称不能为空' }]
      }
    },
    {
      label: '备注',
      prop: 'detail',
      type: 'textarea'
    }
  ]
};

const TagCreateDefaultData = {
  name: '',
  detail: ''
};

const TagUpdateFormConfig: FormConfig = {
  items: [
    ...TagCreateFormConfig.items,
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

const TagDetailConfig: DetailConfig[] = [
  ...TagUpdateFormConfig.items,
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

export { Tag, CreateTagBody, UpdateTagBody, TagColumns, TagCreateDefaultData, TagCreateFormConfig, ShowTitleDict, TagUpdateFormConfig, TagDetailConfig };
