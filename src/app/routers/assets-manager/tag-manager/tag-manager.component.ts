import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DrawerService } from 'ng-devui';

import { TagManagerService } from './tag-manager.service';
import {
  CreateTagBody,
  ShowTitleDict,
  Tag,
  TagColumns,
  TagCreateDefaultData,
  TagCreateFormConfig,
  TagDetailConfig,
  TagUpdateFormConfig,
  UpdateTagBody
} from '../../../../types/assets-manager/tag-manager';
import { LoadDataParams } from '../../../../types/global';
import { BatchDeleteDataParams, CreateDataParams, DeleteDataParams, DetailDataParams, OperationsEnabled, UpdateDataParams } from '../../../../types/layout';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { BaseCrudComponentService } from '../../../shared/base-crud.service';
import { CommonToolsService } from '../../../shared/common-tools.service';
import { getUpdateParams } from '../../../shared/utils';

@Component({
  selector: 'app-tag-manager',
  templateUrl: './tag-manager.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagManagerComponent {
  transformDict: Array<string | { source: string; dest: string }> = [];
  showTitleDict = ShowTitleDict;
  columns = TagColumns;
  createDefaultData = TagCreateDefaultData;
  createFormConfig = TagCreateFormConfig;
  updateFormConfig = TagUpdateFormConfig;
  detailConfig = TagDetailConfig;
  operationsEnabled: OperationsEnabled = {
    create: { enabled: this.authService.hasPermission('POST', 'cmdb:create-one-tag') },
    update: { enabled: this.authService.hasPermission('PUT', 'cmdb:update-one-tag') },
    delete: { enabled: this.authService.hasPermission('DELETE', 'cmdb:delete-one-tag') },
    batchDelete: { enabled: this.authService.hasPermission('DELETE', 'cmdb:delete-many-tag') },
    detail: { enabled: this.authService.hasPermission('GET', 'cmdb:get-one-tag') }
  };

  constructor(
    private drawerService: DrawerService,
    private commonToolsService: CommonToolsService,
    private authService: AuthService,
    private tokenService: TokenService,
    private tagManagerService: TagManagerService,
    private baseCrudComponentService: BaseCrudComponentService<Tag, TagManagerService>
  ) {}

  loadData = (params: LoadDataParams) => this.baseCrudComponentService.loadData(this.tagManagerService, params, this.transformDict);

  createTag(params: CreateDataParams) {
    const body: CreateTagBody = getUpdateParams(params.formData, this.transformDict);
    this.baseCrudComponentService.createRecord(this.tagManagerService, body, params.callback, this.transformDict);
  }

  updateTag(params: UpdateDataParams) {
    const body: UpdateTagBody = getUpdateParams(params.formData, this.transformDict);
    this.baseCrudComponentService.updateRecord(this.tagManagerService, params.id, body, params.callback, this.transformDict);
  }

  deleteTag(params: DeleteDataParams) {
    this.baseCrudComponentService.deleteRecord(this.tagManagerService, params.id, params.callback, this.transformDict);
  }

  batchDeleteTag(params: BatchDeleteDataParams) {
    this.baseCrudComponentService.batchDeleteRecord(this.tagManagerService, params.ids, params.callback, this.transformDict);
  }

  getTagDetail(params: DetailDataParams) {
    this.baseCrudComponentService.getRecordDetail(this.tagManagerService, params.id, params.callback, this.transformDict);
  }
}
