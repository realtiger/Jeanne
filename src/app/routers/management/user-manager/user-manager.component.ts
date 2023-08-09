import { ChangeDetectionStrategy, ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { DialogService, DValidateRules, FormLayout, ModalComponent, TableWidthConfig } from 'ng-devui';

import { UserManagerService } from './user-manager.service';
import { ListParams, ResponseStatus } from '../../../../types/global';
import { FormConfig, FormData, TableColumns } from '../../../../types/layout';
import { Role } from '../../../../types/management/role-manager';
import { CreateUserData, UpdateUserData, User } from '../../../../types/management/user-manager';
import { RoleManagerService } from '../role-manager/role-manager.service';

interface UserRole extends Role {
  $checked?: boolean;
}

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserManagerComponent {
  @ViewChild('editorTemplate', { static: true }) editorTemplate: TemplateRef<any> | undefined;
  @ViewChild('setRoleTemplate', { static: true }) setRoleTemplate: TemplateRef<any> | undefined;
  @ViewChild('resetPasswordTemplate', { static: true }) resetPasswordTemplate: TemplateRef<any> | undefined;
  loading = false;
  userList: User[] = [];
  pager = {
    index: 1,
    limit: 10,
    offset: 0,
    total: 0
  };
  tableColumns: TableColumns[] = [
    {
      field: 'username',
      header: '用户名',
      fieldType: 'text'
    },
    {
      field: 'name',
      header: '姓名',
      fieldType: 'text'
    },
    {
      field: 'email',
      header: '邮箱',
      fieldType: 'text'
    },
    {
      field: 'status',
      header: '状态',
      fieldType: 'tag'
    },
    {
      field: 'superuser',
      header: '超级用户',
      fieldType: 'tag'
    },
    {
      field: 'last_login_ip',
      header: '上次登录IP',
      fieldType: 'text'
    },
    {
      field: 'last_login_time',
      header: '上次登录时间',
      fieldType: 'date'
    },
    {
      field: 'create_time',
      header: '创建时间',
      fieldType: 'date'
    }
  ];
  tableWidthConfig: TableWidthConfig[] = [];

  selectUser: User | null = null;
  modelRef: { modalInstance: ModalComponent } | null = null;

  showCreateForm = false;
  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: '用户名',
        prop: 'username',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true, message: '用户名不能为空' }]
        }
      },
      {
        label: '密码',
        prop: 'password',
        type: 'password',
        required: true,
        rule: {
          validators: [
            { required: true, message: '密码不能为空' },
            { minlength: 8, message: '密码长度不能小于8位' }
          ]
        }
      },
      {
        label: '确认密码',
        prop: 'rePassword',
        type: 'password',
        required: true,
        rule: {
          validators: [
            { required: true, message: '确认密码不能为空' },
            { minlength: 8, message: '确认密码长度不能小于8位' },
            { sameToPassword: this.sameToPassword.bind(this), message: '两次输入密码不一致' }
          ]
        }
      },
      {
        label: '姓名',
        prop: 'name',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true, message: '姓名不能为空' }]
        }
      },
      {
        label: '邮箱',
        prop: 'email',
        type: 'input',
        required: true,
        rule: {
          validators: [
            { required: true, message: '邮箱不能为空' },
            { email: true, message: '邮箱格式不正确' }
          ]
        }
      },
      {
        label: '头像',
        prop: 'avatar',
        type: 'input'
      },
      {
        label: '个人简介',
        prop: 'detail',
        type: 'textarea'
      }
    ],
    labelSize: ''
  };
  defaultRowData: FormData = {
    username: '',
    password: '',
    rePassword: '',
    name: '',
    email: '',
    avatar: '/assets/images/avatar/default.jpg',
    detail: ''
  };
  formRowData: FormData = { ...this.defaultRowData };
  formLoading = false;

  editFormConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: '用户名',
        prop: 'username',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true, message: '用户名不能为空' }]
        }
      },
      {
        label: '姓名',
        prop: 'name',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true, message: '姓名不能为空' }]
        }
      },
      {
        label: '邮箱',
        prop: 'email',
        type: 'input',
        required: true,
        rule: {
          validators: [
            { required: true, message: '邮箱不能为空' },
            { email: true, message: '邮箱格式不正确' }
          ]
        }
      },
      {
        label: '头像',
        prop: 'avatar',
        type: 'input'
      },
      {
        label: '超级用户',
        prop: 'superuser',
        type: 'select',
        options: [
          { label: '是', value: 'true' },
          { label: '否', value: 'false' }
        ],
        helpTips: '超级管理员才可以进行修改'
      },
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
        helpTips: '超级管理员才可以进行修改',
        formatter: (item: { label: string; value: string | boolean }) => {
          return item.label;
        }
      },
      {
        label: '个人简介',
        prop: 'detail',
        type: 'textarea'
      }
    ],
    labelSize: ''
  };
  editDefaultRowData: FormData = {
    username: '',
    name: '',
    email: '',
    avatar: '/assets/images/avatar/default.jpg',
    detail: '',
    superuser: 'false',
    status: 'active',
    level: '1'
  };

  userRoles: UserRole[] = [];
  rolesLoading = false;
  roles: UserRole[] = [];
  rolesPage = {
    index: 1,
    limit: 10,
    total: 0
  };
  userRolesAllChecked = false;

  resetPasswordLoading = false;
  resetPasswordForm: {
    password: { value: string; showPassword: boolean; rule: DValidateRules };
    confirmPassword: { value: string; showPassword: boolean; rule: DValidateRules };
  } = {
    password: {
      value: '',
      showPassword: false,
      rule: {
        validators: [
          { required: true, message: '确认密码不能为空' },
          { minlength: 8, message: '确认密码长度不能小于8位' }
        ]
      }
    },
    confirmPassword: {
      value: '',
      showPassword: false,
      rule: {
        validators: [
          { required: true, message: '确认密码不能为空' },
          { minlength: 8, message: '确认密码长度不能小于8位' },
          { sameToPassword: this.checkSamePassword.bind(this), message: '两次输入密码不一致' }
        ]
      }
    }
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private userManagerService: UserManagerService,
    private roleManagerService: RoleManagerService
  ) {
    this.loadData();
  }

  tagTitleTranslate(field: string, value: string | boolean): string {
    if (field === 'status') {
      switch (value) {
        case 'active':
          return '启用';
        case 'inactive':
          return '禁用';
        default:
          return '未知';
      }
    } else if (field === 'superuser') {
      if (typeof value === 'boolean') {
        return value ? '是' : '否';
      }
    }
    return value.toString();
  }

  loadData() {
    this.loading = true;
    const listParams: ListParams = {
      index: this.pager.index,
      limit: this.pager.limit
    };
    this.userManagerService.getUserList(listParams).subscribe(res => {
      this.loading = false;
      this.userList = res.items;
      this.pager = res.pagination;
      this.cdr.detectChanges();
    });
  }

  onPageChange(e: number) {
    this.pager.index = e;
    this.loadData();
  }

  onSizeChange(e: number) {
    this.pager.limit = e;
    this.loadData();
  }

  openCreateUserForm() {
    this.showCreateForm = true;
    this.formRowData = { ...this.defaultRowData };
  }

  closeCreateUserForm() {
    this.showCreateForm = false;
  }

  sameToPassword(value: string) {
    return value === this.formRowData['password'];
  }

  createUser(formData: FormData) {
    this.formLoading = true;
    const user: CreateUserData = {
      username: typeof formData['username'] === 'string' ? formData['username'] : '',
      password: typeof formData['password'] === 'string' ? formData['password'] : '',
      rePassword: typeof formData['rePassword'] === 'string' ? formData['rePassword'] : '',
      name: typeof formData['name'] === 'string' ? formData['name'] : '',
      email: typeof formData['email'] === 'string' ? formData['email'] : '',
      avatar: typeof formData['avatar'] === 'string' ? formData['avatar'] : '',
      detail: typeof formData['detail'] === 'string' ? formData['detail'] : ''
    };

    this.userManagerService.createUser(user).subscribe({
      next: () => {
        this.showCreateForm = false;
        this.formLoading = false;
        this.loadData();
      },
      error: () => {
        this.formLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openEditUserForm(row: User) {
    this.selectUser = row;
    this.editDefaultRowData = {
      username: row.username,
      name: row.name,
      email: row.email,
      avatar: row.avatar,
      detail: row.detail,
      superuser: row.superuser.toString(),
      status: row.status,
      level: row.level.toString()
    };

    if (this.editorTemplate) {
      this.modelRef = this.dialogService.open({
        id: 'edit-dialog',
        width: '600px',
        maxHeight: '600px',
        title: '编辑用户信息',
        contentTemplate: this.editorTemplate,
        backdropCloseable: true,
        buttons: []
      });
    }
  }

  closeEditUserForm() {
    if (this.modelRef) {
      this.modelRef.modalInstance.hide();
    }
  }

  editUser(formData: FormData) {
    if (!this.selectUser) {
      return;
    }

    this.formLoading = true;
    const userId = this.selectUser.id;

    const body: UpdateUserData = {};

    const username = typeof formData['username'] === 'string' ? formData['username'] : '';
    if (this.selectUser.username != username) {
      body.username = username;
    }
    const name = typeof formData['name'] === 'string' ? formData['name'] : '';
    if (this.selectUser.name != name) {
      body.name = name;
    }
    const email = typeof formData['email'] === 'string' ? formData['email'] : '';
    if (this.selectUser.email != email) {
      body.email = email;
    }
    const avatar = typeof formData['avatar'] === 'string' ? formData['avatar'] : '';
    if (this.selectUser.avatar != avatar) {
      body.avatar = avatar;
    }
    const detail = typeof formData['detail'] === 'string' ? formData['detail'] : '';
    if (this.selectUser.detail != detail) {
      body.detail = detail;
    }
    const superuser = typeof formData['superuser'] === 'string' ? formData['superuser'] === 'true' : false;
    if (this.selectUser.superuser != superuser) {
      body.superuser = superuser;
    }
    const level = typeof formData['level'] === 'string' ? parseInt(formData['level'], 10) : typeof formData['level'] === 'number' ? formData['level'] : 1;
    if (this.selectUser.level != level) {
      body.level = level;
    }

    let status;
    switch (formData['status']) {
      case 'inactive':
        status = ResponseStatus.INACTIVE;
        break;
      case 'frozen':
        status = ResponseStatus.FROZEN;
        break;
      case 'obsolete':
        status = ResponseStatus.OBSOLETE;
        break;
      default:
        status = ResponseStatus.ACTIVE;
    }
    if (this.selectUser.status != status) {
      body.status = status;
    }

    if (Object.keys(body).length === 0) {
      this.selectUser = null;
      this.formLoading = false;
      if (this.modelRef !== null) {
        this.modelRef.modalInstance.hide();
      }
      return;
    }

    this.userManagerService.updateUser(userId, body).subscribe({
      next: value => {
        this.selectUser = null;
        this.formLoading = false;
        for (const user of this.userList) {
          if (user.id === userId) {
            user.username = value.username;
            user.name = value.name;
            user.email = value.email;
            user.avatar = value.avatar;
            user.detail = value.detail;
            user.superuser = value.superuser;
            user.level = value.level;
            user.status = value.status;
            break;
          }
        }
        this.cdr.detectChanges();
        if (this.modelRef !== null) {
          this.modelRef.modalInstance.hide();
        }
      },
      error: () => {
        this.formLoading = false;
      }
    });
  }

  openDeleteUserForm(row: User) {
    this.selectUser = row;

    this.modelRef = this.dialogService.open({
      id: 'delete-dialog',
      width: '346px',
      maxHeight: '600px',
      title: '删除用户',
      showAnimate: false,
      content: `确定要删除用户 ${row.name}(${row.username}) 吗？`,
      buttons: [
        {
          cssClass: 'danger',
          text: '删除',
          handler: () => {
            this.deleteUser(row.id);
          }
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: '取消',
          handler: this.closeDeleteUserForm.bind(this)
        }
      ]
    });
  }

  closeDeleteUserForm() {
    if (this.modelRef) {
      this.modelRef.modalInstance.hide();
    }
  }

  deleteUser(UerId: number) {
    this.closeDeleteUserForm();
    this.loading = true;
    this.cdr.detectChanges();
    this.userManagerService.deleteUser(UerId).subscribe({
      next: () => {
        this.loadData();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ###### begin 用户角色管理 #######
  openSetRoleForm(row: User) {
    // 初始化操作
    this.rolesPage = {
      index: 1,
      limit: 10,
      total: 0
    };
    this.userRoles = [];
    this.roles = [];

    this.selectUser = row;
    this.rolesLoading = true;
    if (this.selectUser.roles.length > 0) {
      this.roleManagerService.getRoleList({ index: this.rolesPage.index, limit: this.rolesPage.limit, ids: this.selectUser.roles }).subscribe({
        next: value => {
          this.userRoles = value.items;
          this.loadRoles();
        }
      });
    } else {
      this.loadRoles();
    }

    if (this.setRoleTemplate) {
      this.modelRef = this.dialogService.open({
        id: 'set-role-dialog',
        width: '600px',
        maxHeight: '600px',
        title: '设置用户角色',
        contentTemplate: this.setRoleTemplate,
        backdropCloseable: true,
        onClose: () => {
          this.selectUser = null;
        },
        buttons: []
      });
    }
  }

  closeSetRoleForm() {
    this.modelRef?.modalInstance.hide();
  }

  loadRoles(index = 1, limit = 10) {
    this.rolesLoading = true;
    this.roleManagerService.getRoleList({ index, limit }).subscribe({
      next: value => {
        this.rolesLoading = false;
        this.roles = [];
        for (const role of value.items) {
          if (this.userRoles.findIndex(item => item.id === role.id) === -1) {
            this.roles.push({ ...role, $checked: false });
          } else {
            this.roles.push({ ...role, $checked: true });
          }
        }
        this.userRolesAllChecked = true;
        for (const role of this.roles) {
          if (!role.$checked) {
            this.userRolesAllChecked = false;
            break;
          }
        }
        this.rolesPage = value.pagination;
        this.cdr.detectChanges();
      }
    });
  }

  checkStatusChange(item: UserRole) {
    if (item.$checked) {
      this.userRoles = [...this.userRoles, item].sort((a, b) => a.id - b.id);
      this.userRolesAllChecked = true;
      for (const role of this.roles) {
        if (!role.$checked) {
          this.userRolesAllChecked = false;
          break;
        }
      }
    } else {
      this.userRolesAllChecked = false;
      const index = this.userRoles.findIndex(role => role.id === item.id);
      if (index !== -1) {
        this.userRoles.splice(index, 1);
      }
    }
  }

  checkAllUserRoles() {
    for (const role of this.roles) {
      role.$checked = this.userRolesAllChecked;
    }

    if (this.userRolesAllChecked) {
      for (const role of this.roles) {
        if (this.userRoles.findIndex(item => item.id === role.id) === -1) {
          this.userRoles = [...this.userRoles, role];
        }
        this.userRoles = this.userRoles.sort((a, b) => a.id - b.id);
      }
    } else {
      for (const role of this.roles) {
        const index = this.userRoles.findIndex(item => item.id === role.id);
        if (index !== -1) {
          this.userRoles.splice(index, 1);
        }
      }
    }
  }

  userRolesPageSizeChange(pageSize: number) {
    this.loadRoles(this.rolesPage.index, pageSize);
  }

  userRolesPageIndexChange(pageIndex: number) {
    this.loadRoles(pageIndex, this.rolesPage.limit);
  }

  updateUserRoles() {
    this.rolesLoading = true;
    const userId = this.selectUser?.id || 0;
    const roleIds = this.userRoles.map(item => item.id);

    if (userId === 0) {
      this.rolesLoading = false;
      return;
    }
    if (this.selectUser?.roles.length === roleIds.length) {
      let isSame = true;
      for (const roleId of roleIds) {
        if (this.selectUser.roles.findIndex(item => item === roleId) === -1) {
          isSame = false;
          break;
        }
      }
      if (isSame) {
        this.rolesLoading = false;
        return;
      }
    }

    this.userManagerService.updateUserRoles(userId, roleIds).subscribe({
      next: value => {
        this.rolesLoading = false;
        if (this.selectUser) {
          this.selectUser.roles = value.roles;
        }
      },
      error: () => {
        this.rolesLoading = false;
      }
    });
  }

  // ###### end 用户角色管理 #######

  // ###### begin 重置密码 #######
  checkSamePassword(value: string) {
    return value === this.resetPasswordForm.password.value;
  }

  openResetPasswordForm(row: User) {
    // 初始化操作
    this.resetPasswordForm.password.value = '';
    this.resetPasswordForm.confirmPassword.value = '';
    this.resetPasswordForm.password.showPassword = false;
    this.resetPasswordForm.confirmPassword.showPassword = false;

    this.selectUser = row;
    if (this.resetPasswordTemplate) {
      this.modelRef = this.dialogService.open({
        id: 'reset-password-dialog',
        width: '600px',
        maxHeight: '600px',
        title: '重置密码',
        contentTemplate: this.resetPasswordTemplate,
        backdropCloseable: true,
        onClose: () => {
          this.selectUser = null;
        },
        buttons: []
      });
    }
  }

  resetPasswordSubmit() {
    const userId = this.selectUser?.id || 0;
    const password = this.resetPasswordForm.password.value;
    const confirmPassword = this.resetPasswordForm.confirmPassword.value;

    if (userId === 0 || password.length < 8 || password !== confirmPassword) {
      return;
    }

    this.resetPasswordLoading = true;
    this.userManagerService.resetPassword(userId, password, confirmPassword).subscribe({
      next: () => {
        this.modelRef?.modalInstance.hide();
        this.resetPasswordLoading = false;
      },
      error: () => {
        this.resetPasswordLoading = false;
      }
    });
  }

  // ###### end 重置密码 #######
}
