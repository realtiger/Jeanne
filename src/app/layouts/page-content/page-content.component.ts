import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DialogService, ModalComponent, TableWidthConfig } from 'ng-devui';

import { ListItems, ListParams, LoadDataParams } from '../../../types/global';
import { CreateDataParams, DeleteDataParams, DetailConfig, DetailDataParams, FormConfig, FormData, TableColumns, UpdateDataParams } from '../../../types/layout';

interface OptionsEnabled {
  create?: boolean;
  update?: boolean;
  delete?: boolean;
  detail?: boolean;
}

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
  // table 样式配置
  @Input() name = '';
  @Input() tableWidthConfig: TableWidthConfig[] = [];
  @Input() tableColumns: TableColumns[] = [];
  @Input() records: any[] = [];
  @Input() showTitleDict: { [key: string]: { [key: string]: string } } = {};
  @Input() optionsEnabled: OptionsEnabled = {
    create: false,
    update: false,
    delete: false,
    detail: false
  };
  @Input() createDefaultData: any = {};
  @Input() createFormConfig: FormConfig = { items: [] };
  @Input() updateFormConfig: FormConfig = { items: [] };
  @Input() detailConfig: DetailConfig[] = [];
  @Input() createType: 'inline' | 'modal' = 'inline';

  @Output() loadFunc = new EventEmitter<LoadDataParams>();
  @Output() createFunc = new EventEmitter<CreateDataParams>();
  @Output() updateFunc = new EventEmitter<UpdateDataParams>();
  @Output() deleteFunc = new EventEmitter<DeleteDataParams>();
  @Output() detailFunc = new EventEmitter<DetailDataParams>();

  loading = false;
  formLoading = false;
  page = {
    index: 1,
    limit: 10,
    offset: 0,
    total: 0
  };

  selectRecord: any;
  modelRef: { modalInstance: ModalComponent } | null = null;
  showCreateForm = false;
  createFormData: any = {};
  updateDefaultData: any = {};

  get showName() {
    return this.name.length > 0 ? this.name : '记录';
  }

  constructor(private cdr: ChangeDetectorRef, private dialogService: DialogService) {}

  ngOnInit() {
    this.loadData(this.page.index, this.page.limit);
    this.optionsEnabled = {
      create: false,
      update: false,
      delete: false,
      detail: false,
      ...this.optionsEnabled
    };
  }

  objectHasKey(obj: Object) {
    return Object.keys(obj).length !== 0;
  }

  hasOptionsEnabled() {
    return (
      (this.optionsEnabled.delete && this.deleteFunc.observed) ||
      (this.optionsEnabled.update && this.updateFunc.observed) ||
      (this.optionsEnabled.detail && this.detailFunc.observed)
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
      this.page = res.pagination;
      this.loading = false;
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
    this.selectRecord = record;
    this.modelRef = this.dialogService.open({
      id: 'delete-dialog',
      width: '346px',
      maxHeight: '800px',
      title: `删除${this.showName}`,
      showAnimate: false,
      content: `确定要删除${this.showName} ${this.recordName(record)} 吗？`,
      buttons: [
        {
          cssClass: 'danger',
          text: '删除',
          handler: () => {
            this.deleteRecord(record.id);
          }
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
