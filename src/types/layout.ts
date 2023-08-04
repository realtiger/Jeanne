import { DValidateRules, FormLayout } from 'ng-devui';

interface TableColumns {
  field: string;
  header: string;
  fieldType: 'text' | 'tag' | 'date';
}

interface FormConfigItem {
  label: string;
  prop: string;
  type: 'input' | 'select' | 'datePicker' | 'textarea' | 'password' | 'number';
  showPassword?: boolean;
  required?: boolean;
  extraInfo?: string;
  options?: Array<{ label: string; value: string } | string>;
  rule?: DValidateRules;
}

interface FormConfig {
  layout?: FormLayout;
  labelSize?: 'sm' | '' | 'lg';
  items: FormConfigItem[];
  formRules?: DValidateRules;
}

interface FormData {
  [key: string]: string | Date;
}

interface CreateDataParams {
  formData: FormData;
  callback: (success: boolean, data?: any) => void;
}

interface UpdateDataParams {
  id: number;
  formData: FormData;
  callback: (success: boolean, data?: any) => void;
}

interface DeleteDataParams {
  id: number;
  callback: (success: boolean, data?: any) => void;
}

interface DetailConfig {
  label: string;
  prop: string;
  type: 'text' | 'date';
  dataFmt?: string;
}

export { TableColumns, FormConfigItem, FormConfig, FormData, CreateDataParams, UpdateDataParams, DeleteDataParams, DetailConfig };
