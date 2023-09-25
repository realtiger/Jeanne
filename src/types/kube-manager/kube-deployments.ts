import { TableWidthConfig } from 'ng-devui';

import { DetailConfig, FormConfig, TableColumns } from '../layout';

// ######## service data define ########
interface KubeDeployments {
  id: string;
  name: string;
  status: {
    replicas: number;
    ready: number;
    available: number;
    unavailable: number;
    updated: number;
  };
  deploymentStatus?: {
    status: string;
    value: string;
  };
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

const KubeDeploymentTableWidthConfig: TableWidthConfig[] = [
  {
    field: 'checkbox',
    width: '50px'
  },
  {
    field: '#',
    width: '100px'
  },
  {
    field: 'name',
    width: '100%'
  },
  {
    field: 'status.ready',
    width: '100px'
  },
  {
    field: 'status.available',
    width: '100px'
  },
  {
    field: 'status.updated',
    width: '100px'
  },
  {
    field: 'status.replicas',
    width: '100px'
  },
  {
    field: 'deploymentStatus',
    width: '100px'
  }
];

const KubeDeploymentColumns: TableColumns[] = [
  {
    field: 'name',
    header: 'Deployment名称',
    fieldType: 'text'
  },
  {
    field: 'status.ready',
    header: '就绪数',
    fieldType: 'text'
  },
  {
    field: 'status.available',
    header: '可用数',
    fieldType: 'text'
  },
  {
    field: 'status.updated',
    header: '更新数',
    fieldType: 'text'
  },
  {
    field: 'status.replicas',
    header: '副本数',
    fieldType: 'text'
  },
  {
    field: 'deploymentStatus',
    header: '状态',
    fieldType: 'statusText'
  }
];

const KubeDeploymentCreateFormConfig: FormConfig = {
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

const KubeDeploymentCreateDefaultData = {
  name: '',
  detail: ''
};

const KubeDeploymentUpdateFormConfig: FormConfig = {
  items: [
    ...KubeDeploymentCreateFormConfig.items,
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

const KubeDeploymentDetailConfig: DetailConfig[] = [
  ...KubeDeploymentUpdateFormConfig.items,
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
  KubeDeployments,
  ShowTitleDict,
  KubeDeploymentColumns,
  KubeDeploymentCreateFormConfig,
  KubeDeploymentCreateDefaultData,
  KubeDeploymentUpdateFormConfig,
  KubeDeploymentDetailConfig,
  KubeDeploymentTableWidthConfig
};
