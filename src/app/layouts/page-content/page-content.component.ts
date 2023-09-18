import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DialogService, ModalComponent, TableWidthConfig } from 'ng-devui';

import { ListItems, ListParams, LoadDataParams } from '../../../types/global';
import {
  BatchDeleteDataParams,
  CreateDataParams,
  DeleteDataParams,
  DetailConfig,
  DetailDataParams,
  FormConfig,
  FormData,
  OperationsEnabled,
  TableColumns,
  UpdateDataParams
} from '../../../types/layout';

const DEFAULT_OPERATIONS_ENABLED: Required<OperationsEnabled> = {
  create: {
    enabled: false,
    tileMode: true,
    dropdownMode: false
  },
  update: {
    enabled: false,
    tileMode: true,
    dropdownMode: false
  },
  delete: {
    enabled: false,
    tileMode: true,
    dropdownMode: false
  },
  batchDelete: {
    enabled: false,
    tileMode: true,
    dropdownMode: false
  },
  detail: {
    enabled: false,
    tileMode: true,
    dropdownMode: false
  }
};

@Component({
  selector: 'app-page-content',
  templateUrl: './page-content.component.html',
  styles: [
    `
      d-row {
        font-size: 16px;

        d-col {
          color: #00000080;

          &:first-child {
            div {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: right;

              &:after {
                content: ':';
                margin: 0 8px 0 2px;
              }
            }
          }
        }
      }

      .list-header-operation {
        display: flex;
        justify-content: space-between;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageContentComponent implements OnInit {
  @ViewChild('createTemplate', { static: true }) createTemplate: TemplateRef<any> | undefined;
  @ViewChild('editorTemplate', { static: true }) editorTemplate: TemplateRef<any> | undefined;
  @ViewChild('detailTemplate', { static: true }) detailTemplate: TemplateRef<any> | undefined;

  @Input() operationTpl: TemplateRef<{ $implicit: any }> | null = null;
  @Input() operationMoreTpl: TemplateRef<{ $implicit: any }> | null = null;
  @Input() operationHeaderLeftTpl: TemplateRef<any> | null = null;
  @Input() operationHeaderRightTpl: TemplateRef<any> | null = null;
  // table 样式配置
  @Input() name = '';
  @Input() tableWidthConfig: TableWidthConfig[] = [];
  @Input() tableColumns: TableColumns[] = [];
  @Input() records: any[] = [];
  @Input() showTitleDict: { [key: string]: { [key: string]: string } } = {};
  @Input() operationsEnabled: OperationsEnabled = {};
  @Input() createDefaultData: any = {};
  @Input() createFormConfig: FormConfig = { items: [] };
  @Input() updateFormConfig: FormConfig = { items: [] };
  @Input() detailConfig: DetailConfig[] = [];
  @Input() createType: 'inline' | 'modal' = 'inline';
  @Input() operationsMoreVisible = false;
  @Input() multiChecked = false;
  @Input() showOperationColumn = false;

  @Output() loadFunc = new EventEmitter<LoadDataParams>();
  @Output() createFunc = new EventEmitter<CreateDataParams>();
  @Output() updateFunc = new EventEmitter<UpdateDataParams>();
  @Output() deleteFunc = new EventEmitter<DeleteDataParams>();
  @Output() batchDeleteFunc = new EventEmitter<BatchDeleteDataParams>();
  @Output() detailFunc = new EventEmitter<DetailDataParams>();

  loading = false;
  formLoading = false;
  page = {
    index: 1,
    limit: 10,
    offset: 0,
    total: 0
  };
  recordAllChecked = false;
  recordHalfChecked = false;

  selectRecord: any;
  modelRef: { modalInstance: ModalComponent } | null = null;
  showCreateForm = false;
  createFormData: any = {};
  updateDefaultData: any = {};

  get showName() {
    return this.name.length > 0 ? this.name : '记录';
  }

  get checkedRecordList() {
    return this.records.filter(i => i.$checked);
  }

  constructor(private cdr: ChangeDetectorRef, private dialogService: DialogService) {}

  ngOnInit() {
    this.loadData(this.page.index, this.page.limit);
    this.mergeOperationsEnabled();
  }

  mergeOperationsEnabled() {
    const enabledConf = DEFAULT_OPERATIONS_ENABLED;
    // merge create
    if (this.operationsEnabled.create) {
      enabledConf.create.enabled = this.operationsEnabled.create.enabled || DEFAULT_OPERATIONS_ENABLED.create.enabled;
      enabledConf.create.tileMode = this.operationsEnabled.create.tileMode || DEFAULT_OPERATIONS_ENABLED.create.tileMode;
      enabledConf.create.dropdownMode = this.operationsEnabled.create.dropdownMode || DEFAULT_OPERATIONS_ENABLED.create.dropdownMode;
    }

    // merge update
    if (this.operationsEnabled.update) {
      enabledConf.update.enabled = this.operationsEnabled.update.enabled || DEFAULT_OPERATIONS_ENABLED.update.enabled;
      enabledConf.update.tileMode = this.operationsEnabled.update.tileMode || DEFAULT_OPERATIONS_ENABLED.update.tileMode;
      enabledConf.update.dropdownMode = this.operationsEnabled.update.dropdownMode || DEFAULT_OPERATIONS_ENABLED.update.dropdownMode;
    }

    // merge delete
    if (this.operationsEnabled.delete) {
      enabledConf.delete.enabled = this.operationsEnabled.delete.enabled || DEFAULT_OPERATIONS_ENABLED.delete.enabled;
      enabledConf.delete.tileMode = this.operationsEnabled.delete.tileMode || DEFAULT_OPERATIONS_ENABLED.delete.tileMode;
      enabledConf.delete.dropdownMode = this.operationsEnabled.delete.dropdownMode || DEFAULT_OPERATIONS_ENABLED.delete.dropdownMode;
    }

    // merge batchDelete
    if (this.operationsEnabled.batchDelete) {
      enabledConf.batchDelete.enabled = this.operationsEnabled.batchDelete.enabled || DEFAULT_OPERATIONS_ENABLED.batchDelete.enabled;
      enabledConf.batchDelete.tileMode = this.operationsEnabled.batchDelete.tileMode || DEFAULT_OPERATIONS_ENABLED.batchDelete.tileMode;
      enabledConf.batchDelete.dropdownMode = this.operationsEnabled.batchDelete.dropdownMode || DEFAULT_OPERATIONS_ENABLED.batchDelete.dropdownMode;
    }

    // merge detail
    if (this.operationsEnabled.detail) {
      enabledConf.detail.enabled = this.operationsEnabled.detail.enabled || DEFAULT_OPERATIONS_ENABLED.detail.enabled;
      enabledConf.detail.tileMode = this.operationsEnabled.detail.tileMode || DEFAULT_OPERATIONS_ENABLED.detail.tileMode;
      enabledConf.detail.dropdownMode = this.operationsEnabled.detail.dropdownMode || DEFAULT_OPERATIONS_ENABLED.detail.dropdownMode;
    }

    this.operationsEnabled = enabledConf;
  }

  objectHasKey(obj: Object) {
    return Object.keys(obj).length !== 0;
  }

  hasOperationsEnabled() {
    return (
      this.showOperationColumn ||
      (this.operationsEnabled.delete && this.deleteFunc.observed) ||
      (this.operationsEnabled.update && this.updateFunc.observed) ||
      (this.operationsEnabled.detail && this.detailFunc.observed)
    );
  }

  recordName(record?: any): string {
    let recordName;
    const selectRecord = record || this.selectRecord;
    if (selectRecord) {
      recordName = selectRecord.name || selectRecord.title || selectRecord.id;
    }

    // 保证 recordName 为 string 类型
    if (typeof recordName === 'number') {
      recordName = recordName.toString();
    } else if (typeof recordName !== 'string') {
      recordName = '';
    }

    return recordName;
  }

  showContentTranslate(field: string, sourceValue?: string) {
    let value;

    if (this.showTitleDict[field]) {
      value = this.showTitleDict[field][sourceValue || ''] || sourceValue;
    } else {
      value = sourceValue;
    }

    if (!value || value.length === 0) {
      value = '--';
    }
    return value;
  }

  loadDataCallback(success: boolean, res?: ListItems<any>) {
    if (success && res) {
      this.records = res.items;
      if (this.records.length === 0) {
        // 保证当 create 使用 inline 模式时，table 能显示一行，将创建按钮渲染出来
        this.records = [{ id: 0 }];
      }
      this.page = res.pagination;
      this.loading = false;
      this.recordAllChecked = false;
      this.recordHalfChecked = false;
      this.cdr.detectChanges();
    } else {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  loadData(index: number, limit: number, filters?: string[], orders?: string[]) {
    if (this.loadFunc.observed) {
      this.loading = true;
      const params: ListParams = { index, limit, filters, orders };
      this.loadFunc.emit({ params, callback: this.loadDataCallback.bind(this) });
    }
  }

  onPageChange(pageIndex: number) {
    this.page.index = pageIndex;
    this.loadData(pageIndex, this.page.limit);
  }

  onSizeChange(pageSize: number) {
    this.page.limit = pageSize;
    this.loadData(this.page.index, pageSize);
  }

  // ########### check handler begin ###########
  checkStatusChange() {
    const recordCheckedStatusCount = this.records.filter(i => i.$checked).length;
    if (recordCheckedStatusCount === 0) {
      this.recordAllChecked = false;
      this.recordHalfChecked = false;
    } else if (recordCheckedStatusCount === this.records.length) {
      this.recordAllChecked = true;
      this.recordHalfChecked = false;
    } else {
      this.recordAllChecked = false;
      this.recordHalfChecked = true;
    }
  }

  checkAllRecordsStatusChange() {
    this.recordHalfChecked = false;
    for (const record of this.records) {
      record.$checked = this.recordAllChecked;
    }
  }

  // ########### check handler end ###########

  // ########### create form begin ###########
  openCreateForm() {
    this.showCreateForm = true;
    this.createFormData = { ...this.createDefaultData };
  }

  closeCreateForm() {
    this.showCreateForm = false;
    if (this.modelRef) {
      this.modelRef.modalInstance.hide();
      this.modelRef = null;
    }
  }

  createRecordCallback(success: boolean) {
    if (success) {
      this.closeCreateForm();
      this.loadData(this.page.index, this.page.limit);
    }
    this.formLoading = false;
    this.cdr.detectChanges();
  }

  createRecord(formData: FormData) {
    this.formLoading = true;
    this.createFunc.emit({ formData, callback: this.createRecordCallback.bind(this) });
  }

  openCreateCard() {
    if (this.createTemplate) {
      this.modelRef = this.dialogService.open({
        id: 'create-dialog',
        width: '600px',
        maxHeight: '800px',
        title: `新建${this.showName}`,
        contentTemplate: this.createTemplate,
        backdropCloseable: true,
        buttons: []
      });
    }
  }

  // ########### create form end ###########

  // ########### update form begin ###########
  openUpdateForm(record: any) {
    this.selectRecord = record;

    for (const item of this.updateFormConfig.items) {
      this.updateDefaultData[item.prop] = record[item.prop];
    }

    if (this.editorTemplate) {
      this.modelRef = this.dialogService.open({
        id: 'edit-dialog',
        width: '600px',
        maxHeight: '600px',
        title: `编辑${this.showName} - ${this.recordName(record)}`,
        contentTemplate: this.editorTemplate,
        backdropCloseable: true,
        buttons: []
      });
    }
  }

  closeUpdateForm() {
    if (this.modelRef) {
      this.modelRef.modalInstance.hide();
      this.modelRef = null;
    }
  }

  editRecordCallback(success: boolean, data?: any) {
    if (success) {
      this.closeUpdateForm();
      for (const record of this.records) {
        if (record.id === this.selectRecord.id) {
          Object.assign(record, data);
          break;
        }
      }
      this.selectRecord = null;
    }
    this.formLoading = false;
    this.cdr.detectChanges();
  }

  diffEditorValueChange(value: FormData) {
    const data: FormData = {};
    for (const item of this.updateFormConfig.items) {
      if (this.selectRecord[item.prop] !== value[item.prop]) {
        data[item.prop] = value[item.prop];
      }
    }

    return data;
  }

  editRecord(formData: FormData) {
    if (!this.selectRecord) {
      return;
    }

    this.formLoading = true;
    formData = this.diffEditorValueChange(formData);
    if (!this.objectHasKey(formData)) {
      this.formLoading = false;
      this.editRecordCallback(true, this.selectRecord);
      return;
    }
    this.updateFunc.emit({ id: this.selectRecord.id, formData, callback: this.editRecordCallback.bind(this) });
  }

  // ########### update form end ###########

  // ########### delete form begin ###########
  openDeleteForm(record: any) {
    let title = `删除${this.showName}`;
    let content, deleteFunc;
    if (record === null) {
      title = `批量删除${this.showName}`;
      content = `确定要删除这 ${this.checkedRecordList.length} 条${this.showName} 吗？`;
      deleteFunc = () => this.batchDeleteRecord();
    } else {
      this.selectRecord = record;
      content = `确定要删除${this.showName} ${this.recordName(record)} 吗？`;
      deleteFunc = () => this.deleteRecord(record.id);
    }
    this.modelRef = this.dialogService.open({
      id: 'delete-dialog',
      width: '346px',
      maxHeight: '800px',
      title,
      showAnimate: false,
      content,
      buttons: [
        {
          cssClass: 'danger',
          text: '删除',
          handler: deleteFunc
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: '取消',
          handler: this.closeDeleteForm.bind(this)
        }
      ]
    });
  }

  closeDeleteForm() {
    if (this.modelRef) {
      this.modelRef.modalInstance.hide();
      this.modelRef = null;
    }
  }

  deleteRecordCallback(success: boolean, _?: any) {
    if (success) {
      this.selectRecord = null;
      this.loadData(this.page.index, this.page.limit);
    } else {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  deleteRecord(id: number) {
    this.closeDeleteForm();
    this.loading = true;
    this.cdr.detectChanges();
    this.deleteFunc.emit({ id, callback: this.deleteRecordCallback.bind(this) });
  }

  batchDeleteRecord() {
    this.closeDeleteForm();
    this.loading = true;
    this.cdr.detectChanges();
    const ids = this.checkedRecordList.map(i => i.id);
    this.batchDeleteFunc.emit({ ids: ids, callback: this.deleteRecordCallback.bind(this) });
  }

  // ########### delete form end ###########

  // ########### detail card begin ###########
  detailRecordCallback(success: boolean, data?: any) {
    if (success) {
      this.selectRecord = data;
    }
    this.formLoading = false;
    this.cdr.detectChanges();
  }

  openDetailCard(record: any) {
    this.formLoading = true;
    if (this.detailFunc.observed) {
      this.detailFunc.emit({ id: record.id, callback: this.detailRecordCallback.bind(this) });
    } else {
      this.selectRecord = record;
      this.formLoading = false;
    }
    this.modelRef = this.dialogService.open({
      id: 'detail-dialog',
      width: '600px',
      maxHeight: '800px',
      title: `查看${this.showName}(${this.recordName(record)})详情`,
      contentTemplate: this.detailTemplate,
      backdropCloseable: true,
      onClose: () => {
        this.selectRecord = null;
      },
      buttons: []
    });
  }

  // ########### detail card end ###########
}
