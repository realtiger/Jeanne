import { DValidateRules, FormLayout } from 'ng-devui';
import { Observable } from 'rxjs';

import { ListItems, ListParams } from './global';

interface TableColumns {
  field: string;
  header: string;
  fieldType: 'text' | 'tag' | 'date';
}

interface FormConfigItem {
  label: string;
  prop: string;
  type: 'input' | 'select' | 'datePicker' | 'textarea' | 'password' | 'number' | 'boolean';
  showPassword?: boolean;
  required?: boolean;
  helpTips?: string;
  extraInfo?: string;
  options?: Array<{ label: string; value: string | boolean | number } | string>;
  formatter?: (value: { label: string; value: string | boolean }) => string;
  rule?: DValidateRules;
}

interface FormConfig {
  layout?: FormLayout;
  labelSize?: 'sm' | '' | 'lg';
  items: FormConfigItem[];
  formRules?: DValidateRules;
}

interface FormData {
  [key: string]: string | Date | boolean | number;
}

type Callback = (success: boolean, data?: any) => void;

interface CreateDataParams {
  formData: FormData;
  callback: Callback;
}

interface UpdateDataParams {
  id: number;
  formData: FormData;
  callback: Callback;
}

interface DeleteDataParams {
  id: number;
  callback: Callback;
}

interface DetailConfig extends FormConfigItem {
  dataFmt?: string;
}

type DetailDataParams = DeleteDataParams;

interface ServiceWithBaseCrud {
  getRecordList?: (listParams: ListParams) => Observable<ListItems<any>>;
  createRecord?: (record: any) => Observable<any>;
  updateRecord?: (id: number, record: any) => Observable<any>;
  deleteRecord?: (id: number) => Observable<any>;
  getRecordDetail?: (id: number) => Observable<any>;
}

const StatusShowTitleDict = {
  status: {
    active: '启用',
    inactive: '禁用'
  }
};

export {
  TableColumns,
  FormConfigItem,
  FormConfig,
  FormData,
  Callback,
  CreateDataParams,
  UpdateDataParams,
  DeleteDataParams,
  DetailConfig,
  DetailDataParams,
  ServiceWithBaseCrud,
  StatusShowTitleDict
};
