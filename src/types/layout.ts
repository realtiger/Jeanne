import { DValidateRules, FormLayout } from 'ng-devui';

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
  options?: Array<{ label: string; value: string | boolean } | string>;
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

interface DetailConfig extends FormConfigItem {
  dataFmt?: string;
}

type DetailDataParams = DeleteDataParams;

export { TableColumns, FormConfigItem, FormConfig, FormData, CreateDataParams, UpdateDataParams, DeleteDataParams, DetailConfig, DetailDataParams };
