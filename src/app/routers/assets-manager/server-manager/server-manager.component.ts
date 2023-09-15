import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { DrawerService, IDrawerOpenResult } from 'ng-devui';
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
import { LoadDataParams } from '../../../../types/global';
import { CreateDataParams, DeleteDataParams, DetailDataParams, UpdateDataParams } from '../../../../types/layout';
import { WebsocketHandler } from '../../../core/net/websocket-handler';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { BaseCrudComponentService } from '../../../shared/base-crud.service';
import { CommonToolsService } from '../../../shared/common-tools.service';
import { getUpdateParams } from '../../../shared/utils';

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

  transformDict: Array<string | { source: string; dest: string }> = [];
  showTitleDict = ShowTitleDict;
  columns = ServerColumns;
  createDefaultData = ServerCreateDefaultData;
  createFormConfig = ServerCreateFormConfig;
  updateFormConfig = ServerUpdateFormConfig;
  detailConfig = ServerDetailConfig;
  optionsEnabled = {
    create: this.authService.hasPermission('POST', 'system:create-one-role'),
    update: this.authService.hasPermission('PUT', 'system:update-one-role'),
    delete: this.authService.hasPermission('DELETE', 'system:delete-one-role'),
    detail: this.authService.hasPermission('GET', 'system:get-one-role')
  };

  terminalTabs: TerminalTabItem[] = [];
  terminalTabActiveId: string | number = 0;
  terminalDrawer: IDrawerOpenResult | null = null;
  terminalInput = '';
  terminalFullScreen = false;

  constructor(
    private drawerService: DrawerService,
    private commonToolsService: CommonToolsService,
    private authService: AuthService,
    private tokenService: TokenService,
    private serverManagerService: ServerManagerService,
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
}
