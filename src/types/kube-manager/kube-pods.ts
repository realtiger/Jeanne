import { TableWidthConfig } from 'ng-devui';

import { DetailConfig, FormConfig, TableColumns } from '../layout';

// ######## service data define ########
interface KubePods {
  id: string;
  name: string;
  status: string;
}

// ######## component data define ########
const ShowTitleDict = {
  status: {
    running: '运行中',
    pending: '等待中',
    failed: '失败',
    unknown: '未知'
  }
};

const KubePodsTableWidthConfig: TableWidthConfig[] = [
  {
    field: 'checkbox',
    width: '50px'
  },
  {
    field: '#',
    width: '100px'
  }
];

const KubePodsColumns: TableColumns[] = [
  {
    field: 'name',
    header: 'pod名称',
    fieldType: 'text'
  },
  {
    field: 'status',
    header: '状态',
    fieldType: 'tag'
  }
];

const KubePodsCreateFormConfig: FormConfig = {
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

const KubePodsCreateDefaultData = {
  name: '',
  detail: ''
};

const KubePodsUpdateFormConfig: FormConfig = {
  items: [
    ...KubePodsCreateFormConfig.items,
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

const KubePodsDetailConfig: DetailConfig[] = [
  ...KubePodsUpdateFormConfig.items,
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
export { KubePods, ShowTitleDict, KubePodsColumns, KubePodsCreateFormConfig, KubePodsCreateDefaultData, KubePodsUpdateFormConfig, KubePodsDetailConfig, KubePodsTableWidthConfig };
