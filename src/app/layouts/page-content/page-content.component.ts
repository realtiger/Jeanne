import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DialogService, ModalComponent, TableWidthConfig } from 'ng-devui';

import { ListItems, ListParams, LoadDataParams } from '../../../types/global';
import { CreateDataParams, DeleteDataParams, DetailConfig, FormConfig, FormData, TableColumns, UpdateDataParams } from '../../../types/layout';

@Component({
  selector: 'app-page-content',
  templateUrl: './page-content.component.html',
  styles: [
    `
      d-row {
        font-size: 16px;

        d-col:first-child {
          color: #00000080;

          span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            position: absolute;
            width: 100%;
            text-align: right;

            &:after {
              content: ':';
              margin: 0 8px 0 2px;
            }
          }
        }
      }

      d-col:last-child {
        color: #000000d9;

        span {
          width: 100%;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageContentComponent implements OnInit {
  @ViewChild('editorTemplate', { static: true }) editorTemplate: TemplateRef<any> | undefined;
  @ViewChild('detailTemplate', { static: true }) detailTemplate: TemplateRef<any> | undefined;
  // table 样式配置
  @Input() name = '';
  @Input() tableWidthConfig: TableWidthConfig[] = [];
  @Input() tableColumns: TableColumns[] = [];
  @Input() records: any[] = [];
  @Input() showTitleDict: { [key: string]: { [key: string]: string } } = {};
  @Input() createDefaultData: any = {};
  @Input() createFormConfig: FormConfig = { items: [] };
  @Input() updateFormConfig: FormConfig = { items: [] };
  @Input() detailConfig: DetailConfig[] = [];

  @Output() loadFunc = new EventEmitter<LoadDataParams>();
  @Output() createFunc = new EventEmitter<CreateDataParams>();
  @Output() updateFunc = new EventEmitter<UpdateDataParams>();
  @Output() deleteFunc = new EventEmitter<DeleteDataParams>();

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

  get recordName(): string {
    let recordName;
    if (this.selectRecord) {
      recordName = this.selectRecord.name || this.selectRecord.title || this.selectRecord.id;
    }

    // 保证 recordName 为 string 类型
    if (typeof recordName !== 'string') {
      recordName = '';
    }

    return recordName;
  }

  constructor(private cdr: ChangeDetectorRef, private dialogService: DialogService) {}

  ngOnInit() {
    this.loadData(this.page.index, this.page.limit);
  }

  objectHasKey(obj: Object) {
    return Object.keys(obj).length !== 0;
  }

  showContentTranslate(field: string, key: string) {
    if (!this.showTitleDict[field]) {
      return key;
    }

    return this.showTitleDict[field][key] || key;
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
    if (this.loadFunc) {
      this.loading = true;
      const params: ListParams = { index, limit, filters, orders };
      this.loadFunc.emit({ params, callback: this.loadDataCallback.bind(this) });
    }
  }

  onPageChange(pageIndex: number) {
    this.loadData(pageIndex, this.page.limit);
  }

  onSizeChange(pageSize: number) {
    this.loadData(this.page.index, pageSize);
  }

  // ########### create form begin ###########
  openCreateForm() {
    this.showCreateForm = true;
    this.createFormData = { ...this.createDefaultData };
  }

  closeCreateForm() {
    this.showCreateForm = false;
  }

  createRecordCallback(success: boolean) {
    if (success) {
      this.showCreateForm = false;
      this.formLoading = false;
      this.loadData(this.page.index, this.page.limit);
    } else {
      this.formLoading = false;
      this.cdr.detectChanges();
    }
  }

  createRecord(formData: FormData) {
    this.formLoading = true;
    this.createFunc.emit({ formData, callback: this.createRecordCallback.bind(this) });
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
        title: `编辑${this.showName} - ${this.recordName}`,
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
      this.formLoading = false;
      for (const record of this.records) {
        if (record.id === this.selectRecord.id) {
          Object.assign(record, data);
          break;
        }
      }
      this.selectRecord = null;
      this.cdr.detectChanges();
    } else {
      this.formLoading = false;
      this.cdr.detectChanges();
    }
  }

  editRecord(formData: FormData) {
    if (!this.selectRecord) {
      return;
    }

    this.formLoading = true;
    this.updateFunc.emit({ id: this.selectRecord.id, formData, callback: this.editRecordCallback.bind(this) });
  }

  // ########### update form end ###########

  // ########### delete form begin ###########
  openDeleteForm(record: any) {
    this.selectRecord = record;
    this.modelRef = this.dialogService.open({
      id: 'delete-dialog',
      width: '346px',
      maxHeight: '600px',
      title: `删除${this.showName}`,
      showAnimate: false,
      content: `确定要删除${this.showName} ${this.recordName} 吗？`,
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
  openDetailCard(record: any) {
    this.selectRecord = record;
    this.modelRef = this.dialogService.open({
      id: 'detail-dialog',
      width: '600px',
      maxHeight: '600px',
      title: `查看${this.showName}(${this.recordName})详情`,
      contentTemplate: this.detailTemplate,
      backdropCloseable: true,
      buttons: []
    });
  }

  // ########### detail card end ###########
}
