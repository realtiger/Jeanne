import { ChangeDetectionStrategy, ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { DialogService, DrawerService, IDrawerOpenResult, ModalComponent } from 'ng-devui';
import { ITabOperation } from 'ng-devui/tabs/tabs.component';

import { ServerManagerService } from './server-manager.service';
import {
  CreateServerBody,
  Server,
  ServerColumns,
  ServerCreateDefaultData,
  ServerCreateFormConfig,
  ServerDetailConfig,
  ServerUpdateFormConfig,
  ShowTitleDict,
  TerminalTabItem,
  UpdateServerBody
} from '../../../../types/assets-manager/server-manager';
import { Tag } from '../../../../types/assets-manager/tag-manager';
import { LoadDataParams } from '../../../../types/global';
import { CreateDataParams, DeleteDataParams, DetailDataParams, OperationsEnabled, UpdateDataParams } from '../../../../types/layout';
import { WebsocketHandler } from '../../../core/net/websocket-handler';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { BaseCrudComponentService } from '../../../shared/base-crud.service';
import { CommonToolsService } from '../../../shared/common-tools.service';
import { getUpdateParams } from '../../../shared/utils';
import { TagManagerService } from '../tag-manager/tag-manager.service';

interface Server2ServerTag extends Tag {
  $checked?: boolean;
}

@Component({
  selector: 'app-server-manager',
  templateUrl: './server-manager.component.html',
  styles: [
    `
      .terminal-header-operation {
        div {
          display: inline-block;
        }

        span {
          margin-left: 8px;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerManagerComponent {
  @ViewChild('terminalContentTemplate', { static: true }) terminalContentTemplate?: TemplateRef<any>;
  @ViewChild('setServerTagsTemplate', { static: true }) setServerTagsTemplate: TemplateRef<any> | undefined;

  transformDict: Array<string | { source: string; dest: string }> = [{ source: 'serverTags', dest: 'server_tags' }];
  showTitleDict = ShowTitleDict;
  columns = ServerColumns;
  createDefaultData = ServerCreateDefaultData;
  createFormConfig = ServerCreateFormConfig;
  updateFormConfig = ServerUpdateFormConfig;
  detailConfig = ServerDetailConfig;
  operationsEnabled: OperationsEnabled = {
    create: { enabled: this.authService.hasPermission('POST', 'cmdb:create-one-server') },
    update: { enabled: this.authService.hasPermission('PUT', 'cmdb:update-one-server') },
    delete: { enabled: this.authService.hasPermission('DELETE', 'cmdb:delete-one-server') },
    detail: { enabled: this.authService.hasPermission('GET', 'cmdb:get-one-server') }
  };

  server2ServerTags: Server2ServerTag[] = [];
  serverTagsLoading = false;
  serverTags: Server2ServerTag[] = [];
  serverTagsPage = {
    index: 1,
    limit: 10,
    total: 0
  };
  server2ServerTagsAllChecked = false;
  selectServer: Server | null = null;
  modelRef: { modalInstance: ModalComponent } | null = null;

  terminalTabs: TerminalTabItem[] = [];
  terminalTabActiveId: string | number = 0;
  terminalDrawer: IDrawerOpenResult | null = null;
  terminalInput = '';
  terminalFullScreen = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private drawerService: DrawerService,
    private commonToolsService: CommonToolsService,
    private authService: AuthService,
    private tokenService: TokenService,
    private serverManagerService: ServerManagerService,
    private tagManagerService: TagManagerService,
    private baseCrudComponentService: BaseCrudComponentService<Server, ServerManagerService>
  ) {
    // 将 updateFormConfig.items 和 createFormConfig.items 进行合并，以 prop 字段作为唯一标识
    const allFormConfig = [...this.updateFormConfig.items, ...this.createFormConfig.items];
    for (const i of allFormConfig) {
      switch (i.prop) {
        case 'serverType':
          this.transformDict.push({ source: 'serverType', dest: 'server_type' });
          break;
        case 'CreateBy':
          this.transformDict.push({ source: 'CreateBy', dest: 'create_by' });
          break;
        case 'managerIp':
          this.transformDict.push({ source: 'managerIp', dest: 'manager_ip' });
          break;
        case 'privateIp':
          this.transformDict.push({ source: 'privateIp', dest: 'private_ip' });
          break;
        case 'publicIp':
          this.transformDict.push({ source: 'publicIp', dest: 'public_ip' });
          break;
        case 'adminUser':
          this.transformDict.push({ source: 'adminUser', dest: 'admin_user' });
          break;
        default:
          this.transformDict.push(i.prop);
      }
    }
  }

  loadData = (params: LoadDataParams) => this.baseCrudComponentService.loadData(this.serverManagerService, params, this.transformDict);

  createServer(params: CreateDataParams) {
    const body: CreateServerBody = getUpdateParams(params.formData, this.transformDict);
    body.created_by = 'Manual';
    this.baseCrudComponentService.createRecord(this.serverManagerService, body, params.callback, this.transformDict);
  }

  updateServer(params: UpdateDataParams) {
    const body: UpdateServerBody = getUpdateParams(params.formData, this.transformDict);
    this.baseCrudComponentService.updateRecord(this.serverManagerService, params.id, body, params.callback, this.transformDict);
  }

  deleteServer(params: DeleteDataParams) {
    this.baseCrudComponentService.deleteRecord(this.serverManagerService, params.id, params.callback, this.transformDict);
  }

  getServerDetail(params: DetailDataParams) {
    this.baseCrudComponentService.getRecordDetail(this.serverManagerService, params.id, params.callback, this.transformDict);
  }

  openTerminal(item: Server) {
    if (!this.terminalTabs.find(server => server.id === item.id)) {
      const tabItem: TerminalTabItem = { id: item.id, title: item.name, content: `Welcome to use Galaxy Terminal --- ${item.name}` };
      const domain = this.commonToolsService.host;
      const port = this.commonToolsService.port;
      const terminalDomain = this.authService.appInfo.domain?.terminal || `${domain}:${port}`;
      const url = `ws://${terminalDomain}/api/cmdb/ws/${item.id}`;
      tabItem.ws = new WebsocketHandler(
        this.tokenService,
        `${domain}:${port}`,
        url,
        this.onOpen.bind(this),
        this.onClose.bind(this),
        this.onMessage.bind(this),
        this.onError.bind(this)
      );
      tabItem.ws.connect();

      this.terminalTabs.push(tabItem);
      this.terminalTabActiveId = item.id;
    }
    if (this.terminalDrawer) {
      this.terminalDrawer.drawerInstance.show();
    } else {
      this.terminalDrawer = this.drawerService.open({
        width: '50vh',
        destroyOnHide: false,
        isCover: false,
        fullScreen: true,
        escKeyCloseable: true,
        position: 'right',
        contentTemplate: this.terminalContentTemplate
      });
    }
  }

  hiddenTerminal() {
    if (this.terminalDrawer !== null) {
      this.terminalDrawer.drawerInstance.hide();
    }
  }

  fullScreenTerminal() {
    if (this.terminalDrawer !== null) {
      this.terminalFullScreen = !this.terminalFullScreen;
      this.terminalDrawer.drawerInstance.toggleFullScreen();
    }
  }

  sendTerminalInput() {
    const activeTab = this.terminalTabs.find(server => server.id === this.terminalTabActiveId);
    if (!activeTab) return;
    activeTab.content = `${activeTab.content}\n${this.terminalInput}`;
    if (activeTab.ws) {
      activeTab.ws.send(this.terminalInput);
    } else {
      activeTab.content = `${activeTab.content}\n########### WebSocket is not connected ###########`;
    }
  }

  onOpen() {
    if (this.terminalDrawer) {
      console.log('onOpen');
    }
  }

  onClose() {
    const activeTab = this.terminalTabs.find(server => server.id === this.terminalTabActiveId);
    if (!activeTab) return;
    activeTab.content = `${activeTab.content}\n########### WebSocket is closed ###########`;
  }

  onMessage(event: MessageEvent) {
    const activeTab = this.terminalTabs.find(server => server.id === this.terminalTabActiveId);
    if (!activeTab) return;
    activeTab.content = `${activeTab.content}\n${event.data}`;
  }

  onError(event: Event) {
    const activeTab = this.terminalTabs.find(server => server.id === this.terminalTabActiveId);
    if (!activeTab) return;
    activeTab.content = `${activeTab.content}\n${event}`;
  }

  closeTab(item: ITabOperation) {
    const activeTab = this.terminalTabs.find(server => server.id === item.id);
    if (!activeTab) return;

    if (activeTab.ws) {
      activeTab.ws.disconnect();
    }
    this.terminalTabs = this.terminalTabs.filter(server => server.id !== item.id);
    if (this.terminalTabActiveId === item.id) {
      this.terminalTabActiveId = this.terminalTabs.length > 0 ? this.terminalTabs[0].id : 0;
    }
  }

  // ###### begin 服务器标签管理 #######
  openSetServerTagsForm(row: Server) {
    // 初始化操作
    this.serverTagsPage = {
      index: 1,
      limit: 10,
      total: 0
    };
    this.server2ServerTags = [];
    this.serverTags = [];

    this.selectServer = row;
    console.log(row);
    this.serverTagsLoading = true;
    if (this.selectServer.serverTags.length > 0) {
      this.tagManagerService.getRecordList({ index: this.serverTagsPage.index, limit: this.serverTagsPage.limit, ids: this.selectServer.serverTags }).subscribe({
        next: value => {
          this.server2ServerTags = value.items;
          this.loadServerTags();
        }
      });
    } else {
      this.loadServerTags();
    }

    if (this.setServerTagsTemplate) {
      this.modelRef = this.dialogService.open({
        id: 'set-role-dialog',
        width: '600px',
        maxHeight: '600px',
        title: '设置服务器标签',
        contentTemplate: this.setServerTagsTemplate,
        backdropCloseable: true,
        onClose: () => {
          this.selectServer = null;
        },
        buttons: []
      });
    }
  }

  closeSetServerTagsForm() {
    this.modelRef?.modalInstance.hide();
  }

  loadServerTags(index = 1, limit = 10) {
    this.serverTagsLoading = true;
    this.tagManagerService.getRecordList({ index, limit }).subscribe({
      next: value => {
        this.serverTagsLoading = false;
        this.serverTags = [];
        for (const tag of value.items) {
          if (this.server2ServerTags.findIndex(item => item.id === tag.id) === -1) {
            this.serverTags.push({ ...tag, $checked: false });
          } else {
            this.serverTags.push({ ...tag, $checked: true });
          }
        }
        this.server2ServerTagsAllChecked = true;
        for (const serverTag of this.serverTags) {
          if (!serverTag.$checked) {
            this.server2ServerTagsAllChecked = false;
            break;
          }
        }
        this.serverTagsPage = value.pagination;
        this.cdr.detectChanges();
      }
    });
  }

  checkStatusChange(item: Server2ServerTag) {
    if (item.$checked) {
      this.server2ServerTags = [...this.server2ServerTags, item].sort((a, b) => a.id - b.id);
      this.server2ServerTagsAllChecked = true;
      for (const serverTag of this.serverTags) {
        if (!serverTag.$checked) {
          this.server2ServerTagsAllChecked = false;
          break;
        }
      }
    } else {
      this.server2ServerTagsAllChecked = false;
      const index = this.server2ServerTags.findIndex(serverTag => serverTag.id === item.id);
      if (index !== -1) {
        this.server2ServerTags.splice(index, 1);
      }
    }
  }

  checkAllServerTags() {
    for (const serverTag of this.serverTags) {
      serverTag.$checked = this.server2ServerTagsAllChecked;
    }

    if (this.server2ServerTagsAllChecked) {
      for (const serverTag of this.serverTags) {
        if (this.server2ServerTags.findIndex(item => item.id === serverTag.id) === -1) {
          this.server2ServerTags = [...this.server2ServerTags, serverTag];
        }
        this.server2ServerTags = this.server2ServerTags.sort((a, b) => a.id - b.id);
      }
    } else {
      for (const serverTag of this.serverTags) {
        const index = this.server2ServerTags.findIndex(item => item.id === serverTag.id);
        if (index !== -1) {
          this.server2ServerTags.splice(index, 1);
        }
      }
    }
  }

  server2ServerTagsPageSizeChange(pageSize: number) {
    this.loadServerTags(this.serverTagsPage.index, pageSize);
  }

  server2ServerTagsPageIndexChange(pageIndex: number) {
    this.loadServerTags(pageIndex, this.serverTagsPage.limit);
  }

  updateServer2ServerTags() {
    this.serverTagsLoading = true;
    const serverId = this.selectServer?.id || 0;
    const serverTagIds = this.server2ServerTags.map(item => item.id);

    if (serverId === 0) {
      this.serverTagsLoading = false;
      return;
    }
    if (this.selectServer?.serverTags.length === serverTagIds.length) {
      let isSame = true;
      for (const serverTagId of serverTagIds) {
        if (this.selectServer.serverTags.findIndex(item => item === serverTagId) === -1) {
          isSame = false;
          break;
        }
      }
      if (isSame) {
        this.serverTagsLoading = false;
        return;
      }
    }

    this.serverManagerService.updateServerToServerTag(serverId, serverTagIds).subscribe({
      next: value => {
        this.serverTagsLoading = false;
        if (this.selectServer) {
          this.selectServer.serverTags = value.serverTags;
        }
      },
      error: () => {
        this.serverTagsLoading = false;
      }
    });
  }

  // ###### end 服务器标签管理 #######
}
