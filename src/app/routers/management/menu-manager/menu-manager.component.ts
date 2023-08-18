import { ChangeDetectionStrategy, ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { DataTableComponent, DialogService, FormLayout, ModalComponent, TableWidthConfig } from 'ng-devui';

import { MenuManagerService } from './menu-manager.service';
import { FormConfig, FormData } from '../../../../types/layout';
import { CreateMenu, Menu, treeMenuNode } from '../../../../types/management/menu-manager';
import { UpdateRole } from '../../../../types/management/role-manager';
import { getUpdateParams } from '../../../shared/utils';

@Component({
  selector: 'app-menu-manager',
  templateUrl: './menu-manager.component.html',
  styleUrls: ['./menu-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuManagerComponent {
  @ViewChild(DataTableComponent, { static: true }) datatable?: DataTableComponent;
  @ViewChild('createTemplate', { static: true }) createTemplate: TemplateRef<any> | undefined;
  @ViewChild('editTemplate', { static: true }) editTemplate: TemplateRef<any> | undefined;

  tableWidthConfig: TableWidthConfig[] = [
    {
      field: 'title',
      width: '300px'
    },
    {
      field: 'icon',
      width: '100px'
    },
    {
      field: 'level',
      width: '100px'
    },
    {
      field: 'status',
      width: '100px'
    },
    {
      field: 'hidden',
      width: '100px'
    },
    {
      field: 'create_time',
      width: '150px'
    },
    {
      field: 'update_time',
      width: '150px'
    },
    {
      field: 'operation',
      width: '200px'
    }
  ];
  menuNodeList: Menu[] = [
    {
      id: 0,
      title: 'root根节点',
      is_parent: true,
      parent: -1,
      hidden: false,
      icon: '',
      level: 0,
      status: '',
      create_time: '',
      update_time: ''
    }
  ];
  data: treeMenuNode[] = [];
  loading = false;

  selectedNode?: treeMenuNode;
  operationNode?: treeMenuNode;
  modelRef: { modalInstance: ModalComponent } | null = null;
  formLoading = false;
  // 新建form
  createFormConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: '菜单名称',
        prop: 'title',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true, message: '菜单名称不能为空' }]
        }
      },
      {
        label: '图标',
        prop: 'icon',
        type: 'input'
      },
      {
        label: '是否隐藏',
        prop: 'hidden',
        type: 'boolean'
      }
    ]
  };
  createDefaultRowData: FormData = { title: '', icon: '', hidden: false };

  updateFormConfig: FormConfig = {
    items: [
      ...this.createFormConfig.items,
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
        ],
        helpTips: '超级管理员才可以进行修改'
      }
    ]
  };
  updateDefaultRowData: FormData = { title: '', icon: '', hidden: false, level: 0, status: 'active' };

  constructor(private cdr: ChangeDetectorRef, private dialogService: DialogService, private menuManagerService: MenuManagerService) {
    this.loadData();
  }

  nodeCanDelete(node: treeMenuNode): boolean {
    return node.id > 0 && (!node.children || node.children.length === 0);
  }

  buildTree(menus: Menu[]): treeMenuNode[] {
    const menuMap = new Map<number, treeMenuNode>();
    for (const menu of menus) {
      const item: treeMenuNode = {
        id: menu.id,
        title: menu.title,
        isParent: menu.is_parent,
        open: true,
        hidden: menu.hidden,
        parent: menu.parent || 0,
        icon: menu.icon,
        level: menu.level,
        status: menu.status,
        create_time: menu.create_time,
        update_time: menu.update_time
      };
      if (menu.is_parent) {
        item.children = [];
        item.$isChildTableOpen = true;
      }
      menuMap.set(menu.id, item);
    }

    const menuTree: treeMenuNode[] = [];
    const rootNode = menuMap.get(0);
    if (rootNode) {
      menuTree.push(rootNode);
    }

    for (const menu of menuMap.values()) {
      const parent = menuMap.get(menu.parent);
      if (parent) {
        parent.children?.push(menu);
      }
    }

    return menuTree;
  }

  loadData() {
    this.loading = true;
    this.menuManagerService.getMenus().subscribe(res => {
      this.menuNodeList = [this.menuNodeList[0], ...res.items];
      this.data = this.buildTree(this.menuNodeList);
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  onChildTableToggle(status: boolean, rowItem: any) {
    this.datatable?.setRowChildToggleStatus(rowItem, status);
  }

  // ###### create menu begin ######
  openCreateModal(node: treeMenuNode) {
    this.operationNode = node;

    if (this.createTemplate) {
      this.modelRef = this.dialogService.open({
        id: 'edit-dialog',
        width: '600px',
        maxHeight: '600px',
        title: `创建菜单 ${node.title} 的子菜单`,
        contentTemplate: this.createTemplate,
        backdropCloseable: true,
        buttons: []
      });
    }
  }

  closeCreateModal() {
    this.modelRef?.modalInstance.hide();
    this.modelRef = null;
    this.operationNode = undefined;
  }

  createMenu(data: FormData) {
    const operationNode = this.operationNode;
    if (!operationNode) {
      return;
    }

    this.formLoading = true;
    const body: CreateMenu = {
      title: typeof data['title'] === 'string' ? data['title'] : '',
      parent: operationNode.id,
      icon: typeof data['icon'] === 'string' ? data['icon'] : '',
      hidden: data['hidden'] === true
    };
    this.menuManagerService.createMenu(body).subscribe(() => {
      this.loadData();
      this.formLoading = false;
      this.closeCreateModal();
      this.selectedNode = undefined;
    });
  }

  // ###### create menu end ######

  // ###### edit menu begin ######

  openEditModal(node: treeMenuNode) {
    this.operationNode = node;
    this.updateDefaultRowData = {
      title: node.title,
      icon: typeof node.icon === 'string' ? node.icon : '',
      hidden: node.hidden,
      level: typeof node.level === 'number' ? node.level : 0,
      status: typeof node.status === 'string' ? node.status : 'active'
    };

    if (this.editTemplate) {
      this.modelRef = this.dialogService.open({
        id: 'edit-dialog',
        width: '600px',
        maxHeight: '600px',
        title: `编辑菜单 ${node.title}`,
        contentTemplate: this.editTemplate,
        backdropCloseable: true,
        buttons: []
      });
    }
  }

  closeEditModal() {
    this.modelRef?.modalInstance.hide();
    this.modelRef = null;
    this.operationNode = undefined;
  }

  editMenu(data: FormData) {
    const operationNode = this.operationNode;
    if (!operationNode) {
      return;
    }

    const tempData: FormData = {};

    for (const key in data) {
      if (data[key] !== this.updateDefaultRowData[key]) {
        tempData[key] = data[key];
      }
    }

    const body: UpdateRole = getUpdateParams(tempData, ['title', 'icon', 'hidden', 'level', 'status']);

    if (Object.keys(body).length === 0) {
      return;
    }

    this.formLoading = true;
    this.menuManagerService.updateMenu(operationNode.id, body).subscribe({
      next: () => {
        this.loadData();
        this.formLoading = false;
        this.closeEditModal();
        this.selectedNode = undefined;
      },
      error: () => {
        this.formLoading = false;
      }
    });
  }

  // ###### edit menu end ######

  // ###### delete menu begin ######

  openDeleteModal(node: treeMenuNode) {
    this.operationNode = node;

    this.modelRef = this.dialogService.open({
      id: 'delete-dialog',
      width: '346px',
      maxHeight: '600px',
      title: `删除菜单 ${node.title}`,
      content: `确定要删除菜单 ${node.title} 吗？`,
      backdropCloseable: true,
      buttons: [
        {
          cssClass: 'danger',
          text: '删除',
          handler: () => {
            this.deleteMenu();
          }
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: '取消',
          handler: this.closeDeleteModal.bind(this)
        }
      ]
    });
  }

  closeDeleteModal() {
    this.modelRef?.modalInstance.hide();
    this.modelRef = null;
    this.operationNode = undefined;
  }

  deleteMenu() {
    const operationNode = this.operationNode;
    if (!operationNode) {
      return;
    }

    this.formLoading = true;
    this.menuManagerService.deleteMenu(operationNode.id).subscribe({
      next: () => {
        this.loadData();
        this.formLoading = false;
        this.closeDeleteModal();
        this.selectedNode = undefined;
      },
      error: () => {
        this.formLoading = false;
      }
    });
  }

  // ###### delete menu end ######
}
